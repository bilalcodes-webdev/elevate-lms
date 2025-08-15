import { getAllCourses } from "@/app/data/courses/get-public-courses";
import PublicCourses, {
  PublicCoursesSkeleton,
} from "../_components/PublicCourses";
import { Suspense } from "react";

const PublicCoursesRoute = () => {
  return (
    <div className="mt-5">
      <div className="flex flex-col space-y-2 mb-10">
        <h1 className="text-3xl md:text-4xl tracking-tighter font-bold">
          Explore our courses
        </h1>
        <p className="text-muted-foreground">
          Discover courses that fit your goals and schedule. Build skills, earn
          certificates, and transform your learning journey.
        </p>
      </div>

      <Suspense fallback={<SkeletionLoadingLayout />}>
        <RenderCourses />
      </Suspense>
    </div>
  );
};

async function RenderCourses() {
  const courses = await getAllCourses();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <PublicCourses key={course.id} data={course} />
      ))}
    </div>
  );
}

function SkeletionLoadingLayout() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 9 }).map((_, index) => {
        return <PublicCoursesSkeleton key={index} />;
      })}
    </div>
  );
}
export default PublicCoursesRoute;
