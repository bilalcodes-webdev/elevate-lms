"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  courseCategories,
  courseLevels,
  courseSchema,
  courseStatus,
  type CourseSchemaType,
} from "@/lib/zodSchema";
import { ArrowLeft, Loader2, PlusIcon, SparkleIcon } from "lucide-react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import slugify from "slugify";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ReichTextEditor from "@/components/rich-text-editor/RichTextEditor";
import UploadFile from "@/components/file-upload/UploadFile";
import { useTransition } from "react";
import { tryCatch } from "@/hooks/try-catch";
import { CreateCourse } from "./action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useConfetti } from "@/hooks/use-confetti";

const resolver = zodResolver(courseSchema) as Resolver<CourseSchemaType>;

const AdminCreateCoursePage = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { triggerConfetti } = useConfetti();
  const form = useForm<CourseSchemaType>({
    resolver,
    defaultValues: {
      title: "",
      category: "Digital Marketing",
      description: "",
      price: 0,
      duration: 0,
      fileKey: "",
      level: "BEGINNER",
      slug: "",
      smallDescription: "",
      status: "DRAFT",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: CourseSchemaType) {
    startTransition(async () => {
      const { data, error } = await tryCatch(CreateCourse(values));

      if (error) {
        toast.error(error.message || "Failed to create course");
        return;
      }

      if (data.status === "success") {
        toast.success(data.message);
        triggerConfetti();
        form.reset();
        router.push("/admin/courses");
      }

      if (data.status === "error") {
        toast.error(data.message);
      }
    });
  }

  return (
    <>
      <div className="flex items-center gap-4">
        <Link
          href={"/admin/courses"}
          className={buttonVariants({
            variant: "outline",
            size: "icon",
          })}
        >
          <ArrowLeft className="size-4" />
        </Link>
        <h1 className="text-2xl font-bold">Create Course</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create a New Course</CardTitle>
          <CardDescription>
            Fill out the details below to add a new course to your platform.
            Provide a title, description, category, level, price, and other
            relevant information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter title here..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col gap-1">
                <div className="flex w-full gap-2">
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem className="flex-1 m-0">
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input placeholder="Slug" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    className="self-end h-[38px]" // roughly input height, adjust if needed
                    onClick={() => {
                      const slugTitle = form.getValues("title");
                      const generateSlug = slugify(slugTitle);
                      form.setValue("slug", generateSlug, {
                        shouldValidate: true,
                      });
                    }}
                  >
                    Generate Slug <SparkleIcon className="ml-1" size={16} />
                  </Button>
                </div>

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ fieldState }) => (
                    <div className="text-destructive">
                      {fieldState.error ? fieldState.error.message : null}
                    </div>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="smallDescription"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Small Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter Small Description"
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <ReichTextEditor field={field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fileKey"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Image Thumbnail</FormLabel>
                    <FormControl>
                      <UploadFile
                        fileTypeAccepted="image"
                        onChange={field.onChange}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Category</FormLabel>
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {courseCategories.map((c, index) => (
                            <SelectItem key={index} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Course Level</FormLabel>
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Course Level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {courseLevels.map((level, index) => (
                            <SelectItem key={index} value={level}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Course Duration (hours)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Course Duaration"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Course Price ($)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Course Price"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Course Status</FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {courseStatus.map((status, index) => (
                          <SelectItem key={index} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button disabled={isPending} type="submit">
                {isPending ? (
                  <>
                    <Loader2 className="mr-1 size-4 animate-spin" />
                    Creating Course...
                  </>
                ) : (
                  <>
                    <PlusIcon className="ml-1 size-4" />
                    Create Course
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
};

export default AdminCreateCoursePage;
