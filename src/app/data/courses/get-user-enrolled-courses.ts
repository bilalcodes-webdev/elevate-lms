import { requireUser } from "../user/require-user";
import prisma from "@/lib/prisma";

export const getUserEnrolledCourse = async () => {
  const session = await requireUser();

  const courses = await prisma.enrollment.findMany({
    where: {
      userId: session.user.id,
      status: "ACTIVE",
    },
    select: {
      course: {
        select: {
          id: true,
          title: true,
          smallDescription: true,
          slug: true,
          duration: true,
          fileKey: true,
          level: true,
          chapter: {
            select: {
              id: true,
              lessons: {
                select: {
                  id: true,
                  lessonProgress: {
                    where: {
                      userId: session.user.id,
                    },
                    select: {
                      id: true,
                      completed: true,
                      lessonId: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  return courses;
};

export type UserEnrolledCoursesType = Awaited<
  ReturnType<typeof getUserEnrolledCourse>
>[0];
