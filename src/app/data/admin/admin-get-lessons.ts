import "server-only";

import prisma from "@/lib/prisma";
import { requireAdmin } from "./require-admin";
import { notFound } from "next/navigation";

export const getAdminLesson = async (id: string) => {
  await requireAdmin();

  const data = await prisma.lesson.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      title: true,
      description: true,
      thumbnailUrl: true,
      videoKey: true,
      position: true
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
};

export type EditLessonType = Awaited<ReturnType<typeof getAdminLesson>>;
