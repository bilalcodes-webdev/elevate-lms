import { getAdminLesson } from "@/app/data/admin/admin-get-lessons";
import LessonEditForm from "./_components/LessonEditForm";

const LessonEditPage = async ({ params }: {params : Promise<{id: string, chapterId: string, lessonId: string}>}) => {
  const { chapterId, lessonId, id } = await params;

  const lesson = await getAdminLesson(lessonId);

  return <LessonEditForm data={lesson} lessonId={lessonId} chapterId={chapterId} courseId={id} />;
};
export default LessonEditPage;
