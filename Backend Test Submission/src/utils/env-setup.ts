/**
 * Environment Setup Utilities
 * Helper functions for configuring the logging middleware in different environments
 */

export interface EnvConfig {
  logAuthToken?: string;
  logApiUrl?: string;
  enableConsoleLogging?: boolean;
  logLevel?: string;
}

/**
 * Setup environment variables for logging middleware
 * Call this early in your application lifecycle
 */
export function setupLoggingEnvironment(config: EnvConfig = {}): void {
  // For browser environments, attach to window object
  if (typeof window !== 'undefined') {
    (window as any).__LOG_AUTH_TOKEN__ = config.logAuthToken;
    (window as any).__LOG_API_URL__ = config.logApiUrl;
    (window as any).__ENABLE_CONSOLE_LOGGING__ = config.enableConsoleLogging;
  }

  // For Node.js environments, set process.env
  if (typeof process !== 'undefined' && process.env) {
    if (config.logAuthToken) {
      process.env.LOG_AUTH_TOKEN = config.logAuthToken;
    }
    if (config.logApiUrl) {
      process.env.LOG_API_URL = config.logApiUrl;
    }
    if (config.enableConsoleLogging !== undefined) {
      process.env.ENABLE_CONSOLE_LOGGING = config.enableConsoleLogging.toString();
    }
  }
}

/**
 * Validate environment configuration
 */
export function validateEnvironment(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check for auth token
  const hasToken = 
    (typeof window !== 'undefined' && (window as any).__LOG_AUTH_TOKEN__) ||
    (typeof process !== 'undefined' && process.env?.LOG_AUTH_TOKEN) ||
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_LOG_AUTH_TOKEN);

  if (!hasToken) {
    errors.push('No authorization token found. Set LOG_AUTH_TOKEN environment variable or call setupLoggingEnvironment()');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Get current environment info
 */
export function getEnvironmentInfo(): {
  platform: 'browser' | 'node' | 'unknown';
  hasToken: boolean;
  apiUrl: string;
} {
  let platform: 'browser' | 'node' | 'unknown' = 'unknown';
  let hasToken = false;
  let apiUrl = 'http://20.244.56.144/evaluation-service/logs';

  if (typeof window !== 'undefined') {
    platform = 'browser';
    hasToken = !!(window as any).__LOG_AUTH_TOKEN__ || !!import.meta.env?.VITE_LOG_AUTH_TOKEN;
    apiUrl = (window as any).__LOG_API_URL__ || import.meta.env?.VITE_LOG_API_URL || apiUrl;
  } else if (typeof process !== 'undefined') {
    platform = 'node';
    hasToken = !!process.env?.LOG_AUTH_TOKEN;
    apiUrl = process.env?.LOG_API_URL || apiUrl;
  }

  return { platform, hasToken, apiUrl };
}