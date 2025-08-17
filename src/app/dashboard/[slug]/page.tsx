import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getSidebarData } from "@/app/data/courses/get-user-sidebar-data";
import { redirect } from "next/navigation";

const CourseSlugPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;

  const course = await getSidebarData(slug);

  const firstChapter = course.course?.chapter?.[0];
  const firestLesson = firstChapter?.lessons?.[0];

  if (firestLesson) {
    redirect(`/dashboard/${course.course.slug}/${firestLesson.id}`);
  }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Card className="w-[400px] text-center">
        <CardHeader>
          <CardTitle className="text-primary">No Lessons Available</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This course doesn’t have any lessons yet.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/courses">
            <Button variant={"outline"}>Browse Courses</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CourseSlugPage;
