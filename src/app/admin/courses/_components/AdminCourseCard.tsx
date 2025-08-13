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
    <Card className="group relative overflow-hidden py-0 gap-0">
      {/* Actions Menu */}
      <div className="absolute top-2 right-2 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="secondary">
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
              <Link href={`/admin/courses/${data.slug}/delete`}>
                <Trash2 className="h-4 w-4 mr-2 text-destructive" /> Delete Course
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Thumbnail */}
      <div className="relative aspect-video">
        <Image
          src={thumbnail || "/placeholder.jpg"}
          alt={data.title}
          fill
          className="object-cover rounded-t-lg"
  
        />
      </div>

      {/* Content */}
      <CardContent className="p-4 space-y-3">
        <Link
          href={`/admin/courses/${data.id}`}
          className="font-medium text-lg line-clamp-2 hover:underline group-hover:text-primary transition-colors"
        >
          {data.title}
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {data.smallDescription}
        </p>

        <div className="flex items-center gap-x-5 text-sm text-muted-foreground">
          <div className="flex items-center gap-x-2">
            <Timer className="h-5 w-5 p-1 rounded-md text-primary bg-primary/10" />
            {data.duration}
          </div>
          <div className="flex items-center gap-x-2">
            <School className="h-5 w-5 p-1 rounded-md text-primary bg-primary/10" />
            {data.level}
          </div>
        </div>

        <Link
          href={`/admin/courses/${data.id}/edit`}
          className={buttonVariants({ className: "w-full mt-2" })}
        >
          Edit Course <ArrowRight className="h-4 w-4 ml-2" />
        </Link>
      </CardContent>
    </Card>
  );
};

export default AdminCourseCard;
