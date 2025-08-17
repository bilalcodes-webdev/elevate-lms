import "server-only";

import { requireAdmin } from "./require-admin";
import prisma from "@/lib/prisma";

export const getAdminDashboardData = async () => {
  await requireAdmin();

  const [totalUsers, totalCustomers, totalCourses, totalLessons] =
    await Promise.all([
      // get total users

      prisma.user.count(),

      //get total customers
      prisma.user.count({
        where: {
          enrollment: {
            some: {},
          },
        },
      }),

      //total Courses
      prisma.course.count(),

      //
      prisma.lesson.count(),
    ]);

  return {
    totalUsers,
    totalCustomers,
    totalLessons,
    totalCourses,
  };
};
