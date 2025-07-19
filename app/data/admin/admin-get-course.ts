import "server-only";
import { notFound } from "next/navigation";

import prisma from "@/lib/db";
import { requireAdmin } from "./require-admin";

export async function adminGetCourse(id: string) {
  await requireAdmin();
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const data = await prisma.course.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      title: true,
      description: true,
      fileKey: true,
      price: true,
      duration: true,
      level: true,
      status: true,
      slug: true,
      smallDescription: true,
      category: true,
      chapters: {
        select: {
          id: true,
          title: true,
          position: true,
          lessons: {
            select: {
              id: true,
              title: true,
              description: true,
              thumbnailKey: true,
              videoKey: true,
              position: true,
            },
          },
        },
      },
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}

export type AdminCourseIdType = Awaited<ReturnType<typeof adminGetCourse>>;
