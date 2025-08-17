"use client";

import { useState, useEffect, useTransition } from "react";
import { lessonContentType } from "@/app/data/courses/get-lesson-content";
import { markComplete } from "@/app/data/courses/mark-complete";
import RenderDescription from "@/components/rich-text-editor/RenderDescription";
import { Button } from "@/components/ui/button";
import { tryCatch } from "@/hooks/try-catch";
import { ConstructUrl } from "@/hooks/use-constructer";
import { BookIcon, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

const VideoPlayer = ({
  thumbnailUrl,
  videoKey,
}: {
  thumbnailUrl: string;
  videoKey: string;
}) => {
  const videoUrl = ConstructUrl(videoKey);
  const thumbnail = ConstructUrl(thumbnailUrl);

  if (!videoKey) {
    return (
      <div className="aspect-video bg-muted rounded-lg flex flex-col items-center justify-center">
        <BookIcon className="size-16 text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">
          This lesson does not have a video yet
        </p>
      </div>
    );
  }

  return (
    <div className="aspect-video bg-black rounded-lg relative overflow-hidden">
      <video
        src={videoUrl}
        className="w-full h-full object-cover"
        controls
        poster={thumbnail}
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag!
      </video>
    </div>
  );
};

const LessonContentPage = ({ data }: { data: lessonContentType }) => {
  const [isPending, startTransition] = useTransition();
  const [isCompleted, setIsCompleted] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [parsedDescription, setParsedDescription] = useState<any>({});

  // Check lessonProgress from data
  useEffect(() => {
    const completed = data.lessonProgress?.find(
      (lp) => lp.lessonId === data.id && lp.completed
    );
    setIsCompleted(!!completed);

    // Safe JSON parsing
    if (data.description) {
      try {
        setParsedDescription(JSON.parse(data.description));
      } catch (e) {
        console.error("Invalid JSON in description:", e);
        setParsedDescription({});
      }
    }
  }, [data]);

  const onSubmit = () => {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        markComplete({ lessonId: data.id, slug: data.chapter.course.slug })
      );

      if (error) {
        toast.error("Unknown error, please try again");
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        setIsCompleted(true); // mark as completed locally
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <div className="pl-6 flex flex-col h-full bg-background">
      <VideoPlayer
        thumbnailUrl={data.thumbnailUrl ?? ""}
        videoKey={data.videoKey ?? ""}
      />

      <div className="py-4 border-b">
        <Button
          variant="outline"
          onClick={onSubmit}
          disabled={isPending || isCompleted}
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 mr-2 animate-spin text-muted-foreground" />
              Processing...
            </>
          ) : isCompleted ? (
            <>
              <CheckCircle className="size-4 mr-2 text-green-500" />
              Completed
            </>
          ) : (
            <>
              <CheckCircle className="size-4 mr-2 text-green-500" />
              Mark as Complete
            </>
          )}
        </Button>
      </div>

      <div className="space-y-3 pt-3">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {data.title}
        </h1>

        {parsedDescription && <RenderDescription json={parsedDescription} />}
      </div>
    </div>
  );
};

export default LessonContentPage;
