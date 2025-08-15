"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { ApiResponse } from "@/lib/type";

import prisma from "@/lib/prisma";

export const debugCourseRelations = async (courseId: string) => {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: {
      id: true,
      title: true,
      chapter: {
        select: {
          id: true,
          title: true,
          lessons: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      },
    },
  });

  console.log(JSON.stringify(course, null, 2));
};

export const deleteCourse = async (id: string): Promise<ApiResponse> => {
  await requireAdmin();

  try {
    if (!id) return { status: "error", message: "require course id not found" };

await prisma.course.delete({
      where: { id: id },
    });

 
    return {
      status: "success",
      message: "Course deleted successfully",
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error?.message);
    return {
      status: "error",
      message: "Failed to delete course",
    };
  }
};
