import { getSidebarData } from "@/app/data/courses/get-user-sidebar-data";
import { ReactNode } from "react";
import CourseSidebar from "../_components/CourseSidebar";

const CourseSlugPageLayout = async ({
  children,
  params,
}: {
  children: ReactNode;
  params: { slug: string };
}) => {
  const { slug } = await params;

  const course = await getSidebarData(slug);
  return (
    <div className="flex flex-1">
      {/* Sidebar */}
      <div className="w-96 border-r border-border shrink-0">
        <CourseSidebar course={course.course} />
      </div>

      {/* main */}
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
};
export default CourseSlugPageLayout;
