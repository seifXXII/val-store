/**
 * Email Service Interface
 *
 * Defines the contract for email sending operations.
 * Follows Onion Architecture - this interface lives in Application layer.
 */

export interface SendEmailInput {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

export interface SendEmailResult {
  id: string;
  success: boolean;
}

export interface EmailServiceInterface {
  /**
   * Send a raw email
   */
  sendEmail(input: SendEmailInput): Promise<SendEmailResult>;

  /**
   * Send verification email to a new user
   */
  sendVerificationEmail(
    email: string,
    verificationUrl: string,
    userName?: string
  ): Promise<void>;

  /**
   * Send password reset email
   */
  sendPasswordResetEmail(
    email: string,
    resetUrl: string,
    userName?: string
  ): Promise<void>;

  /**
   * Send order confirmation email
   */
  sendOrderConfirmation(
    email: string,
    orderNumber: string,
    orderDetails: {
      items: { name: string; quantity: number; price: number }[];
      total: number;
      shippingAddress: string;
    }
  ): Promise<void>;

  /**
   * Send welcome email after verification
   */
  sendWelcomeEmail(email: string, userName?: string): Promise<void>;
}
