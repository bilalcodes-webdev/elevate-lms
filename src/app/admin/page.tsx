import { ChartAreaInteractive } from "@/components/sidebar/chart-area-interactive";
import { SectionCards } from "@/components/sidebar/section-cards";
import { getAdminEnrollmentsData } from "../data/admin/get-admin-enrollments-data";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getAdminRecentCourse } from "../data/admin/get-admin-recent-courses";
import { EmptyState } from "@/components/empty-state/EmptyState";
import AdminCourseCard, { AdminCourseCardSkeleton } from "./courses/_components/AdminCourseCard";
import { Suspense } from "react";

const AdminHomepage = async () => {
  const data = await getAdminEnrollmentsData();

  return (
    <>
      <SectionCards />

      <ChartAreaInteractive data={data} />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Courses</h2>
          <Link
            href={"/admin/courses"}
            className={buttonVariants({ variant: "outline" })}
          >
            View All Courses
          </Link>
        </div>

        {/* Suspense boundary */}
        <Suspense fallback={<RenderRecentCourseSkeleton />}>
          <RenderRecentCourse />
        </Suspense>
      </div>
    </>
  );
};

async function RenderRecentCourse() {
  const courses = await getAdminRecentCourse();

  if (courses.length === 0) {
    return (
      <div className="w-full h-auto">
        <EmptyState
          buttonText="Create New Course"
          description="You have no course yet, click the button to create a new one"
          title="No Course Found"
          redirectTo="/admin/courses/create"
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <AdminCourseCard key={course.id} data={course} />
      ))}
    </div>
  );
}

/* Skeleton Grid Loader */
function RenderRecentCourseSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <AdminCourseCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default AdminHomepage;
