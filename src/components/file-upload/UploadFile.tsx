/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCallback, useEffect, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";
import RenderContent, {
  RenderError,
  RenderUploaded,
  RenderUploading,
} from "./RenderContent";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { ConstructUrl } from "@/hooks/use-constructer";
interface UploadFileProps {
  id: string | null;
  file: File | null;
  uploading: boolean;
  progress: number;
  key?: string;
  isDeleting: boolean;
  error: boolean;
  objectUrl?: string;
  fileType: "image" | "video";
}

function rejectionHandler(rejectedFiles: FileRejection[]) {
  if (rejectedFiles.length) {
    const invalidFileType = rejectedFiles.find(
      (rejected) => rejected?.errors[0].code === "file-invalid-type"
    );

    if (invalidFileType) {
      toast.error("Invalid File Type");
    }
  }

  if (rejectedFiles.length) {
    const invalidFileType = rejectedFiles.find(
      (rejected) => rejected?.errors[0].code === "too-many-files"
    );

    if (invalidFileType) {
      toast.error("Only One File Can Be Uploaded At A Time");
    }
  }

  if (rejectedFiles.length) {
    const sizetolarge = rejectedFiles.find(
      (rejected) => rejected?.errors[0].code === "file-too-large"
    );

    if (sizetolarge) {
      toast.error("File Size Limit Exceeded");
    }
  }
}

type UploadFile = {
  value?: string;
  onChange?: (value: string) => void;
  fileTypeAccepted: "image" | "video";
};

const UploadFile = ({ onChange, value, fileTypeAccepted}: UploadFile) => {
  const fileUrl = ConstructUrl(value || "");
  const [fileState, setFileState] = useState<UploadFileProps>({
    error: false,
    id: null,
    file: null,
    uploading: false,
    progress: 0,
    isDeleting: false,
    fileType: fileTypeAccepted,
    key: value,
    objectUrl: value ? fileUrl : undefined,
  });

  const fileupload = useCallback(async (file:File) => {
     setFileState((prev) => ({
      ...prev,
      progress: 0,
      uploading: true,
    }));

    try {
      const preSignedResponse = await fetch("/api/s3/file-upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: file.name,
          size: file.size,
          isImage: fileTypeAccepted === "image" ? true : false,
          contentType: file.type,
        }),
      });

      if (!preSignedResponse.ok) {
        toast.error("Failed To Get Presigned Url");
        setFileState((prev) => ({
          ...prev,
          progress: 0,
          uploading: false,
          error: true,
        }));

        return;
      }

      const { preSignedUrl, key } = await preSignedResponse.json();

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentageCalculate = (event.loaded / event.total) * 100;

            setFileState((prev) => ({
              ...prev,
              progress: Math.round(percentageCalculate),
              key: key,
            }));
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200 || xhr.status === 203) {
            setFileState((prev) => ({
              ...prev,
              uploading: false,
              error: false,
              progress: 100,
            }));

            onChange?.(key);

            toast.success("File Uploaded Successfully");
            resolve();
          } else {
            reject("File Upload Failed with status: " + xhr.status);
          }
        };

        xhr.open("PUT", preSignedUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      });
    } catch (error: any) {
      setFileState((prev) => ({
        ...prev,
        error: true,
        uploading: false,
      }));
    }
  }, [fileTypeAccepted, onChange])


  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Do something with the files
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];

        if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
          URL.revokeObjectURL(fileState.objectUrl);
        }

        setFileState({
          file: file,
          uploading: false,
          progress: 0,
          objectUrl: URL.createObjectURL(file),
          error: false,
          id: uuidv4(),
          isDeleting: false,
          fileType: fileTypeAccepted,
        });

        fileupload(file);
      }
    },
    [fileState.objectUrl, fileTypeAccepted, fileupload]
  );

  const removeFile = async () => {
    if (fileState.isDeleting || !fileState.objectUrl) return;

    try {
      setFileState((prev) => ({
        ...prev,
        isDeleting: true,
      }));

      const response = await fetch("/api/s3/file-delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: fileState.key,
        }),
      });

      if (!response.ok) {
        toast.error("Failed To Delete File");
        setFileState((prev) => ({
          ...prev,
          isDeleting: false,
          error: true,
        }));
        return;
      }


      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }

      onChange?.("");

      setFileState({
        file: null,
        uploading: false,
        progress: 0,
        objectUrl: undefined,
        error: false,
        id: null,
        isDeleting: false,
        fileType: fileTypeAccepted,
      });

      toast.success("File Deleted Successfully");
    } catch (error) {
      toast.error("Failed To Delete File");
      setFileState((prev) => ({
        ...prev,
        isDeleting: false,
        error: true,
      }));
    }
  };

  useEffect(() => {
    return () => {
      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }
    };
  }, [fileState.objectUrl]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: fileTypeAccepted === "video"  ? {"video/*": []}   : { "image/*": [] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    multiple: false,
    onDropRejected: rejectionHandler,
    disabled: fileState.uploading || !!fileState.objectUrl,
  });

  function renderContent() {
    if (fileState.uploading)
      return (
        <RenderUploading progress={fileState.progress} file={fileState.file!} />
      );

    if (fileState.error) {
      return (
        <>
          <RenderError />
        </>
      );
    }

    if (fileState.objectUrl)
      return (
        <RenderUploaded
          deleteFn={removeFile}
          isDeleting={fileState.isDeleting}
          objectUrl={fileState.objectUrl}
          fileType={fileState.fileType}
        />
      );

    return <RenderContent isDragActive={isDragActive} />;
  }

  return (
    <Card
      {...getRootProps()}
      className={cn(
        `relative border-2 border-dashed h-72 w-full transition-colors duration-300 ease-in-out`,
        isDragActive
          ? "border-primary bg-primary/10 border-solid"
          : "border-border hover:border-primary"
      )}
    >
      <CardContent className="flex justify-center items-center w-full h-full p-4">
        <input {...getInputProps()} />
        {renderContent()}
      </CardContent>
    </Card>
  );
};
export default UploadFile;
