import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DeleteActions from "./_components/DeleteActions";

const AdminCourseDeletePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  return (
    <div className="max-w-lg mx-auto w-full">
      <Card className="mt-32">
        <CardHeader>
          <CardTitle>Are you sure you want to delete this course?</CardTitle>
          <CardDescription>
            This action not be undone and it will delete all relevent chapters
            and lessons
          </CardDescription>
          <CardContent className="flex items-center justify-between mt-4">
            <DeleteActions courseId={id} />
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
};
export default AdminCourseDeletePage;
