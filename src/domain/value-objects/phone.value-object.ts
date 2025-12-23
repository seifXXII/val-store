/**
 * Phone Value Object
 *
 * Immutable value object for phone numbers.
 * Validates and formats phone numbers with international support.
 */

export class PhoneValueObject {
  private readonly value: string;

  constructor(phone: string) {
    const cleaned = this.cleanPhone(phone);

    if (!this.isValidPhone(cleaned)) {
      throw new Error(
        "Invalid phone number. Please enter a valid phone number with country code (e.g., +1234567890)"
      );
    }

    this.value = this.formatPhone(cleaned);
  }

  /**
   * Get the formatted phone value
   */
  getValue(): string {
    return this.value;
  }

  /**
   * Get phone without formatting (just digits and +)
   */
  getCleanValue(): string {
    return this.value.replace(/[\s()-]/g, "");
  }

  /**
   * Check if phone is equal to another
   */
  equals(other: PhoneValueObject): boolean {
    return this.getCleanValue() === other.getCleanValue();
  }

  /**
   * Clean phone input - remove all non-digit characters except +
   */
  private cleanPhone(phone: string): string {
    return phone.replace(/[^\d+]/g, "");
  }

  /**
   * Validate phone format
   * Supports:
   * - International format: +1234567890 (10-15 digits after +)
   * - National format: 1234567890 (7-15 digits)
   */
  private isValidPhone(phone: string): boolean {
    // International format with + prefix
    const internationalRegex = /^\+\d{10,15}$/;

    // National format (no + prefix)
    const nationalRegex = /^\d{7,15}$/;

    return internationalRegex.test(phone) || nationalRegex.test(phone);
  }

  /**
   * Format phone for display
   * Keeps the + prefix if present, adds spaces for readability
   */
  private formatPhone(phone: string): string {
    if (phone.startsWith("+")) {
      // International format: +1 234 567 8901
      const countryCode = phone.slice(0, 2);
      const rest = phone.slice(2);

      if (rest.length >= 10) {
        return `${countryCode} ${rest.slice(0, 3)} ${rest.slice(3, 6)} ${rest.slice(6)}`;
      }
      return phone;
    }

    // National format: (123) 456-7890
    if (phone.length === 10) {
      return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`;
    }

    return phone;
  }

  /**
   * Create from string (factory method)
   */
  static create(phone: string): PhoneValueObject {
    return new PhoneValueObject(phone);
  }

  /**
   * Check if a string is a valid phone without throwing
   */
  static isValid(phone: string): boolean {
    try {
      new PhoneValueObject(phone);
      return true;
    } catch {
      return false;
    }
  }
}
