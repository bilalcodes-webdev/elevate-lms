import prisma from "@/lib/prisma";

export const getAllCourses = async () => {
  const data = await prisma.course.findMany({
    where: {
      status: "PUBLISHED",
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      title: true,
      smallDescription: true,
      category: true,
      fileKey: true,
      slug: true,
      price: true,
      id: true,
      level: true,
      duration: true,
    },
  });

  return data;
};

export type PublicCoursesType = Awaited<ReturnType<typeof getAllCourses>>[0];
