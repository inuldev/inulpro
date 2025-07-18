"use client";

import { toast } from "sonner";
import { useTransition } from "react";
import { Loader2Icon } from "lucide-react";

import { tryCatch } from "@/hooks/try-catch";
import { Button } from "@/components/ui/button";

import { enrollInCourseAction } from "../actions";

export function EnrollmentButton({ courseId }: { courseId: string }) {
  const [pending, startTransition] = useTransition();

  function onSubmit() {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        enrollInCourseAction(courseId)
      );

      if (error) {
        toast.error("An unexpected error occurred, please try again.");
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  }

  return (
    <Button onClick={onSubmit} disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2Icon className="size-4 animate-spin" />
          Loading...
        </>
      ) : (
        "Enroll Now"
      )}
    </Button>
  );
}
