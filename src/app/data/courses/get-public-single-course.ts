"use server"

import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";

export const getPublicSingleCourse = async (slug: string) => {
  const data = await prisma.course.findUnique({
    where: {
      slug: slug,
    },
    select: {
      id: true,
      title: true,
      description: true,
      smallDescription: true,
      category: true,
      level: true,
      price: true,
      slug: true,
      status: true,
      fileKey: true,
      duration: true,
      createdAt: true,
      updatedAt: true,
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

  if (!data) {
    return redirect(notFound());
  }

  return data
};


export type PublicSingleCourseType = Awaited<ReturnType <typeof getPublicSingleCourse>>
