import { ArrowLeft, ShieldX } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotAdminRoute() {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <Card className="max-w-md w-full p-6">
        <CardHeader className="text-center">
          <div className="bg-destructive/10 rounded-full p-4 w-fit mx-auto">
            <ShieldX className="size-16 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Access Restricted</CardTitle>{" "}
          <CardDescription className="max-w-xs mx-auto">
            You are not an admin, you can&apos;t create any courses or stuff
            like that.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/" className={buttonVariants({ className: "w-full" })}>
            <ArrowLeft className="mr-1 size-4" />
            Back to Home
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
