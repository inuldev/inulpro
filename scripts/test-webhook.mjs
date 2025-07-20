#!/usr/bin/env node

/**
 * Script untuk test webhook Stripe di production
 * Jalankan dengan: node scripts/test-webhook.mjs
 */

import crypto from "crypto";

// Konfigurasi
const WEBHOOK_URL =
  process.env.WEBHOOK_URL || "https://your-domain.com/api/webhook/stripe";
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

if (!WEBHOOK_SECRET) {
  console.error("❌ STRIPE_WEBHOOK_SECRET environment variable is required");
  process.exit(1);
}

// Sample webhook payload
const samplePayload = {
  id: "evt_test_webhook",
  object: "event",
  api_version: "2025-06-30.basil",
  created: Math.floor(Date.now() / 1000),
  data: {
    object: {
      id: "cs_test_session",
      object: "checkout.session",
      amount_total: 5000,
      customer: "cus_test_customer",
      metadata: {
        courseId: "test-course-id",
        enrollmentId: "test-enrollment-id",
        userId: "test-user-id",
      },
      payment_status: "paid",
      status: "complete",
    },
  },
  livemode: false,
  pending_webhooks: 1,
  request: {
    id: null,
    idempotency_key: null,
  },
  type: "checkout.session.completed",
};

function generateStripeSignature(payload, secret) {
  const timestamp = Math.floor(Date.now() / 1000);
  const payloadString = JSON.stringify(payload);
  const signedPayload = `${timestamp}.${payloadString}`;

  const signature = crypto
    .createHmac("sha256", secret)
    .update(signedPayload, "utf8")
    .digest("hex");

  return `t=${timestamp},v1=${signature}`;
}

async function testWebhook() {
  try {
    console.log("🧪 Testing webhook endpoint...");
    console.log("📍 URL:", WEBHOOK_URL);

    const signature = generateStripeSignature(samplePayload, WEBHOOK_SECRET);
    const payloadString = JSON.stringify(samplePayload);

    console.log("📝 Payload:", JSON.stringify(samplePayload, null, 2));
    console.log("🔐 Signature:", signature);

    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Stripe-Signature": signature,
        "User-Agent": "Stripe/1.0 (+https://stripe.com/docs/webhooks)",
      },
      body: payloadString,
    });

    console.log("📊 Response status:", response.status);
    console.log(
      "📄 Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    const responseText = await response.text();
    console.log("📋 Response body:", responseText);

    if (response.ok) {
      console.log("✅ Webhook test successful!");
    } else {
      console.log("❌ Webhook test failed!");
    }
  } catch (error) {
    console.error("💥 Error testing webhook:", error.message);
  }
}

// Jalankan test
testWebhook();
