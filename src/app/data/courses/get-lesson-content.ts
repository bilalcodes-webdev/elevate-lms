import { notFound } from "next/navigation";
import { requireUser } from "../user/require-user";
import prisma from "@/lib/prisma";
export const getLessonContent = async (lessonId: string) => {
  const user = await requireUser();

  const lesson = await prisma.lesson.findUnique({
    where: {
      id: lessonId,
    },
    select: {
      id: true,
      title: true,
      description: true,
      position: true,
      thumbnailUrl: true,
      videoKey: true,
      lessonProgress: {
        where: {
          userId: user.user.id,
        },
        select: {
          completed: true,
          lessonId: true,
        },
      },
      chapter: {
        select: {
          courseId: true,
          course: {
            select: {
              slug: true,
            },
          },
        },
      },
    },
  });

  if (!lesson) {
    return notFound();
  }

  const checkEnrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: user.user.id,
        courseId: lesson?.chapter.courseId,
      },
    },
    select: {
      status: true,
    },
  });

  if (!checkEnrollment || checkEnrollment.status !== "ACTIVE") {
    return notFound();
  }

  return lesson;
};

export type lessonContentType = Awaited<ReturnType<typeof getLessonContent>>;
