import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  EyeIcon,
  MoreVertical,
  PencilIcon,
  School2Icon,
  TimerIcon,
  Trash2Icon,
} from "lucide-react";

import { getS3PublicUrl } from "@/lib/s3-utils";
import { AdminCourseType } from "@/app/data/admin/admin-get-courses";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants, Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface iAppProps {
  data: AdminCourseType;
}

export function AdminCourseCard({ data }: iAppProps) {
  const thumbnailUrl = getS3PublicUrl(data.fileKey);

  return (
    <Card className="group relative py-0 gap-0 transition-transform duration-300 ease-in-out">
      {/* absolute dropdown */}
      <div className="absolute top-2 right-2 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon">
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link href={`/admin/courses/${data.id}/edit`}>
                <PencilIcon className="size-4 mr-2" />
                Edit Course
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/courses/${data.slug}`}>
                <EyeIcon className="size-4 mr-2" />
                Preview
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/admin/courses/${data.id}/delete`}>
                <Trash2Icon className="size-4 mr-2 text-destructive" />
                Delete Course
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Image
        src={thumbnailUrl}
        alt={data.title}
        width={1200} // 16:9 aspect ratio, 1200x600
        height={600} // 16:9 aspect ratio, 1200x600
        className="w-full rounded-t-lg aspect-video h-full object-cover"
      />

      <CardContent className="p-4">
        <Link
          href={`/admin/courses/${data.id}/edit`}
          className="font-medium text-lg line-clamp-2 hover:underline group-hover:text-primary transition-colors duration-300 ease-in-out"
        >
          {data.title}
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2 leading-tight">
          {data.smallDescription}
        </p>

        <div className="mt-4 flex items-center gap-x-5">
          <div className="flex items-center gap-x-2">
            <TimerIcon className="size-6 p-1 rounded-md text-primary bg-primary/10" />
            <p className="text-muted-foreground text-sm">{data.duration}h</p>
          </div>
          <div className="flex items-center gap-x-2">
            <School2Icon className="size-6 p-1 rounded-md text-primary bg-primary/10" />
            <p className="text-muted-foreground text-sm">{data.level}</p>
          </div>
        </div>

        <Link
          className={buttonVariants({
            className: "w-full mt-4 transition-colors duration-300 ease-in-out",
          })}
          href={`/admin/courses/${data.id}/edit`}
        >
          Edit Course <ArrowRight className="size-4" />
        </Link>
      </CardContent>
    </Card>
  );
}

export function AdminCourseCardSkeleton() {
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
        <Skeleton className="h-6 w-3/4 mb-2 rounded" />
        <Skeleton className="h-4 w-full mb-4 rounded" />
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
