"use client";
import { Button, buttonVariants } from "@/components/ui/button";

import { tryCatch } from "@/hooks/try-catch";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Loader2, Trash } from "lucide-react";
import { debugCourseRelations, deleteCourse } from "../action";

const DeleteActions = ({ courseId }: { courseId: string }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const deletionHandler = () => {
    startTransition(async () => {
      await debugCourseRelations(courseId);
      const { data, error } = await tryCatch(deleteCourse(courseId));

      if (error) {
        toast.error("Something went wrong");
        return;
      }

      if (data.status === "success") {
        toast.success(data.message);
        router.push("/admin/courses");
      } else if (data.status === "error") {
        toast.error(data.message);
      }
    });
  };
  return (
    <>
      <Link
        href={"/admin/courses"}
        className={buttonVariants({ variant: "outline" })}
      >
        Cancel
      </Link>
      <Button onClick={deletionHandler} variant="destructive">
        {isPending ? (
          <>
            <Loader2 className="mr-1 size-4 animate-spin" /> Deleting...
          </>
        ) : (
          <>
            <Trash className="size-4 mr-1" /> Delete
          </>
        )}
      </Button>
    </>
  );
};
export default DeleteActions;
