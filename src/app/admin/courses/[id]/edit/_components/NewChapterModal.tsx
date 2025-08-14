"use client"

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { tryCatch } from "@/hooks/try-catch";
import { chapterSchema, chapterSchemaType } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Loader2, Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { createNewChapter } from "./action";
import { toast } from "sonner";

const resolver = zodResolver(chapterSchema) as Resolver<chapterSchemaType>;
const NewChapterModal = ({ courseId }: { courseId: string }) => {
  const [isOpen, setisOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const onsubmit = (values: chapterSchemaType) => {
    startTransition(async () => {
      const { data, error } = await tryCatch(createNewChapter(values));

      if (error) {
        toast.error("Unexpected error,Please try again");
      }

      if (data?.status === "success") {
        toast.success(data.message);
        form.reset();
        setisOpen(false);
      } else if (data?.status === "error") {
        toast.error(data.message);
        return;
      }
    });
  };

  const handleOpen = (open: boolean) => {
    setisOpen(open);
  };
  const form = useForm<chapterSchemaType>({
    resolver,
    defaultValues: {
      name: "",
      courseId: courseId,
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2" variant={"outline"} size={"sm"}>
          <Plus className="size-4" /> New Chapter
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle>Create New Chapter</DialogTitle>
          <DialogDescription>
            What would you like to name your chapter
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onsubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({field}) => (
                <FormItem>
                  <FormLabel />
                  <FormControl>
                    <Input placeholder="Chapter Name" {...field} />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button disabled={isPending} type="submit">
                {isPending ? (
                  <>
                    <Loader2 className="size-4 mr-1 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Chapter"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
export default NewChapterModal;
