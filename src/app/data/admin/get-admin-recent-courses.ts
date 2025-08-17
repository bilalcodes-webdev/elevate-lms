import "server-only";

import { requireAdmin } from "./require-admin";
import prisma from "@/lib/prisma";
export const getAdminRecentCourse = async () => {
  await requireAdmin();

  const courses = await prisma.course.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      smallDescription: true,
      duration: true,
      price: true,
      slug: true,
      status: true,
      level: true,
      fileKey: true,
    },
    take: 3,
  });

  return courses;
};

export type AdminRecentCoursType = Awaited<
  ReturnType<typeof getAdminRecentCourse>
>;
