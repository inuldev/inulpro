import { redirect } from "next/navigation";
import { BanIcon, PlusIcon } from "lucide-react";

import { EmptyState } from "@/components/general/EmptyState";
import { getCourseSidebarData } from "@/app/data/course/get-course-sidebar-data";

interface iAppProps {
  params: Promise<{ slug: string }>;
}

export default async function CourseSlugRoute({ params }: iAppProps) {
  const { slug } = await params;
  const course = await getCourseSidebarData(slug);
  const firstChapter = course.course.chapters[0];
  const firstLesson = firstChapter.lessons[0];

  if (firstLesson) {
    redirect(`/dashboard/${slug}/${firstLesson.id}`);
  }

  return (
    <div className="flex items-center justify-center h-full text-center">
      <EmptyState
        title="No lessons available"
        description="This course doesn't have any lessons yet."
        icon={<BanIcon className="size-10 text-primary" />}
        buttonText="Back to Dashboard"
        buttonHref="/dashboard"
        buttonIcon={<PlusIcon className="size-4" />}
      />
    </div>
  );
}
