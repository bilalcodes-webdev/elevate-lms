"use server";

import {
  chapterSchema,
  chapterSchemaType,
  lessonSchema,
  lessonSchemaType,
} from "./../../../../../../lib/zodSchema";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { requireAdmin } from "@/app/data/admin/require-admin";
import { ApiResponse } from "@/lib/type";
import { courseSchema, CourseSchemaType } from "@/lib/zodSchema";
import prisma from "@/lib/prisma";
import aj from "@/lib/arcjet";
import { detectBot, fixedWindow, request } from "@arcjet/next";
import { revalidatePath } from "next/cache";

const arcjet = aj
  .withRule(
    detectBot({
      mode: "LIVE",
      allow: [],
    })
  )
  .withRule(
    fixedWindow({
      mode: "LIVE",
      window: "1m",
      max: 5,
    })
  );

export const EditCourse = async (
  data: CourseSchemaType,
  courseId: string
): Promise<ApiResponse> => {
  const sesssion = await requireAdmin();

  try {
    const req = await request();

    const decision = await arcjet.protect(req, {
      fingerprint: sesssion.user.id,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return {
          status: "error",
          message: "You are blocked due to rate limit, please try again later",
        };
      } else {
        return {
          status: "error",
          message: "You are bot!, Plese contact support",
        };
      }
    }

    const result = courseSchema.safeParse(data);

    if (!result.success) {
      return {
        status: "error",
        message: "validation erro",
      };
    }

    await prisma.course.update({
      where: {
        id: courseId,
        userId: sesssion.user.id as string,
      },
      data: {
        ...result.data,
      },
    });

    return {
      status: "success",
      message: "Course updated successfully",
    };
  } catch (error) {
    console.error("Error creating course:", error);
    return {
      status: "error",
      message: "Failed to update course",
    };
  }
};

export const updateLessonsOrder = async ({
  courseId,
  chapterId,
  lessons,
}: {
  courseId: string;
  chapterId: string;
  lessons: { id: string; position: number }[];
}): Promise<ApiResponse> => {
  try {
    if (!lessons || lessons.length === 0) {
      return {
        status: "error",
        message: "There are no lesson to update",
      };
    }

    const updatedlesson = lessons.map((l) =>
      prisma.lesson.update({
        where: {
          id: l.id,
          chapterId: chapterId,
        },
        data: {
          position: l.position,
        },
      })
    );

    await prisma.$transaction(updatedlesson);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Lesson order updated successfully",
    };
  } catch (error: any) {
    console.log(error.message);
    return {
      status: "error",
      message: "Failed to update lesson order",
    };
  }
};

export const updateChapterOrder = async ({
  courseId,
  chapters,
}: {
  courseId: string;
  chapters: { id: string; position: number }[];
}): Promise<ApiResponse> => {
  try {
    if (!chapters || chapters.length === 0) {
      return {
        status: "error",
        message: "There are no chapters to update",
      };
    }

    const updatedChapters = chapters.map((c) =>
      prisma.chapter.update({
        where: {
          id: c.id,
          courseId: courseId,
        },
        data: {
          position: c.position,
        },
      })
    );

    await prisma.$transaction(updatedChapters);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Chapter order updated successfully",
    };
  } catch (error: any) {
    console.log(error.message);
    return {
      status: "error",
      message: "Failed to update Chapter order",
    };
  }
};

export const createNewChapter = async (
  values: chapterSchemaType
): Promise<ApiResponse> => {
  await requireAdmin();
  try {
    const result = chapterSchema.safeParse(values);

    if (!result.success) {
      return {
        status: "error",
        message: "Invalid Values Provided",
      };
    }

    await prisma.$transaction(async (tx) => {
      const maxPosition = await tx.chapter.findFirst({
        where: {
          courseId: result.data.courseId,
        },
        select: {
          position: true,
        },
        orderBy: {
          position: "desc",
        },
      });

      await tx.chapter.create({
        data: {
          title: result.data.name,
          courseId: result.data.courseId,
          position: (maxPosition?.position ?? 0) + 1,
        },
      });
    });

    revalidatePath(`/admin/courses/${result.data.courseId}/edit`);

    return {
      status: "success",
      message: "Chapter created successfully",
    };
  } catch (error: any) {
    console.log(error?.message);

    return {
      status: "error",
      message: "Failed to create chapter",
    };
  }
};

