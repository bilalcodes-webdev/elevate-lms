import "server-only";
import { requireUser } from "../user/require-user";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export const getSidebarData = async (slug: string) => {
  const user = await requireUser();

  const course = await prisma.course.findUnique({
    where: {
      slug: slug,
    },
    select: {
      id: true,
      title: true,
      fileKey: true,
      duration: true,
      level: true,
      category: true,
      slug: true,
      chapter: {
        select: {
          id: true,
          title: true,
          position: true,
          lessons: {
            select: {
              id: true,
              title: true,
              position: true,
              description: true,
              lessonProgress: {
                where: {
                  userId: user.user.id,
                },
                select: {
                  completed: true,
                  id: true,
                  lessonId: true
                },
              },
            },
            orderBy: {
              position: "asc",
            },
          },
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!course) {
    return notFound();
  }

  const checkEnrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: user.user.id,
        courseId: course.id,
      },
    },
  });

  if (!checkEnrollment || checkEnrollment.status !== "ACTIVE") {
    return notFound();
  }

  return {
    course,
  };
};

export type SidebarDataTypes = Awaited<ReturnType<typeof getSidebarData>>;
