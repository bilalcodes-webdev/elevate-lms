import { PublicCoursesType } from "@/app/data/courses/get-public-courses";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ConstructUrl } from "@/hooks/use-constructer";
import { School, Timer } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type PublicCoursesProps = {
  data: PublicCoursesType;
};

const PublicCourses = ({ data }: PublicCoursesProps) => {
  const thumbnail = ConstructUrl(data.fileKey);

  return (
    <Card className="group relative py-0 gap-0 overflow-hidden">
      <Badge className="absolute top-2 right-2 z-10">{data.level}</Badge>

      <Image
        src={thumbnail}
        alt={data.title}
        width={600}
        height={400}
        className="w-full rounded-t-lg aspect-video h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
      />

      <CardContent className="p-4">
        <Link
          href={`/courses/${data.slug}`}
          className="font-medium text-lg line-clamp-2 hover:underline group-hover:text-primary transition-colors"
        >
          {data.title}
        </Link>

        <p className="line-clamp-2 text-sm text-muted-foreground leading-tight mt-2">
          {data.smallDescription}
        </p>

        <div className="flex items-center mt-4 gap-x-5">
          <div className="flex items-center gap-x-2">
            <Timer className="size-6 p-1 rounded-md text-primary bg-primary/10" />
            <p className="text-sm text-muted-foreground ">{data.duration}h</p>
          </div>
          <div className="flex items-center gap-x-2">
            <School className="size-6 p-1 rounded-md text-primary bg-primary/10" />
            <p className="text-sm text-muted-foreground ">{data.category}</p>
          </div>
        </div>

        <Link
          href={`/courses/${data.slug}`}
          className={buttonVariants({
            className: "w-full mt-4",
          })}
        >
          Learn More
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
export default PublicCourses;
