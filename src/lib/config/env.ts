/**
 * Environment Configuration & Validation
 * Validates all required environment variables at startup
 */

interface EnvConfig {
  // App
  appName: string;
  appUrl: string;
  nodeEnv: "development" | "production" | "test";
  
  // Supabase
  supabaseUrl: string;
  supabaseAnonKey: string;
  
  // API Keys (optional)
  googleMapsApiKey?: string;
  sendgridApiKey?: string;
  
  // Feature Flags
  enableAiFeatures: boolean;
  enableEmailTracking: boolean;
  enableExports: boolean;
  
  // Limits
  maxLeadsPerUser: number;
  maxEmailsPerDay: number;
}

class EnvValidator {
  private errors: string[] = [];

  /**
   * Validate and return environment configuration
   */
  validate(): EnvConfig {
    this.errors = [];

    const config: EnvConfig = {
      // App
      appName: this.getRequired("NEXT_PUBLIC_APP_NAME"),
      appUrl: this.getRequired("NEXT_PUBLIC_APP_URL"),
      nodeEnv: this.getNodeEnv(),
      
      // Supabase
      supabaseUrl: this.getRequired("NEXT_PUBLIC_SUPABASE_URL"),
      supabaseAnonKey: this.getRequired("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
      
      // Optional API Keys
      googleMapsApiKey: this.getOptional("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY"),
      sendgridApiKey: this.getOptional("SENDGRID_API_KEY"),
      
      // Feature Flags
      enableAiFeatures: this.getBoolean("NEXT_PUBLIC_ENABLE_AI_FEATURES", true),
      enableEmailTracking: this.getBoolean("NEXT_PUBLIC_ENABLE_EMAIL_TRACKING", true),
      enableExports: this.getBoolean("NEXT_PUBLIC_ENABLE_EXPORTS", true),
      
      // Limits
      maxLeadsPerUser: this.getNumber("MAX_LEADS_PER_USER", 10000),
      maxEmailsPerDay: this.getNumber("MAX_EMAILS_PER_DAY", 1000)
    };

    if (this.errors.length > 0) {
      const errorMessage = `Environment validation failed:\n${this.errors.join("\n")}`;
      console.error(errorMessage);
      
      if (config.nodeEnv === "production") {
        throw new Error(errorMessage);
      }
    }

    return config;
  }

  /**
   * Get required environment variable
   */
  private getRequired(key: string): string {
    const value = process.env[key];
    
    if (!value || value.trim() === "") {
      this.errors.push(`❌ Missing required environment variable: ${key}`);
      return "";
    }
    
    return value;
  }

  /**
   * Get optional environment variable
   */
  private getOptional(key: string): string | undefined {
    const value = process.env[key];
    return value && value.trim() !== "" ? value : undefined;
  }

  /**
   * Get boolean environment variable
   */
  private getBoolean(key: string, defaultValue: boolean): boolean {
    const value = process.env[key];
    
    if (!value) return defaultValue;
    
    return value.toLowerCase() === "true" || value === "1";
  }

  /**
   * Get number environment variable
   */
  private getNumber(key: string, defaultValue: number): number {
    const value = process.env[key];
    
    if (!value) return defaultValue;
    
    const parsed = parseInt(value, 10);
    
    if (isNaN(parsed)) {
      this.errors.push(`⚠️ Invalid number for ${key}: ${value}`);
      return defaultValue;
    }
    
    return parsed;
  }

  /**
   * Get NODE_ENV with validation
   */
  private getNodeEnv(): "development" | "production" | "test" {
    const env = process.env.NODE_ENV;
    
    if (env === "production" || env === "test") {
      return env;
    }
    
    return "development";
  }

  /**
   * Print configuration summary
   */
  printSummary(config: EnvConfig): void {
    console.log("\n🔧 Environment Configuration:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`📱 App Name: ${config.appName}`);
    console.log(`🌐 App URL: ${config.appUrl}`);
    console.log(`⚙️  Environment: ${config.nodeEnv}`);
    console.log(`🗄️  Database: ${config.supabaseUrl ? "✓ Connected" : "✗ Not configured"}`);
    console.log(`🗺️  Google Maps: ${config.googleMapsApiKey ? "✓ Configured" : "○ Optional"}`);
    console.log(`📧 SendGrid: ${config.sendgridApiKey ? "✓ Configured" : "○ Optional"}`);
    console.log(`🤖 AI Features: ${config.enableAiFeatures ? "✓ Enabled" : "✗ Disabled"}`);
    console.log(`📊 Email Tracking: ${config.enableEmailTracking ? "✓ Enabled" : "✗ Disabled"}`);
    console.log(`📤 Exports: ${config.enableExports ? "✓ Enabled" : "✗ Disabled"}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  }
}

// Validate and export configuration
const validator = new EnvValidator();
export const env = validator.validate();

// Print summary in development
if (env.nodeEnv === "development" && typeof window === "undefined") {
  validator.printSummary(env);
}