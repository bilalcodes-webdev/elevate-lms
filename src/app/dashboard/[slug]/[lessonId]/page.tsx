import { getLessonContent } from "@/app/data/courses/get-lesson-content";
import LessonContentPage from "./_components/Content";
import { Suspense } from "react";
import LessonSkeleton from "../../_components/LessonSkeleton";

const LessonPage = async ({ params }: {params: Promise<{lessonId: string}>}) => {
  const { lessonId } = await params;

  return (
    <Suspense fallback={<LessonSkeleton />}>
      <RenderLesson lessonId={lessonId} />;
    </Suspense>
  );
};

const RenderLesson = async ({ lessonId }: { lessonId: string }) => {
  const lesson = await getLessonContent(lessonId);

  return <LessonContentPage data={lesson} />;
};
export default LessonPage;
