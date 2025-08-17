import { AdminCourseType } from "@/app/data/admin/admin-get-courses";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { ConstructUrl } from "@/hooks/use-constructer";
import {
  ArrowRight,
  Eye,
  MoreVertical,
  Pencil,
  School,
  Timer,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type AdminCourseProps = {
  data: AdminCourseType;
};

const AdminCourseCard = ({ data }: AdminCourseProps) => {
  const thumbnail = ConstructUrl(data.fileKey);

  return (
    <Card className="group relative overflow-hidden flex flex-col py-0 gap-0">
      {/* Actions Menu */}
      <div className="absolute top-2 right-2 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="secondary" className="rounded-full shadow-sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link href={`/admin/courses/${data.id}/edit`}>
                <Pencil className="h-4 w-4 mr-2" /> Edit Course
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/courses/${data.slug}`}>
                <Eye className="h-4 w-4 mr-2" /> Preview
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/admin/courses/${data.id}/delete`}>
                <Trash2 className="h-4 w-4 mr-2 text-destructive" /> Delete Course
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={thumbnail || "/placeholder.jpg"}
          alt={data.title}
          fill
          priority
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <CardContent className="flex flex-col flex-1 p-4 space-y-3">
        <Link
          href={`/admin/courses/${data.id}`}
          className="font-semibold text-lg line-clamp-2 hover:underline group-hover:text-primary transition-colors"
        >
          {data.title}
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-3 overflow-hidden min-h-[50px]">
          {data.smallDescription}
        </p>

        <div className="flex items-center gap-x-5 text-sm text-muted-foreground">
          <div className="flex items-center gap-x-2">
            <Timer className="h-5 w-5 p-1 rounded-md text-primary bg-primary/10" />
            <span>{data.duration}</span>
          </div>
          <div className="flex items-center gap-x-2">
            <School className="h-5 w-5 p-1 rounded-md text-primary bg-primary/10" />
            <span>{data.level}</span>
          </div>
        </div>

        <Link
          href={`/admin/courses/${data.id}/edit`}
          className={buttonVariants({ className: "w-full mt-auto" })}
        >
          Edit Course <ArrowRight className="h-4 w-4 ml-2" />
        </Link>
      </CardContent>
    </Card>
  );
};

export function AdminCourseCardSkeleton() {
  return (
    <Card className="group relative flex flex-col overflow-hidden py-0 gap-0">
      <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="size-8 rounded-md" />
      </div>

      <div className="relative aspect-video w-full">
        <Skeleton className="w-full h-full rounded-t-lg" />
      </div>

      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-6 w-3/4 rounded" />
        <Skeleton className="h-4 w-full rounded" />

        <div className="flex items-center gap-x-4">
          <div className="flex items-center gap-x-2">
            <Skeleton className="size-6 rounded-md" />
            <Skeleton className="h-4 w-12 rounded" />
          </div>
          <div className="flex items-center gap-x-2">
            <Skeleton className="size-6 rounded-md" />
            <Skeleton className="h-4 w-12 rounded" />
          </div>
        </div>

        <Skeleton className="h-10 w-full rounded" />
      </CardContent>
    </Card>
  );
}

export default AdminCourseCard;
