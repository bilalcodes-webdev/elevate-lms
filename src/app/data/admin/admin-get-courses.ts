import "server-only";
import prisma from "@/lib/prisma";
import { requireAdmin } from "./require-admin";

export const AdminGetCourses = async () => {
  await requireAdmin();

  const data = await prisma.course.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      smallDescription: true,
      duration: true,
      level: true,
      status: true,
      price: true,
      fileKey: true,
      slug: true,
    },
  });


  return data;
};

export type AdminCourseType = Awaited<ReturnType<typeof AdminGetCourses>>[0];
