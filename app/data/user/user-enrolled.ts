import { headers } from "next/headers";

import prisma from "@/lib/db";
import { auth } from "@/lib/auth";

export async function checkIfCourseBought(courseId: string): Promise<boolean> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return false;
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      courseId_userId: {
        courseId: courseId,
        userId: session.user.id,
      },
    },
    select: {
      status: true,
    },
  });

  return enrollment?.status === "Completed" ? true : false;
}
