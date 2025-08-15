"use client";

import { EditLessonType } from "@/app/data/admin/admin-get-lessons";
import UploadFile from "@/components/file-upload/UploadFile";
import ReichTextEditor from "@/components/rich-text-editor/RichTextEditor";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { tryCatch } from "@/hooks/try-catch";
import { lessonSchema, lessonSchemaType } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { Resolver, useForm } from "react-hook-form";
import { updateLesson } from "./action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type LessonEditFormProps = {
  data: EditLessonType;
  courseId: string;
  chapterId: string;
  lessonId: string;
};

const resolver = zodResolver(lessonSchema) as Resolver<lessonSchemaType>;

const LessonEditForm = ({
  data,
  courseId,
  chapterId,
  lessonId,
}: LessonEditFormProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<lessonSchemaType>({
    resolver,
    defaultValues: {
      name: data.title,
      description: data.description ?? undefined,
      chapterId: chapterId,
      courseId: courseId,
      thumbnailUrl: data.thumbnailUrl ?? undefined,
      videoKey: data.videoKey ?? undefined,
    },
  });

  const handleFormSubmission = (values: lessonSchemaType) => {
    startTransition(async () => {
      const { data, error } = await tryCatch(updateLesson({values, lessonId}));

      if (error) {
        toast.error(error.message || "Failed to create course");
        return;
      }

      if (data.status === "success") {
        form.reset();
        toast.success(data.message);
        router.push(`/admin/courses/${courseId}/edit`)
      }

      if (data.status === "error") {
        toast.error(data.message);
      }
    });
  };

  return (
    <div>
      <Link
        href={`/admin/courses/${courseId}/edit`}
        className={buttonVariants({ className: "mb-4" })}
      >
        <ArrowRight className="size-4 mr-1" />
        <span>Go Back</span>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Lesson Configuration</CardTitle>
          <CardDescription>
            Here you canconfigure your lesson description and more.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="space-y-6"
              onSubmit={form.handleSubmit(handleFormSubmission)}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lesson Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Lesson Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lesson Description</FormLabel>
                    <FormControl>
                      <ReichTextEditor field={field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="thumbnailUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lesson Thumbnail</FormLabel>
                    <FormControl>
                      <UploadFile
                     
                        value={field.value}
                        onChange={field.onChange}
                        fileTypeAccepted="image"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="videoKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lesson Video</FormLabel>
                    <FormControl>
                      <UploadFile
                     
                        value={field.value}
                        onChange={field.onChange}
                        fileTypeAccepted="video"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">
                {isPending ? (
                  <>
                    <Loader2 className="mr-1 size-4 animate-spin" /> Updating
                    Lesson...
                  </>
                ) : (
                  "Update Lesson"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
export default LessonEditForm;
