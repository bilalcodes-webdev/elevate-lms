"use server"

import { revalidatePath } from 'next/cache';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { requireAdmin } from "@/app/data/admin/require-admin";
import { ApiResponse } from "@/lib/type";
import { lessonSchema, lessonSchemaType } from "@/lib/zodSchema";
import prisma from "@/lib/prisma";


type updateLessonProps = {
  values: lessonSchemaType;
  lessonId: string;
};

export const updateLesson = async ({
  values,
  lessonId,
}: updateLessonProps): Promise<ApiResponse> => {
  await requireAdmin();

  try {
    const validateData = lessonSchema.safeParse(values);

    if (!validateData.success) {
      return {
        status: "error",
        message: "Invalid values",
      };
    }

    await prisma.lesson.update({
      where: {
        id: lessonId,
        chapterId: validateData.data.chapterId,
      },
      data: {
        title: validateData.data.name,
        description: validateData.data.description,
        thumbnailUrl: validateData.data.thumbnailUrl,
        videoKey: validateData.data.videoKey,
      },
    });

    revalidatePath(`/admin/courses/${validateData.data.courseId}/edit`);

    return {
      status: "success",
      message: "Lesson updated successfully",
    };
  } catch (error: any) {
    console.log(error?.message);
    return {
      status: "error",
      message: "Failed to update lesson",
    };
  }
};
