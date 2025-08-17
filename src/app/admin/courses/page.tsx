import { AdminGetCourses } from "@/app/data/admin/admin-get-courses";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import AdminCourseCard, {
  AdminCourseCardSkeleton,
} from "./_components/AdminCourseCard";
import { EmptyState } from "@/components/empty-state/EmptyState";
import { Suspense } from "react";

const AdminCoursespage = async () => {
  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Your Courses</h2>
        <Link className={buttonVariants()} href={"/admin/courses/create"}>
          Create Course
        </Link>
      </div>

      <Suspense fallback={<LoadingSkeleton />}>
        <RenderCourseData />
      </Suspense>
    </>
  );
};

const RenderCourseData = async () => {
  const data = await AdminGetCourses();

  return (
    <>
      {data.length === 0 ? (
        <EmptyState
          title="No Course Found"
          description="Plase click the button below to generate a new one."
          buttonText="Create New Course"
          redirectTo="/admin/courses/create"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((course) => (
            <AdminCourseCard key={course.id} data={course} />
          ))}
        </div>
      )}
    </>
  );
};

const LoadingSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 4 }).map((_, index) => {
        return <AdminCourseCardSkeleton key={index} />;
      })}
    </div>
  );
};

export default AdminCoursespage;
