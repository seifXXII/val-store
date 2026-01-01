/**
 * Create Checkout Session Use Case
 *
 * Creates a Stripe checkout session from cart items.
 * Order is created on successful payment via webhook.
 */

import { CartRepositoryInterface } from "@/domain/interfaces/repositories/cart.repository.interface";
import { stripeService } from "@/infrastructure/services/stripe.service";

export interface CreateCheckoutSessionInput {
  userId: string;
  email: string;
}

export interface CreateCheckoutSessionOutput {
  sessionId: string;
  url: string;
}

export class CreateCheckoutSessionUseCase {
  constructor(private readonly cartRepository: CartRepositoryInterface) {}

  async execute(
    input: CreateCheckoutSessionInput
  ): Promise<CreateCheckoutSessionOutput> {
    const { userId, email } = input;

    // Get cart items
    const cartItems = await this.cartRepository.findByUserId(userId);

    if (cartItems.length === 0) {
      throw new Error("Cart is empty");
    }

    // Generate a temporary order ID for tracking
    const tempOrderId = crypto.randomUUID();

    // Build success/cancel URLs
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const successUrl = `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${baseUrl}/cart`;

    // Create Stripe Checkout Session
    const session = await stripeService.createCheckoutSession({
      lineItems: cartItems.map((item) => ({
        productName: item.productName,
        productId: item.productId,
        unitAmount: Math.round(item.productPrice * 100), // Convert to cents
        quantity: item.quantity,
        imageUrl: item.productImage || undefined,
      })),
      orderId: tempOrderId,
      customerEmail: email,
      successUrl,
      cancelUrl,
    });

    return {
      sessionId: session.sessionId,
      url: session.url,
    };
  }
}
