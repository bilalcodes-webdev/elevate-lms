import { AdminGetCourses } from "@/app/data/admin/admin-get-courses";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import AdminCourseCard from "./_components/AdminCourseCard";

const AdminCoursespage = async () => {
  const data = await AdminGetCourses();
  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Your Courses</h2>
        <Link className={buttonVariants()} href={"/admin/courses/create"}>
          Create Course
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
        {data.map((course) => (
          <AdminCourseCard key={course.id} data={course} />
        ))}
      </div>
    </>
  );
};
export default AdminCoursespage;
