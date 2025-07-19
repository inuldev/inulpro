import "server-only";
import { notFound } from "next/navigation";

import prisma from "@/lib/db";
import { requireUser } from "../user/require-user";

export async function getLessonContent(lessonId: string) {
  const session = await requireUser();

  const lesson = await prisma.lesson.findUnique({
    where: {
      id: lessonId,
    },
    select: {
      id: true,
      title: true,
      description: true,
      thumbnailKey: true,
      videoKey: true,
      position: true,
      lessonProgress: {
        where: {
          userId: session.id,
        },
        select: {
          completed: true,
          lessonId: true,
        },
      },
      chapter: {
        select: {
          courseId: true,
          course: {
            select: {
              slug: true,
            },
          },
        },
      },
    },
  });

  if (!lesson) {
    return notFound();
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      courseId_userId: {
        courseId: lesson.chapter.courseId,
        userId: session.id,
      },
    },
    select: {
      status: true,
    },
  });

  if (!enrollment || enrollment.status !== "Completed") {
    return notFound();
  }

  return lesson;
}

export type LessonContentType = Awaited<ReturnType<typeof getLessonContent>>;
