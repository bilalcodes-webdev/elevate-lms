import "server-only";
import { notFound } from "next/navigation";
import { requireAdmin } from "./require-admin";
import prisma from "@/lib/prisma";

export const AdminGetCourse = async (id: string) => {
  await requireAdmin();

  const data = await prisma.course.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      title: true,
      description: true,
      smallDescription: true,
      fileKey: true,
      category: true,
      duration: true,
      price: true,
      slug: true,
      level: true,
      status: true,
      chapter: {
        select: {
          id: true,
          title: true,
          position: true,
          lessons: {
            select: {
              id: true,
              title: true,
              description: true,
              position: true,
              videoKey: true,
              thumbnailUrl: true,
            },
          },
        },
      },
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
};

export type AdminSingleCourseType = Awaited<ReturnType<typeof AdminGetCourse>>;
