import Link from "next/link";
import Image from "next/image";
import { School2Icon, TimerIcon } from "lucide-react";

import { getS3PublicUrl } from "@/lib/s3-utils";
import { PublicCourseType } from "@/app/data/course/get-all-courses";
import { RenderContent } from "@/components/rich-text-editor/RenderContent";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface iAppProps {
  data: PublicCourseType;
}

export function PublicCourseCard({ data }: iAppProps) {
  const thumbnailUrl = getS3PublicUrl(data.fileKey);

  return (
    <Card className="group relative py-0 gap-0 transition-transform duration-300 ease-in-out">
      <Badge className="absolute top-2 right-2 z-10">{data.level}</Badge>

      <Image
        src={thumbnailUrl}
        alt={data.title}
        width={1200}
        height={600}
        className="w-full rounded-t-lg aspect-video h-full object-cover"
      />

      <CardContent className="p-4">
        <Link
          className="font-medium text-lg line-clamp-2 hover:underline group-hover:text-primary transition-colors duration-300 ease-in-out"
          href={`/courses/${data.slug}`}
        >
          {data.title}
        </Link>
        <div className="text-sm text-muted-foreground line-clamp-2 leading-tight mt-2">
          <RenderContent
            content={data.smallDescription}
            fallbackClassName="text-sm text-muted-foreground leading-tight"
          />
        </div>

        <div className="mt-4 flex items-center gap-x-5">
          <div className="flex items-center gap-x-2">
            <TimerIcon className="size-6 p-1 rounded-md text-primary bg-primary/10" />
            <p className="text-muted-foreground text-sm">{data.duration}h</p>
          </div>
          <div className="flex items-center gap-x-2">
            <School2Icon className="size-6 p-1 rounded-md text-primary bg-primary/10" />
            <p className="text-muted-foreground text-sm">{data.category}</p>
          </div>
        </div>

        <Link
          href={`/courses/${data.slug}`}
          className={buttonVariants({
            className: "w-full mt-4 transition-colors duration-300 ease-in-out",
          })}
        >
          Learn More
        </Link>
      </CardContent>
    </Card>
  );
}

export function PublicCourseCardSkeleton() {
  return (
    <Card className="group relative py-0 gap-0 transition-transform duration-300 ease-in-out">
      <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="size-8 rounded-md" />
      </div>
      <div className="w-full relative h-fit">
        <Skeleton className="w-full rounded-t-lg aspect-video h-[250px] object-cover" />
      </div>
      <CardContent className="p-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-full rounded" />
          <Skeleton className="h-6 w-2/3 rounded" />
        </div>
        <div className="mt-4 flex items-center gap-x-5">
          <div className="flex items-center gap-x-2">
            <Skeleton className="size-6 rounded-md" />
            <Skeleton className="h-4 w-10 rounded" />
          </div>
          <div className="flex items-center gap-x-2">
            <Skeleton className="size-6 rounded-md" />
            <Skeleton className="h-4 w-10 rounded" />
          </div>
        </div>

        <Skeleton className="h-10 w-full mt-4 rounded" />
      </CardContent>
    </Card>
  );
}
