import prisma from "@/lib/db";

export async function getAllCourses() {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const data = await prisma.course.findMany({
    where: {
      status: "Published",
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      price: true,
      smallDescription: true,
      slug: true,
      fileKey: true,
      level: true,
      duration: true,
      category: true,
    },
  });

  return data;
}

export type PublicCourseType = Awaited<ReturnType<typeof getAllCourses>>[0];
