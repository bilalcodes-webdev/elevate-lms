/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { AdminSingleCourseType } from "@/app/data/admin/admin-get-course";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import {
  DndContext,
  DraggableSyntheticListeners,
  KeyboardSensor,
  PointerSensor,
  rectIntersection,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  GripVertical,
} from "lucide-react";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import { toast } from "sonner";
import { updateChapterOrder, updateLessonsOrder } from "./action";
import NewChapterModal from "./NewChapterModal";
import NewLessonModal from "./NewLessonModal";
import DeleteDilogueAlter from "./DeleteDilogueAlter";
import DeleteChapter from "./DeleteChapter";

type CourseStructureProps = {
  course: AdminSingleCourseType;
};

interface SortableItemsProps {
  id: string;
  children: (listeners: DraggableSyntheticListeners) => ReactNode;
  className?: string;
  data?: {
    type: "chapter" | "lesson";
    chapterId?: string;
  };
}

function SortableItem({ children, id, className, data }: SortableItemsProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id, data: data });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={cn(`touch-none`, className)}
    >
      {children(listeners)}
    </div>
  );
}

const CourseStructure = ({ course }: CourseStructureProps) => {
  const initialData =
    course.chapter.map((chapter) => ({
      id: chapter.id,
      title: chapter.title,
      order: chapter.position,
      isOpen: true,
      lessons: chapter.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        order: lesson.position,
      })),
    })) || [];

  const [items, setItems] = useState(initialData);

  useEffect(() => {
    setItems((pr) => {
      const updatedCourseData =
        course.chapter.map((chapter) => ({
          id: chapter.id,
          title: chapter.title,
          order: chapter.position,
          isOpen: pr.find((p) => p.id === chapter.id)?.isOpen ?? true,
          lessons: chapter.lessons.map((lesson) => ({
            id: lesson.id,
            title: lesson.title,
            order: lesson.position,
          })),
        })) || [];

      return updatedCourseData;
    });
  }, [course]);

  function handleDragEnd(event: { active: any; over: any }) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const activeId = active.id;
    const overId = over.id;
    const activeType = active.data.current?.type as "chapter" | "lesson";
    const overType = over.data.current?.type as "chapter" | "lesson";
    const courseId = course.id;

    if (activeType === "chapter") {
      let targetChapterId = null;

      if (overType === "chapter") {
        targetChapterId = overId;
      } else if (overType === "lesson") {
        targetChapterId = over.data.current?.chapterId ?? null;
      }

      if (!targetChapterId) {
        toast.error("Could not determine the chapter for reordering");
      }

      const oldIndex = items.findIndex((item) => item.id === activeId);
      const newIndex = items.findIndex((item) => item.id === targetChapterId);

      if (oldIndex === -1 || newIndex === -1) {
        toast.error("Could not din new/old index for reordering");
        return;
      }

      const localOrderChapters = arrayMove(items, oldIndex, newIndex);

      const updatedChapterForState = localOrderChapters.map(
        (chapter, index) => ({
          ...chapter,
          order: index + 1,
        })
      );

      const oldChapterItem = [...items];

      setItems(updatedChapterForState);

      if (courseId) {
        const updatedChapters = updatedChapterForState.map((c) => ({
          id: c.id,
          position: c.order,
        }));

        const lessonOrderPromise = () =>
          updateChapterOrder({
            courseId,
            chapters: updatedChapters,
          });

        toast.promise(lessonOrderPromise, {
          loading: "Reordering Chapters...",
          success: (result) => {
            if (result.status === "success") {
              return result.message;
            }
            throw new Error(result.message);
          },
          error: () => {
            setItems(oldChapterItem);
            return "Failed to reorder chapters";
          },
        });
      }
    }

    if (activeType === "lesson" && overType === "lesson") {
      const activeChapterId = active.data.current?.chapterId;
      const overChapterId = over.data.current?.chapterId;

      if (!activeChapterId || activeChapterId !== overChapterId) {
        toast.error("Moving lessons to another chapter are not allowed");
        return;
      }

      const chapterToUpdateIndex = items.findIndex(
        (chapter) => chapter.id === activeChapterId
      );

      if (chapterToUpdateIndex === -1) {
        toast.error("Could not find chapter to update lessons");
        return;
      }

      const chapterToUpdate = items[chapterToUpdateIndex];
      const oldLessonIndex = chapterToUpdate.lessons.findIndex(
        (l) => l.id === activeId
      );
      const newLessonIndex = chapterToUpdate.lessons.findIndex(
        (l) => l.id === overId
      );

      if (oldLessonIndex === -1 || newLessonIndex === -1) {
        toast.error("Could not find old/new lesson index for reordering");
        return;
      }

      const updateLocalLesson = arrayMove(
        chapterToUpdate.lessons,
        oldLessonIndex,
        newLessonIndex
      );

      const updateLessonDataForState = updateLocalLesson.map((l, index) => ({
        ...l,
        order: index + 1,
      }));

      const newItems = [...items];

      newItems[chapterToUpdateIndex] = {
        ...chapterToUpdate,
        lessons: updateLessonDataForState,
      };

      const previousItem = [...newItems];

      setItems(newItems);

      if (courseId) {
        const updatedLesson = updateLessonDataForState.map((l) => ({
          id: l.id,
          position: l.order,
        }));

        const lessonOrderPromise = () =>
          updateLessonsOrder({
            courseId,
            chapterId: activeChapterId,
            lessons: updatedLesson,
          });

        toast.promise(lessonOrderPromise, {
          loading: "Reordering Lessons...",
          success: (result) => {
            if (result.status === "success") {
              return result.message;
            }
            throw new Error(result.message);
          },
          error: () => {
            setItems(previousItem);
            return "Failed to reorder lessons";
          },
        });
      }

      return;
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleIsOpen = (chapterId: string) => {
    return setItems(
      items.map((item) =>
        item.id === chapterId ? { ...item, isOpen: !item.isOpen } : item
      )
    );
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragEnd={handleDragEnd}
    >
      <Card>
        <CardHeader className="flex items-center justify-between flex-row border-b border-border">
          <CardTitle>Chapters</CardTitle>
          <NewChapterModal courseId={course.id} />
        </CardHeader>
        <CardContent className="space-y-4">
          <SortableContext strategy={verticalListSortingStrategy} items={items}>
            {items.map((item) => (
              <SortableItem
                key={item.id}
                data={{ type: "chapter" }}
                id={item.id}
              >
                {(listeners) => (
                  <Card>
                    <Collapsible
                      open={item.isOpen}
                      onOpenChange={() => handleIsOpen(item.id)}
                    >
                      <div className="flex items-center justify-between p-3 border-b border-border">
                        <div className="flex items-center gap-2">
                          <Button
                            variant={"ghost"}
                            size={"icon"}
                            className="cursor-grab opacity-60 hover:opacity-100"
                            {...listeners}
                          >
                            <GripVertical className="size-4" />
                          </Button>
                          <CollapsibleTrigger asChild>
                            <Button variant={"ghost"} size={"icon"}>
                              {item.isOpen ? (
                                <ChevronDown className="size-4" />
                              ) : (
                                <ChevronRight className="size-4" />
                              )}
                            </Button>
                          </CollapsibleTrigger>
                          <p className="hover:text-primary cursor-pointer pl-2">
                            {item.title}
                          </p>
                        </div>

                        <DeleteChapter
                          courseId={course.id}
                          chapterId={item.id}
                        />
                      </div>

                      <CollapsibleContent>
                        <div className="p-1">
                          <SortableContext
                            items={item.lessons.map((l) => l.id)}
                            strategy={verticalListSortingStrategy}
                          >
                            {item.lessons.map((l) => (
                              <SortableItem
                                key={l.id}
                                id={l.id}
                                data={{ type: "lesson", chapterId: item.id }}
                              >
                                {(lessonListeners) => (
                                  <div className="flex items-center justify-between p-2 hover:bg-accent rounded-sm">
                                    <div className="flex items-center gap-2">
                                      <Button
                                        variant={"ghost"}
                                        size={"icon"}
                                        className="cursor-grab opacity-60 hover:opacity-100"
                                        {...lessonListeners}
                                      >
                                        <GripVertical className="size-4" />
                                      </Button>
                                      <FileText className="size-4" />
                                      <Link
                                        className="hover:text-primary cursor-pointer pl-2"
                                        href={`/admin/courses/${course.id}/${item.id}/${l.id}`}
                                      >
                                        {l.title}
                                      </Link>
                                    </div>
                                    <DeleteDilogueAlter
                                      courseId={course.id}
                                      chapterId={item.id}
                                      lessonId={l.id}
                                    />
                                  </div>
                                )}
                              </SortableItem>
                            ))}
                          </SortableContext>

                          <div className="py-2">
                            <NewLessonModal
                              chapterId={item.id}
                              courseId={course.id}
                            />
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                )}
              </SortableItem>
            ))}
          </SortableContext>
        </CardContent>
      </Card>
    </DndContext>
  );
};
export default CourseStructure;
