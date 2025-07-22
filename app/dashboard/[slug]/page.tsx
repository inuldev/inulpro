import Link from "next/link";
import {
  BookOpenIcon,
  ClockIcon,
  PlayIcon,
  TrophyIcon,
  BanIcon,
  LayoutDashboard,
  UserIcon,
  CalendarIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/general/EmptyState";
import { getCourseSidebarData } from "@/app/data/course/get-course-sidebar-data";

interface iAppProps {
  params: Promise<{ slug: string }>;
}

export default async function CourseOverviewPage({ params }: iAppProps) {
  const { slug } = await params;
  const course = await getCourseSidebarData(slug);

  // Check if course has content
  const hasChapters = course.course.chapters.length > 0;
  const firstChapter = hasChapters ? course.course.chapters[0] : null;
  const firstLesson = firstChapter?.lessons?.[0];

  // Calculate course statistics
  const totalLessons = course.course.chapters.reduce(
    (acc, chapter) => acc + chapter.lessons.length,
    0
  );

  const completedLessons = course.course.chapters.reduce(
    (acc, chapter) =>
      acc +
      chapter.lessons.filter((lesson) =>
        lesson.lessonProgress.some((progress) => progress.completed)
      ).length,
    0
  );

  const progressPercentage =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // If no content available
  if (!hasChapters || totalLessons === 0) {
    return (
      <div className="flex items-center justify-center h-full text-center">
        <EmptyState
          title="No lessons available"
          description="This course doesn't have any lessons yet. Please check back later."
          icon={<BanIcon className="size-10 text-primary" />}
          buttonText="Back to Dashboard"
          buttonHref="/dashboard"
          buttonIcon={<LayoutDashboard className="size-4" />}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Course Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <BookOpenIcon className="size-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{course.course.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary">{course.course.category}</Badge>
              <Badge variant="outline">{course.course.level}</Badge>
            </div>
          </div>
        </div>

        {/* Course Description */}
        {course.course.smallDescription && (
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-3">About This Course</h2>
            <p className="text-muted-foreground leading-relaxed">
              {course.course.smallDescription}
            </p>
          </div>
        )}

        {/* Progress Section */}
        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Your Progress</h2>
            <span className="text-sm text-muted-foreground">
              {completedLessons} of {totalLessons} lessons completed
            </span>
          </div>
          <Progress value={progressPercentage} className="h-3 mb-2" />
          <p className="text-sm text-muted-foreground">
            {progressPercentage}% complete
          </p>
        </div>
      </div>

      {/* Course Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border rounded-lg p-4 text-center">
          <BookOpenIcon className="size-8 text-primary mx-auto mb-2" />
          <p className="text-2xl font-bold">{course.course.chapters.length}</p>
          <p className="text-sm text-muted-foreground">Chapters</p>
        </div>
        <div className="bg-card border rounded-lg p-4 text-center">
          <PlayIcon className="size-8 text-primary mx-auto mb-2" />
          <p className="text-2xl font-bold">{totalLessons}</p>
          <p className="text-sm text-muted-foreground">Lessons</p>
        </div>
        <div className="bg-card border rounded-lg p-4 text-center">
          <ClockIcon className="size-8 text-primary mx-auto mb-2" />
          <p className="text-2xl font-bold">{course.course.duration}h</p>
          <p className="text-sm text-muted-foreground">Duration</p>
        </div>
      </div>

      {/* Course Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Instructor Info */}
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <UserIcon className="size-5 text-primary" />
            <h3 className="font-semibold">Instructor</h3>
          </div>
          <p className="text-muted-foreground">
            {course.course.user.name || course.course.user.email.split("@")[0]}
          </p>
        </div>

        {/* Enrollment Info */}
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <CalendarIcon className="size-5 text-primary" />
            <h3 className="font-semibold">Enrolled</h3>
          </div>
          <p className="text-muted-foreground">
            {new Date(course.enrollment.createdAt).toLocaleDateString("id-ID", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        {firstLesson && (
          <Button asChild size="lg" className="flex-1">
            <Link href={`/dashboard/${slug}/${firstLesson.id}`}>
              <PlayIcon className="size-4 mr-2" />
              {completedLessons === 0 ? "Start Learning" : "Continue Learning"}
            </Link>
          </Button>
        )}

        {progressPercentage === 100 && (
          <Button variant="outline" size="lg" className="flex-1">
            <TrophyIcon className="size-4 mr-2" />
            View Certificate
          </Button>
        )}
      </div>

      {/* Detailed Description */}
      {course.course.description &&
        course.course.description !== course.course.smallDescription && (
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Course Details</h2>
            <div className="prose prose-sm max-w-none text-muted-foreground">
              <p className="whitespace-pre-wrap leading-relaxed">
                {course.course.description}
              </p>
            </div>
          </div>
        )}

      {/* Course Chapters Overview */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Course Content</h2>
        <div className="space-y-3">
          {course.course.chapters.map((chapter) => {
            const chapterCompletedLessons = chapter.lessons.filter((lesson) =>
              lesson.lessonProgress.some((progress) => progress.completed)
            ).length;
            const chapterProgress =
              chapter.lessons.length > 0
                ? Math.round(
                    (chapterCompletedLessons / chapter.lessons.length) * 100
                  )
                : 0;

            return (
              <div key={chapter.id} className="bg-card border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">
                    Chapter {chapter.position}: {chapter.title}
                  </h3>
                  <span className="text-sm text-muted-foreground">
                    {chapterCompletedLessons}/{chapter.lessons.length} lessons
                  </span>
                </div>
                <Progress value={chapterProgress} className="h-2" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
