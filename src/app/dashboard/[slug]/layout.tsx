import { ReactNode } from "react";
import { getSidebarData } from "@/app/data/courses/get-user-sidebar-data";
import CourseLayoutClient from "./_components/CouseLayout";

const CourseSlugPageLayout = async ({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const course = await getSidebarData(slug);

  return (
    <CourseLayoutClient course={course.course}>{children}</CourseLayoutClient>
  );
};

export default CourseSlugPageLayout;
