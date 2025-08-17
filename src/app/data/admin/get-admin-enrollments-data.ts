import "server-only";

import { requireAdmin } from "./require-admin";

import prisma from "@/lib/prisma";
export const getAdminEnrollmentsData = async () => {
  await requireAdmin();

  const thirtyDaysAgo = new Date();

  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const enrollmentsData = await prisma.enrollment.findMany({
    where: {
      createdAt: {
        gte: thirtyDaysAgo,
      },
    },
    select: {
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const totalEnrollments = await prisma.enrollment.count({
    where: {
      createdAt: {
        gte: thirtyDaysAgo,
      },
    },
  });

  const last30days: { date: string; enrollment: number }[] = [];

  for (let i = 29; i >= 0; i--) {
    const date = new Date();

    date.setDate(date.getDate() - i);

    last30days.push({
      date: date.toISOString().split("T")[0],
      enrollment: 0,
    });
  }

  enrollmentsData.forEach((en) => {
    const enrollmentDate = en.createdAt.toISOString().split("T")[0];

    const findIndex = last30days.findIndex(
      (date) => date.date === enrollmentDate
    );

    if (findIndex !== -1) {
      last30days[findIndex].enrollment++;
    }
  });

  return {
    data: last30days,
    totalEnrollments: totalEnrollments,
  };
};


export type EnrollmentDataTypes = Awaited<ReturnType <typeof getAdminEnrollmentsData>>