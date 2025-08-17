"use client"

import { Button } from "@/components/ui/button";
import { tryCatch } from "@/hooks/try-catch";
import { useTransition } from "react";
import { enrollInCourseAction } from "./action";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const EnrollmentButton = ({ courseId }: { courseId: string }) => {
  const [isPending, startTransition] = useTransition();

  const submitHandler = () => {
    startTransition(async () => {
      const { data, error } = await tryCatch(enrollInCourseAction(courseId));

      if (error) {
        toast.error("Something went wrong");
      }

      if (data?.status === "success") {
        toast.success(data.message);
      } else if (data?.status === "error") {
        toast.error(data.message);
      }
    });
  };
  return (
    <div>
      <Button
        onClick={submitHandler}
        disabled={isPending}
        className="w-full"
        type="submit"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-1 animate-spin size-4" />
            Enrolling...
          </>
        ) : (
          "Enroll Now!"
        )}
      </Button>
    </div>
  );
};
export default EnrollmentButton;
