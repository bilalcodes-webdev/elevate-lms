"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { tryCatch } from "@/hooks/try-catch";
import { Loader2, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { deleteLesson } from "./action";
import { toast } from "sonner";

type DeleteAlertProps = {
  courseId: string;
  chapterId: string;
  lessonId: string;
};

const DeleteDialogAlert = ({
  courseId,
  chapterId,
  lessonId,
}: DeleteAlertProps) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDeletion = () => {
    startTransition(async () => {
      const { data, error } = await tryCatch(
        deleteLesson({ courseId, chapterId, lessonId })
      );

      if (error) {
        toast.error("Something went wrong");
        return;
      }

      if (data.status === "success") {
        toast.success(data.message);
        setOpen(false); // close only after successful deletion
      } else if (data.status === "error") {
        toast.error(data.message);
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Trash2 className="size-4" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            lesson and remove it from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>
            Cancel
          </AlertDialogCancel>

          {/* Custom button to prevent auto-close */}
          <Button
            variant="destructive"
            disabled={isPending}
            onClick={handleDeletion}
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 mr-1 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteDialogAlert;
