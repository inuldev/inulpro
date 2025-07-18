import Image from "next/image";
import { CloudUploadIcon, ImageIcon, Loader2, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

export function RenderEmptyState({ isDragActive }: { isDragActive: boolean }) {
  return (
    <div className="text-center">
      <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-muted mb-2">
        <CloudUploadIcon
          className={cn(
            "size-6 text-muted-foreground",
            isDragActive && "text-primary"
          )}
        />
      </div>
      <p className="text-base font-semibold text-foreground">
        Drop your file here or{" "}
        <span className="text-primary font-bold cursor-pointer">
          click to upload
        </span>
      </p>
      <Button type="button" className="mt-4">
        Select File
      </Button>
    </div>
  );
}

export function RenderErrorState() {
  return (
    <div className="text-center">
      <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-destructive/30">
        <ImageIcon className={cn("size-6 text-destructive")} />
      </div>
      <p className="text-base font-semibold mt-1">Upload Failed</p>
      <p className="text-xs text-muted-foreground">Something went wrong</p>
      <Button className="mt-2" type="button">
        Retry Select File
      </Button>
    </div>
  );
}

export function RenderUploadedState({
  previewUrl,
  isDeleting,
  handleRemoveFile,
  fileType,
}: {
  previewUrl: string;
  isDeleting: boolean;
  handleRemoveFile: () => void;
  fileType: "image" | "video";
}) {
  return (
    <div className="relative group w-full h-full flex items-center justify-center overflow-hidden rounded-md">
      {fileType === "image" ? (
        <div className="relative w-full h-full min-h-[180px]">
          <Image
            fill
            src={previewUrl}
            alt="Uploaded File"
            className="object-contain rounded-md"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        </div>
      ) : (
        <div className="relative w-full h-full min-h-[180px] flex items-center justify-center">
          <video
            src={previewUrl}
            controls
            className="rounded-md max-w-full max-h-full object-contain"
            style={{ width: "auto", height: "auto" }}
            preload="metadata"
          />
        </div>
      )}
      <Button
        variant="destructive"
        size="icon"
        className={cn(
          "absolute top-2 right-2 z-10",
          "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
          "bg-destructive/90 hover:bg-destructive backdrop-blur-sm shadow-lg"
        )}
        onClick={handleRemoveFile}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <XIcon className="size-4" />
        )}
      </Button>
    </div>
  );
}

export function RenderUploadingState({
  progress,
  file,
}: {
  progress: number;
  file: File;
}) {
  return (
    <div className="text-center flex justify-center items-center flex-col">
      <p>{progress}% completed</p>
      <p className="mt-2 text-sm font-medium text-foreground">Uploading...</p>
      <p className="mt-1 text-xs text-muted-foreground truncate max-w-xs">
        {file.name}
      </p>
    </div>
  );
}
