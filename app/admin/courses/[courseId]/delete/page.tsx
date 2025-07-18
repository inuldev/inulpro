"use client";

import Link from "next/link";
import { toast } from "sonner";
import { useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2Icon, Trash2Icon } from "lucide-react";

import { tryCatch } from "@/hooks/try-catch";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { DeleteCourse } from "./actions";

export default function DeleteCourseRoute() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const { courseId } = useParams<{ courseId: string }>();

  function onSubmit() {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(DeleteCourse(courseId));

      if (error) {
        toast.error("An unexpected error occurred, please try again.");
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        router.push("/admin/courses");
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  }

  return (
    <div className="max-w-xl mx-auto w-full">
      <Card className="mt-32">
        <CardHeader>
          <CardTitle>Are you sure you want to delete this course?</CardTitle>
          <CardDescription>
            This action cannot be undone. This will permanently delete this
            course.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <Link
            className={buttonVariants({ variant: "outline" })}
            href={"/admin/courses"}
          >
            Cancel
          </Link>
          <Button variant="destructive" onClick={onSubmit} disabled={pending}>
            {pending ? (
              <>
                <Loader2Icon className="size-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2Icon className="size-4" />
                Delete
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
