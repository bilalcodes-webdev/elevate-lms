import { z } from "zod";

export const courseLevels = ["BEGINNER", "INTERMIDIATE", "ADVANCE"] as const;
export const courseStatus = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;

export const courseCategories = [
  "Web Development",
  "Data Science",
  "Machine Learning",
  "Mobile Development",
  "UI/UX Design",
  "Cybersecurity",
  "Cloud Computing",
  "Game Development",
  "Digital Marketing",
  "Blockchain",
  "Business Analytics",
  "Artificial Intelligence",
  "DevOps",
  "Software Testing",
  "Photography",
] as const;

export const courseSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Course title is required." })
    .max(50, { message: "Max 50 characters allowed." }),

  description: z
    .string()
    .min(3, { message: "At least 3 characters required." })
    .max(500, { message: "Max 250 characters allowed." }),

  fileKey: z.string().min(1, { message: "Please upload a file." }),

  price: z.coerce
    .number({ message: "Price is required" })
    .min(1, { message: "Price must be at least 1." }),

  duration: z.coerce
    .number({ message: "Duration is required" })
    .min(1, { message: "Minimum 1 hour required." })
    .max(500, { message: "Cannot exceed 500 hours." }),

  level: z.enum(courseLevels, { message: "Please select a course level." }),

  category: z.enum(courseCategories, { message: "Category is required" }),

  smallDescription: z
    .string()
    .min(3, { message: "At least 3 characters required." })
    .max(150, { message: "Max 150 characters allowed." }),

  slug: z.string().min(3, { message: "Slug must be at least 3 characters." }),

  status: z.enum(courseStatus, {
    message: "Please select a valid course status.",
  }),
});

export const chapterSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Chapter name must contain 3 length or more" }),
  courseId: z.string().uuid(),
});

export const lessonSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Chapter name must contain 3 length or more" }),
  courseId: z.string().uuid(),
  chapterId: z.string().uuid(),
  description: z.string().optional(),
  videoKey: z.string().optional(),
  thumbnailUrl: z.string().optional(),
});

export type lessonSchemaType = z.infer<typeof lessonSchema>;

export type chapterSchemaType = z.infer<typeof chapterSchema>;

export type CourseSchemaType = z.infer<typeof courseSchema>;
