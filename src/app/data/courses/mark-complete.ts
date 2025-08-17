"use server";

import { ApiResponse } from "@/lib/type";
import { requireUser } from "../user/require-user";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const markComplete = async ({
  lessonId,
  slug,
}: {
  lessonId: string;
  slug: string;
}): Promise<ApiResponse> => {
  const user = await requireUser();

  try {
    await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: user.user.id,
          lessonId: lessonId,
        },
      },
      update: {
        completed: true,
      },
      create: {
        userId: user.user.id,
        lessonId: lessonId,
        completed: true,
      },
    });

    revalidatePath(`/dashboard/${slug}`);
    return {
      status: "success",
      message: "Mark as completed",
    };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return {
      status: "error",
      message: "Failed to mark as complete",
    };
  }
};
