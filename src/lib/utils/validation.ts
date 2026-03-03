/**
 * Data Validation Utilities
 */

export const validation = {
  /**
   * Validate email address
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate Canadian phone number
   */
  isValidPhone(phone: string): boolean {
    const phoneRegex = /^(\+1|1)?[\s.-]?\(?[2-9]\d{2}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
    return phoneRegex.test(phone);
  },

  /**
   * Validate Canadian postal code
   */
  isValidPostalCode(postalCode: string): boolean {
    const postalRegex = /^[A-Za-z]\d[A-Za-z][\s-]?\d[A-Za-z]\d$/;
    return postalRegex.test(postalCode);
  },

  /**
   * Validate URL
   */
  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Sanitize string input (prevent XSS)
   */
  sanitizeString(input: string): string {
    return input
      .replace(/[<>]/g, "")
      .trim()
      .slice(0, 500);
  },

  /**
   * Validate lead data
   */
  validateLeadData(data: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.businessName || data.businessName.trim().length === 0) {
      errors.push("Business name is required");
    }

    if (data.email && !this.isValidEmail(data.email)) {
      errors.push("Invalid email address");
    }

    if (data.phone && !this.isValidPhone(data.phone)) {
      errors.push("Invalid phone number format");
    }

    if (data.postalCode && !this.isValidPostalCode(data.postalCode)) {
      errors.push("Invalid postal code format");
    }

    if (data.website && !this.isValidUrl(data.website)) {
      errors.push("Invalid website URL");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  /**
   * Validate email campaign data
   */
  validateCampaignData(data: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.subject || data.subject.trim().length === 0) {
      errors.push("Subject line is required");
    }

    if (data.subject && data.subject.length > 200) {
      errors.push("Subject line too long (max 200 characters)");
    }

    if (!data.content || data.content.trim().length === 0) {
      errors.push("Email content is required");
    }

    if (data.content && data.content.length > 50000) {
      errors.push("Email content too long (max 50,000 characters)");
    }

    if (data.recipients && (!Array.isArray(data.recipients) || data.recipients.length === 0)) {
      errors.push("At least one recipient is required");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },
};

/**
 * Rate limiting helper
 */
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();

  constructor(
    private maxRequests: number = 100,
    private windowMs: number = 60000
  ) {}

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < this.windowMs);
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    
    return true;
  }

  reset(identifier: string): void {
    this.requests.delete(identifier);
  }
}