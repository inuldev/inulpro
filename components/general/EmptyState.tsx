import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

interface iAppProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  buttonText: string;
  buttonHref: string;
  buttonIcon?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  buttonText,
  buttonHref,
  icon,
  buttonIcon,
}: iAppProps) {
  return (
    <div className="flex flex-col flex-1 h-full items-center justify-center rounded-md border-dashed border p-8 text-center">
      <div className="flex size-20 items-center justify-center rounded-full bg-primary/10">
        {icon}
      </div>
      <h2 className="mt-6 text-xl font-semibold text-foreground">{title}</h2>
      <p className="mb-8 mt-2 text-center text-sm leading-tight text-muted-foreground">
        {description}
      </p>
      <Link className={buttonVariants()} href={buttonHref}>
        <div className="flex items-center gap-2">
          {buttonIcon}
          {buttonText}
        </div>
      </Link>
    </div>
  );
}
