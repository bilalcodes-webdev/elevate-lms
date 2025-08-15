import { cn } from "@/lib/utils";
import { IconCloudUpload } from "@tabler/icons-react";
import { Button } from "../ui/button";
import { ImageIcon, Loader2, Trash } from "lucide-react";
import Image from "next/image";

export const RenderContent = ({ isDragActive }: { isDragActive: boolean }) => {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center mx-auto w-12 h-12 bg-muted rounded-full mb-4">
        <IconCloudUpload
          className={cn(
            "size-6 text-muted-foreground",
            isDragActive ? "text-primary" : ""
          )}
        />
      </div>
      <p className="text-muted-foreground text-base font-semibold">
        Drag & Drop File Here Or{" "}
        <span className="text-primary cursor-pointer font-bold">
          Click To Upload
        </span>
      </p>

      <Button type="button" className="mt-4">
        Select Files
      </Button>
    </div>
  );
};

export function RenderError() {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center mx-auto w-12 h-12 bg-destructive/30 rounded-full mb-4">
        <ImageIcon className={cn("size-6 text-muted-foreground")} />
      </div>
      <p className="my-2 text-xs text-muted-foreground">Something Went Wrong</p>
      <Button type="button">Retry File Selection</Button>
    </div>
  );
}

export function RenderUploading({
  progress,
}: {
  progress: number;
  file: File;
}) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md w-full max-w-md mx-auto">
      <div className="flex items-center justify-center w-14 h-14 bg-primary/10 rounded-full">
        <ImageIcon className="w-7 h-7 text-primary" />
      </div>
      <p className="text-base font-medium text-gray-800 dark:text-gray-200">
        Uploading...
      </p>
      <div className="relative w-full h-3 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-primary-dark rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-sm font-semibold text-primary">{progress}%</span>
    </div>
  );
}

type RenderUploadedProps = {
  objectUrl: string;
  deleteFn: () => void;
  isDeleting: boolean;
  fileType: "image" | "video";
};
export function RenderUploaded({
  objectUrl,
  deleteFn,
  isDeleting,
  fileType,
}: RenderUploadedProps) {

  console.log(objectUrl)
  return (
    <div className="relative w-full max-w-md mx-auto rounded-lg overflow-hidden shadow-lg">
      {fileType === "video" ? (
        <video
          src={objectUrl}
          controls
          muted
          className="w-full h-full object-contain"
        ></video>
      ) : (
        <div className="relative w-full h-60">
          <Image
            src={objectUrl}
            alt="Uploaded File"
            fill
            sizes="w-full h-full"
            className="object-cover"
            priority
          />
        </div>
      )}

      <Button
        type="button"
        aria-label="Delete uploaded file"
        className="absolute flex items-center justify-center top-3 right-3 bg-primary p-2 rounded-full shadow-md transition"
        onClick={deleteFn}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <Loader2 className="animate-spin size-4" />
        ) : (
          <Trash className="size-4" />
        )}
      </Button>
    </div>
  );
}

export default RenderContent;
