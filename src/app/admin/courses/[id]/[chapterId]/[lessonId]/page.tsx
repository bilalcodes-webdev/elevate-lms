import { getAdminLesson } from "@/app/data/admin/admin-get-lessons";
import LessonEditForm from "./_components/LessonEditForm";

type ParamsProps = {
  params: {
    id: string;
    chapterId: string;
    lessonId: string;
  };
};

const LessonEditPage = async ({ params }: ParamsProps) => {
  const { chapterId, lessonId, id } = await params;

  const lesson = await getAdminLesson(lessonId);

  return <LessonEditForm data={lesson} lessonId={lessonId} chapterId={chapterId} courseId={id} />;
};
export default LessonEditPage;
