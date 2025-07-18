import Link from "next/link";
import { ArrowLeft, XIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function PaymentCancelled() {
  return (
    <div className="w-full min-h-screen flex flex-1 justify-center items-center">
      <Card className="w-[350px]">
        <CardContent>
          <div className="w-full flex justify-center">
            <XIcon className="size-12 p-2 bg-red-500/30 text-red-500 rounded-full" />
          </div>
          <div className="mt-3 text-center sm:mt-5 w-full">
            <h2 className="text-xl font-semibold">Payment Cancelled</h2>
            <p className="text-sm text-muted-foreground mt-2 tracking-tight text-balance">
              Your payment has been cancelled. Please try again.
            </p>

            <Link
              className={buttonVariants({
                className:
                  "w-full mt-4 transition-colors duration-300 ease-in-out",
              })}
              href="/"
            >
              <ArrowLeft className="size-4" />
              Go Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
