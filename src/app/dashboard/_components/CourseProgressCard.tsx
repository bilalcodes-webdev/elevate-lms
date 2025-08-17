"use client"

import { UserEnrolledCoursesType } from "@/app/data/courses/get-user-enrolled-courses";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useTrackProgress } from "@/hooks/track-progress";
import { ConstructUrl } from "@/hooks/use-constructer";
import Image from "next/image";
import Link from "next/link";

type PublicCoursesProps = {
  data: UserEnrolledCoursesType;
};

const EnrollCourseProgress = ({ data }: PublicCoursesProps) => {
  const thumbnail = ConstructUrl(data.course.fileKey);
  const { completedLessons, percentage, totalLesson } = useTrackProgress(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data.course as any
  );

  return (
    <Card className="group relative py-0 gap-0">
      <Badge className="absolute top-2 right-2 z-10">{data.course.level}</Badge>

      <Image
        src={thumbnail}
        alt={data.course.title}
        width={600}
        height={400}
        className="w-full rounded-t-lg aspect-video h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
      />

      <CardContent className="p-4">
        <Link
          href={`/dashboard/${data.course.slug}`}
          className="font-medium text-lg line-clamp-2 hover:underline group-hover:text-primary transition-colors"
        >
          {data.course.title}
        </Link>

        <p className="line-clamp-2 text-sm text-muted-foreground leading-tight mt-2">
          {data.course.smallDescription}
        </p>

        <div className="space-y-4 mt-5">
          <div className="flex items-center justify-between mb-1 text-sm">
            <p>Progress:</p>
            <span className="font-medium">{percentage}%</span>
          </div>
          <Progress className="h-1.5" value={percentage} />
          <p className="text-xs text-muted-foreground mt-1">
            {completedLessons} of {totalLesson} Lesson Completed
          </p>
        </div>

        <Link
          href={`/dashboard/${data.course.slug}`}
          className={buttonVariants({
            className: "w-full mt-4",
          })}
        >
          Watch Course
        </Link>
      </CardContent>
    </Card>
  );
};

export function PublicCoursesSkeleton() {
  return (
    <Card className="group relative py-0 gap-0">
      <div className="absolute top-2 right-2 z-10 flex items-center">
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>

      <div className="w-full relative h-fit">
        <Skeleton className="w-full rounded-t-xl aspect-video" />
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
        </div>

        <div className="mt-4 flex items-center gap-x-5">
          <div className="flex items-center gap-x-2">
            <Skeleton className="size-6 rounded-md" />
            <Skeleton className="h-4 w-8" />
          </div>
          <div className="flex items-center gap-x-2">
            <Skeleton className="size-6 rounded-md" />
            <Skeleton className="h-4 w-8" />
          </div>
        </div>

        <Skeleton className="w-full h-10 mt-4 rounded-md" />
      </CardContent>
    </Card>
  );
}
export default EnrollCourseProgress;
