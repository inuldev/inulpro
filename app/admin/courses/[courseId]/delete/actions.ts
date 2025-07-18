"use server";

import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";

import prisma from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { requireAdmin } from "@/app/data/admin/require-admin";

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 5,
  })
);

export async function DeleteCourse(courseId: string): Promise<ApiResponse> {
  const session = await requireAdmin();

  try {
    const req = await request();
    const decision = await aj.protect(req, { fingerprint: session?.user.id });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return { status: "error", message: "You have been rate limited." };
      } else {
        return { status: "error", message: "Looks like you are a bot." };
      }
    }

    await prisma.course.delete({
      where: {
        id: courseId,
      },
    });

    revalidatePath("/admin/courses");

    return { status: "success", message: "Course deleted successfully" };
  } catch {
    return {
      status: "error",
      message: "Failed to delete course",
    };
  }
}
