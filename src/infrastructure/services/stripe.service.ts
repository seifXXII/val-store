/**
 * Stripe Service
 *
 * Server-side Stripe integration for payment processing.
 */

import Stripe from "stripe";

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-12-15.clover",
  typescript: true,
});

export interface CreatePaymentIntentInput {
  amount: number; // in cents
  currency?: string;
  customerId?: string;
  orderId: string;
  metadata?: Record<string, string>;
}

export interface CreatePaymentIntentResult {
  clientSecret: string;
  paymentIntentId: string;
}

export interface CreateCheckoutSessionInput {
  lineItems: {
    productName: string;
    productId: string;
    unitAmount: number; // in cents
    quantity: number;
    imageUrl?: string;
  }[];
  orderId: string;
  customerEmail?: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}

export interface CreateCheckoutSessionResult {
  sessionId: string;
  url: string;
}

export class StripeService {
  /**
   * Create a Payment Intent for custom checkout flow
   */
  async createPaymentIntent(
    input: CreatePaymentIntentInput
  ): Promise<CreatePaymentIntentResult> {
    const { amount, currency = "usd", orderId, metadata = {} } = input;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        orderId,
        ...metadata,
      },
    });

    if (!paymentIntent.client_secret) {
      throw new Error("Failed to create payment intent");
    }

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  }

  /**
   * Create a Stripe Checkout Session (hosted checkout)
   */
  async createCheckoutSession(
    input: CreateCheckoutSessionInput
  ): Promise<CreateCheckoutSessionResult> {
    const {
      lineItems,
      orderId,
      customerEmail,
      successUrl,
      cancelUrl,
      metadata = {},
    } = input;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems.map((item) => ({
        price_data: {
          currency: "egp",
          product_data: {
            name: item.productName,
            images: item.imageUrl ? [item.imageUrl] : [],
            metadata: {
              productId: item.productId,
            },
          },
          unit_amount: item.unitAmount,
        },
        quantity: item.quantity,
      })),
      customer_email: customerEmail,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        orderId,
        ...metadata,
      },
    });

    if (!session.url) {
      throw new Error("Failed to create checkout session");
    }

    return {
      sessionId: session.id,
      url: session.url,
    };
  }

  /**
   * Retrieve a payment intent
   */
  async getPaymentIntent(paymentIntentId: string) {
    return stripe.paymentIntents.retrieve(paymentIntentId);
  }

  /**
   * Retrieve a checkout session
   */
  async getCheckoutSession(sessionId: string) {
    return stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "payment_intent"],
    });
  }

  /**
   * Construct webhook event from request
   */
  constructWebhookEvent(
    payload: string | Buffer,
    signature: string
  ): Stripe.Event {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error("STRIPE_WEBHOOK_SECRET is not configured");
    }

    return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  }
}

// Export singleton instance
export const stripeService = new StripeService();
