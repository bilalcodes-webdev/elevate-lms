import { AdminGetCourse } from "@/app/data/admin/admin-get-course";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EditForm from "./_components/EditForm";
import CourseStructure from "./_components/CourseStructure";

type EditProps = {
  params: {
    id: string;
  };
};

const CourseEditPage = async ({ params }: EditProps) => {
  const { id } = await params;

  const course = await AdminGetCourse(id);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        Edit Course{" "}
        <span className="text-primary underline text-xl">{course.title}</span>
      </h1>

      <Tabs defaultValue="course-st" className="w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
          <TabsTrigger value="course-st">Course Structure</TabsTrigger>
        </TabsList>
        <TabsContent value="basic-info">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-primary">
                Course Info
              </CardTitle>
              <CardDescription>Edit basic info of your course</CardDescription>
            </CardHeader>
            <CardContent>
              <EditForm courseId={id.toString()} courseData={course} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="course-st">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-primary">
                Course Structure
              </CardTitle>
              <CardDescription>
                Here you can edit you course structure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CourseStructure course={course} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default CourseEditPage;
