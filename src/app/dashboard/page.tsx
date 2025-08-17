import { EmptyState } from "@/components/empty-state/EmptyState";
import { getAllCourses } from "../data/courses/get-public-courses";
import { getUserEnrolledCourse } from "../data/courses/get-user-enrolled-courses";
import PublicCourses from "../(guest)/_components/PublicCourses";

import EnrollCourseProgress from "./_components/CourseProgressCard";

const Page = async () => {
  const [courses, enrolledCourses] = await Promise.all([
    getAllCourses(),
    getUserEnrolledCourse(),
  ]);

  // 🔑 filter only those courses which user has not enrolled in
  const availableCourses = courses.filter(
    (course) =>
      !enrolledCourses.some(({ course: enroll }) => enroll.id === course.id)
  );

  return (
    <>
      {/* Enrolled Courses */}
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-semibold">Enrolled Courses</h2>
        <p className="text-muted-foreground">
          Here you can see courses which you currently have access to.
        </p>
      </div>

      {enrolledCourses.length === 0 ? (
        <EmptyState
          buttonText="Browse Courses"
          description="You have not purchased any course yet. Please buy one to access it."
          redirectTo="/courses"
          title="No Course Purchased"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {enrolledCourses.map((course) => (
            <EnrollCourseProgress key={course.course.id} data={course} />
          ))}
        </div>
      )}

      {/* Available Courses */}
      <section className="mt-10">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-semibold">Available Courses</h2>
          <p className="text-muted-foreground">
            Here you can see courses which are currently available.
          </p>
        </div>

        {availableCourses.length === 0 ? (
          <EmptyState
            buttonText="Browse Courses"
            description="You have already bought all available courses."
            redirectTo="/courses"
            title="No Course Available"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {availableCourses.map((course) => (
              <PublicCourses key={course.id} data={course} />
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default Page;
