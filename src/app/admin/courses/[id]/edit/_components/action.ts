/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

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

    const updatedlesson =  lessons.map((l) =>
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

    const updatedChapters =  chapters.map((c) =>
      prisma.chapter.update({
        where: {
          id: c.id,
          courseId: courseId
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