export const createNewLesson = async (
  values: lessonSchemaType
): Promise<ApiResponse> => {
  await requireAdmin();
  try {
    const result = lessonSchema.safeParse(values);

    if (!result.success) {
      return {
        status: "error",
        message: "Invalid Values Provided",
      };
    }

    await prisma.$transaction(async (tx) => {
      const maxPosition = await tx.lesson.findFirst({
        where: {
          chapterId: result.data.chapterId,
        },
        select: {
          position: true,
        },
        orderBy: {
          position: "desc",
        },
      });

      await tx.lesson.create({
        data: {
          title: result.data.name,
          chapterId: result.data.chapterId,
          position: (maxPosition?.position ?? 0) + 1,
        },
      });
    });

    revalidatePath(`/admin/courses/${result.data.courseId}/edit`);

    return {
      status: "success",
      message: "Lesson created successfully",
    };
  } catch (error: any) {
    console.log(error?.message);

    return {
      status: "error",
      message: "Failed to create lesson",
    };
  }
};

type DeleteAlerProps = {
  courseId: string;
  chapterId: string;
  lessonId: string;
};

export const deleteLesson = async ({
  courseId,
  chapterId,
  lessonId,
}: DeleteAlerProps): Promise<ApiResponse> => {
  await requireAdmin();

  try {
    // Validate input
    if (!courseId) {
      return { status: "error", message: "Course ID is required" };
    }
    if (!chapterId) {
      return { status: "error", message: "Chapter ID is required" };
    }
    if (!lessonId) {
      return { status: "error", message: "Lesson ID is required" };
    }

    // Find chapter and lessons
    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
      select: {
        lessons: {
          select: { id: true, position: true },
          orderBy: { position: "asc" },
        },
      },
    });

    if (!chapter) {
      return { status: "error", message: "Chapter not found" };
    }

    // Find lesson to delete
    const lessonToDelete = chapter.lessons.find((l) => l.id === lessonId);
    if (!lessonToDelete) {
      return { status: "error", message: "Lesson not found in this chapter" };
    }

    // Filter remaining lessons and sort by position
    const remainingLessons = chapter.lessons
      .filter((l) => l.id !== lessonId)
      .sort((a, b) => a.position - b.position);

    // Prepare position updates
    const positionUpdates = remainingLessons.map((l, index) =>
      prisma.lesson.update({
        where: { id: l.id },
        data: { position: index + 1 },
      })
    );

    // Delete lesson + update positions in a transaction
    await prisma.$transaction([
      ...positionUpdates,
      prisma.lesson.delete({ where: { id: lessonId } }),
    ]);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: `Lesson deleted and positions updated`,
    };
  } catch (error: any) {
    console.error("Delete lesson error:", error?.message);
    return {
      status: "error",
      message: "An unexpected error occurred while deleting the lesson",
    };
  }
};

export const deleteChapter = async (
  courseId: string,
  chapterId: string
): Promise<ApiResponse> => {
  await requireAdmin();

  try {
    if (!courseId) {
      return { status: "error", message: "Course ID is required" };
    }
    if (!chapterId) {
      return { status: "error", message: "Chapter ID is required" };
    }

    // Fetch all chapters for this course
    const chapters = await prisma.chapter.findMany({
      where: { courseId },
      orderBy: { position: "asc" },
    });

    if (!chapters.length) {
      return { status: "error", message: "No chapters found for this course" };
    }

    // Check if chapter exists
    const chapterToDelete = chapters.find((c) => c.id === chapterId);
    if (!chapterToDelete) {
      return { status: "error", message: "Chapter not found" };
    }

    // Remaining chapters after deletion
    const remainingChapters = chapters.filter((c) => c.id !== chapterId);

    // Prepare position updates for remaining chapters
    const positionUpdates = remainingChapters.map((c, index) =>
      prisma.chapter.update({
        where: { id: c.id },
        data: { position: index + 1 },
      })
    );

    // Transaction: Update positions + Delete chapter
    await prisma.$transaction([
      ...positionUpdates,
      prisma.chapter.delete({
        where: { id: chapterId },
      }),
    ]);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Chapter deleted and positions updated",
    };
  } catch (error: any) {
    console.error("Delete chapter error:", error?.message);
    return {
      status: "error",
      message: "An unexpected error occurred while deleting the chapter",
    };
  }
};
