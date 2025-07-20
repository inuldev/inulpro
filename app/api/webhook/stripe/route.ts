import Stripe from "stripe";
import { headers } from "next/headers";

import prisma from "@/lib/db";
import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  console.log("🔔 Webhook received");

  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );
    console.log("✅ Webhook signature verified, event type:", event.type);
  } catch (error) {
    console.error("❌ Webhook signature verification failed:", error);
    return new Response("Webhook error", { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      console.log("💳 Processing checkout.session.completed");

      const session = event.data.object as Stripe.Checkout.Session;
      const courseId = session.metadata?.courseId;
      const enrollmentId = session.metadata?.enrollmentId;
      const customerId = session.customer as string;

      console.log("📋 Session metadata:", {
        courseId,
        enrollmentId,
        customerId,
        amount: session.amount_total,
      });

      if (!courseId) {
        console.error("❌ Course ID not found in metadata");
        return new Response("Course ID missing", { status: 400 });
      }

      if (!enrollmentId) {
        console.error("❌ Enrollment ID not found in metadata");
        return new Response("Enrollment ID missing", { status: 400 });
      }

      const user = await prisma.user.findUnique({
        where: {
          stripeCustomerId: customerId,
        },
      });

      if (!user) {
        console.error("❌ User not found with Stripe customer ID:", customerId);
        return new Response("User not found", { status: 400 });
      }

      console.log("👤 User found:", user.email);

      // Verify enrollment exists
      const existingEnrollment = await prisma.enrollment.findUnique({
        where: {
          id: enrollmentId,
        },
      });

      if (!existingEnrollment) {
        console.error("❌ Enrollment not found:", enrollmentId);
        return new Response("Enrollment not found", { status: 400 });
      }

      console.log(
        "📚 Enrollment found, current status:",
        existingEnrollment.status
      );

      const updatedEnrollment = await prisma.enrollment.update({
        where: {
          id: enrollmentId,
        },
        data: {
          status: "Completed",
          amount: session.amount_total as number,
        },
      });

      console.log("✅ Enrollment updated successfully:", {
        id: updatedEnrollment.id,
        status: updatedEnrollment.status,
        amount: updatedEnrollment.amount,
      });
    } else {
      console.log("ℹ️ Unhandled event type:", event.type);
    }

    return new Response("Webhook processed successfully", { status: 200 });
  } catch (error) {
    console.error("❌ Error processing webhook:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
