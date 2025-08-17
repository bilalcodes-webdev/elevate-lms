import { requireUser } from "../user/require-user";
import prisma from "@/lib/prisma";
export const checkUserEnolmentStatus = async (
  courseId: string
): Promise<boolean> => {
  const session = await requireUser();

  const enrolledCourse = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.user.id,
        courseId: courseId,
      },
    },
    select: {
      status: true,
    },
  });

  return enrolledCourse?.status === "ACTIVE" ? true : false;
};
