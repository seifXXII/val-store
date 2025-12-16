/**
 * UserProfile Entity
 *
 * Extends Better Auth's user table with e-commerce specific fields.
 * Manages user roles (Admin, Worker, Customer) for access control.
 */

export type UserRole = "customer" | "worker" | "admin";

export class UserProfileEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string, // FK to Better Auth user.id
    public readonly role: UserRole,
    public readonly phone: string | null,
    public readonly shippingAddress: string | null,
    public readonly billingAddress: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  /**
   * Check if user is an admin
   */
  isAdmin(): boolean {
    return this.role === "admin";
  }

  /**
   * Check if user is a worker
   */
  isWorker(): boolean {
    return this.role === "worker";
  }

  /**
   * Check if user is a customer
   */
  isCustomer(): boolean {
    return this.role === "customer";
  }

  /**
   * Check if user can access admin panel
   */
  canAccessAdminPanel(): boolean {
    return this.isAdmin() || this.isWorker();
  }

  /**
   * Check if user can process payments (admin and worker)
   */
  canProcessPayments(): boolean {
    return this.canAccessAdminPanel();
  }

  /**
   * Check if profile has complete shipping information
   */
  hasCompleteShippingInfo(): boolean {
    return this.phone !== null && this.shippingAddress !== null;
  }

  /**
   * Check if user can checkout
   */
  canCheckout(): boolean {
    return this.hasCompleteShippingInfo();
  }
}
