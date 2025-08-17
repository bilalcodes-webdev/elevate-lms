"use client";

import { SidebarDataTypes } from "@/app/data/courses/get-user-sidebar-data";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { CollapsibleTrigger } from "@radix-ui/react-collapsible";
import { ChevronDown, Play } from "lucide-react";
import LessonItem from "./LessonItem";
import { usePathname } from "next/navigation";
import { useTrackProgress } from "@/hooks/track-progress";

const CourseSidebar = ({ course }: { course: SidebarDataTypes["course"] }) => {
  const pathname = usePathname();
  const { completedLessons, percentage, totalLesson } =
    useTrackProgress(course);

  const currentLessonId = pathname.split("/").pop();
  return (
    <div className="flex flex-col h-full">
      <div className="pb-4 pr-4 border-b border-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Play className="size-5 text-primary" />
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="font-semibold  text-base leading-tight truncate">
              {course.title}
            </h1>
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {course.category}
            </p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progress </span>
            <span className="font-medium">
              {completedLessons}/{totalLesson} Lessons
            </span>
          </div>
          <Progress value={percentage} className="h-1.5" />
          <p className="text-xs text-muted-foreground">
            {percentage}% completed
          </p>
        </div>
      </div>

      <div className="py-4 pr-4 space-y-3">
        {course.chapter.map((chapter, index) => (
          <Collapsible key={chapter.id} defaultOpen={index === 0}>
            <CollapsibleTrigger asChild>
              <Button
                className="w-full h-auto p-3 flex items-center justify-between gap-2"
                variant="outline"
              >
                <div className="flex items-center gap-2 min-w-0 overflow-hidden flex-1">
                  <ChevronDown className="size-4 shrink-0" />
                  <p className="font-semibold text-sm truncate text-foreground">
                    {chapter.position} : {chapter.title}
                  </p>
                </div>
                <span className="text-[10px] font-medium text-muted-foreground shrink-0">
                  {chapter.lessons.length} Lessons
                </span>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 pl-6 border-l-2 space-y-3">
              {chapter.lessons.map((lesson) => (
                <LessonItem
                  key={lesson.id}
                  lesson={lesson}
                  slug={course.slug}
                  isActive={currentLessonId === lesson.id}
                  completed={
                    lesson.lessonProgress.find(
                      (progress) => progress.lessonId === lesson.id
                    )?.completed || false
                  }
                />
              ))}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );
};
export default CourseSidebar;
