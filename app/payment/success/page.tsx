/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ArrowLeft, CheckIcon } from "lucide-react";

import { useConfetti } from "@/hooks/use-confetti";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function PaymentSuccessfull() {
  const triggerConfetti = useConfetti();

  useEffect(() => {
    triggerConfetti();
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-1 justify-center items-center">
      <Card className="w-[350px]">
        <CardContent>
          <div className="w-full flex justify-center">
            <CheckIcon className="size-12 p-2 bg-green-500/30 text-green-500 rounded-full" />
          </div>
          <div className="mt-3 text-center sm:mt-5 w-full">
            <h2 className="text-xl font-semibold">Payment Successfull</h2>
            <p className="text-sm text-muted-foreground mt-2 tracking-tight text-balance">
              Your payment has been successfull. You can now access the course.
            </p>

            <Link
              className={buttonVariants({
                className:
                  "w-full mt-4 transition-colors duration-300 ease-in-out",
              })}
              href="/dashboard"
            >
              <ArrowLeft className="size-4" />
              Go Dashboard
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
