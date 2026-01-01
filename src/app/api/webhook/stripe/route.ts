/**
 * Stripe Webhook Handler
 *
 * Handles Stripe events like checkout.session.completed.
 * Creates orders and sends confirmation emails on successful payment.
 */

import { NextRequest, NextResponse } from "next/server";
import { stripeService } from "@/infrastructure/services/stripe.service";
import { ResendEmailService } from "@/infrastructure/services/resend-email.service";
import { db } from "@/db";
import { cartItems } from "@/db/schema";
import { eq } from "drizzle-orm";

const emailService = new ResendEmailService();

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event;

  try {
    event = stripeService.constructWebhookEvent(body, signature);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json(
      { error: `Webhook Error: ${message}` },
      { status: 400 }
    );
  }

  // Handle event types
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const customerEmail = session.customer_email;
      const metadata = session.metadata;

      console.log("Checkout completed:", {
        sessionId: session.id,
        email: customerEmail,
        orderId: metadata?.orderId,
        paymentStatus: session.payment_status,
      });

      // Send order confirmation email
      if (customerEmail && session.payment_status === "paid") {
        try {
          // Fetch line items for the email
          const fullSession = await stripeService.getCheckoutSession(
            session.id
          );
          const lineItems = fullSession.line_items?.data || [];

          const orderNumber = session.id.slice(-12).toUpperCase();
          const items = lineItems.map((item) => ({
            name: item.description || "Product",
            quantity: item.quantity || 1,
            price: (item.amount_total || 0) / 100,
          }));
          const total = (session.amount_total || 0) / 100;

          await emailService.sendOrderConfirmation(customerEmail, orderNumber, {
            items,
            total,
            shippingAddress: "Address will be confirmed separately",
          });

          console.log("Order confirmation email sent to:", customerEmail);
        } catch (error) {
          console.error("Failed to send order confirmation email:", error);
        }
      }

      // Clear cart if we have user info
      if (metadata?.userId) {
        try {
          await db
            .delete(cartItems)
            .where(eq(cartItems.userId, metadata.userId));
          console.log("Cart cleared for user:", metadata.userId);
        } catch (error) {
          console.error("Failed to clear cart:", error);
        }
      }

      break;
    }

    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;
      console.log("Payment succeeded:", paymentIntent.id);
      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object;
      console.error("Payment failed:", paymentIntent.id);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
