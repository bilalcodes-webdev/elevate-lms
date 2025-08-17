import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, Play } from "lucide-react";
import Link from "next/link";

type LessonProps = {
  lesson: {
    id: string;
    title: string;
    position: number;
    description: string | null;
  };
  slug: string;
  isActive?: boolean;
  completed: boolean;
};

const LessonItem = ({ lesson, slug, isActive, completed }: LessonProps) => {

  return (
    <Link
      href={`/dashboard/${slug}/${lesson.id}`}
      className={buttonVariants({
        variant: completed ? "secondary" : "outline",
        className: cn(
          "w-full h-auto justify-start p-2.5 transition-all",
          completed &&
            "bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-gray-700 hover:bg-green-200 dark:hover:bg-green-900/50 text-green-800 dark:text-gray-200",

          isActive &&
            !completed &&
            "bg-primary/10 dark:bg-primary/20 border-primary/50 hover:bg-primary/20 dark:hover:bg-primary/30 text-primary"
        ),
      })}
    >
      <div className="flex items-center gap-2.5 min-w-[95%] overflow-hidden">
        {completed ? (
          <div className="size-5 rounded-full bg-green-600 dark:bg-green-500 flex items-center justify-center">
            <Check className="text-white size-3" />
          </div>
        ) : (
          <div
            className={cn(
              "size-5 border-2 rounded-full flex items-center justify-center",
              isActive
                ? "border-primary bg-primary/10 dark:bg-primary/20"
                : "border-muted-foreground"
            )}
          >
            <Play
              className={cn(
                "size-2.5 fill-current",
                isActive ? "bg-primary " : "text-muted-foreground"
              )}
            />
          </div>
        )}

        <div className="flex-1 min-w-0 text-left">
          <p
            className={cn(
              "text-xs truncate overflow-hidden text-ellipsis whitespace-nowrap font-medium",
              completed
                ? "text-green-800 dark:text-green-200 pb-1"
                : isActive
                ? "text-primary font-semibold"
                : "text-foreground"
            )}
          >
            {lesson.position}. {lesson.title}
          </p>
          {completed && (
            <p className="text-[10px] text-green-700 dark:text-green-300 font-medium">
              Completed
            </p>
          )}

          {isActive && completed && (
            <p className="text-[10px] text-primary font-medium">
              Currently Watching
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default LessonItem;
