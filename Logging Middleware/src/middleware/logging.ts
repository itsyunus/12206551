import { LogStack, LogLevel, LogPackage, LogEntry, LogConfig, LogResponse, LogError } from '../types/logging';

/**
 * Universal Logging Middleware
 */
class LoggingMiddleware {
  private apiUrl: string;
  private defaultAuthToken?: string;
  private timeout: number;

  constructor(config: LogConfig = {}) {
    this.apiUrl = config.apiUrl || 'http://20.244.56.144/evaluation-service/logs';
    this.defaultAuthToken = config.authToken || this.getEnvToken();
    this.timeout = config.timeout || 10000;
  }

  private getEnvToken(): string | undefined {
    if (typeof window !== 'undefined') {
      return import.meta.env?.VITE_LOG_AUTH_TOKEN || (window as any).__LOG_AUTH_TOKEN__;
    }
    if (typeof process !== 'undefined' && process.env) {
      return process.env.LOG_AUTH_TOKEN;
    }
    return undefined;
  }

  private validateLogEntry(stack: LogStack, level: LogLevel, packageName: LogPackage, message: string): void {
    const validStacks: LogStack[] = ['backend', 'frontend'];
    const validLevels: LogLevel[] = ['debug', 'info', 'warn', 'error', 'fatal'];
    const validPackages: LogPackage[] = [
      'handler', 'db', 'api', 'auth', 'middleware', 
      'service', 'controller', 'utils', 'validation', 
      'cache', 'queue', 'scheduler'
    ];

    if (!validStacks.includes(stack)) throw new Error(`Invalid stack: ${stack}`);
    if (!validLevels.includes(level)) throw new Error(`Invalid level: ${level}`);
    if (!validPackages.includes(packageName)) throw new Error(`Invalid package: ${packageName}`);
    if (!message || message.trim().length === 0) throw new Error('Message cannot be empty');
    if (message.length > 1000) throw new Error('Message cannot exceed 1000 characters');
  }

  private async makeRequest(logEntry: LogEntry, authToken?: string): Promise<LogResponse> {
    const token = authToken || this.getEnvToken();
    if (!token) throw new Error('Missing auth token.');

    // Fallback for environments like Bolt.new (no external fetch allowed)
    if (typeof window !== 'undefined' && (window.location.hostname.includes('webcontainer') || window.location.hostname.includes('localhost'))) {
      console.warn('[Mock] Logging skipped in development environment');
      return {
        success: true,
        timestamp: new Date().toISOString(),
        mock: true
      };
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    const requestConfig: RequestInit = {
      method: 'POST',
      headers,
      body: JSON.stringify(logEntry),
    };

    if (typeof AbortController !== 'undefined') {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);
      requestConfig.signal = controller.signal;

      try {
        const response = await fetch(this.apiUrl, requestConfig);
        clearTimeout(timeoutId);
        if (!response.ok) {
          const errorText = await response.text().catch(() => 'Unknown error');
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        const responseData = await response.json().catch(() => ({}));
        return { success: true, timestamp: new Date().toISOString(), ...responseData };
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    } else {
      const response = await fetch(this.apiUrl, requestConfig);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const responseData = await response.json().catch(() => ({}));
      return { success: true, timestamp: new Date().toISOString(), ...responseData };
    }
  }

  async log(
    stack: LogStack,
    level: LogLevel,
    packageName: LogPackage,
    message: string,
    authToken?: string
  ): Promise<LogResponse> {
    try {
      this.validateLogEntry(stack, level, packageName, message);

      const logEntry: LogEntry = {
        stack,
        level,
        package: packageName,
        message: message.trim()
      };

      const response = await this.makeRequest(logEntry, authToken);

      if (typeof window !== 'undefined' && import.meta.env?.DEV) {
        console.log(`[${level.toUpperCase()}] ${packageName}: ${message}`);
      } else if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
        console.log(`[${level.toUpperCase()}] ${packageName}: ${message}`);
      }

      return response;
    } catch (error) {
      const logError: LogError = {
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString()
      };
      console.error('Logging middleware error:', logError);
      throw error;
    }
  }

  async debug(stack: LogStack, packageName: LogPackage, message: string, authToken?: string): Promise<LogResponse> {
    return this.log(stack, 'debug', packageName, message, authToken);
  }

  async info(stack: LogStack, packageName: LogPackage, message: string, authToken?: string): Promise<LogResponse> {
    return this.log(stack, 'info', packageName, message, authToken);
  }

  async warn(stack: LogStack, packageName: LogPackage, message: string, authToken?: string): Promise<LogResponse> {
    return this.log(stack, 'warn', packageName, message, authToken);
  }

  async error(stack: LogStack, packageName: LogPackage, message: string, authToken?: string): Promise<LogResponse> {
    return this.log(stack, 'error', packageName, message, authToken);
  }

  async fatal(stack: LogStack, packageName: LogPackage, message: string, authToken?: string): Promise<LogResponse> {
    return this.log(stack, 'fatal', packageName, message, authToken);
  }
}

// Export singleton instance
export const logger = new LoggingMiddleware();
export { LoggingMiddleware };

export const log = (
  stack: LogStack,
  level: LogLevel,
  packageName: LogPackage,
  message: string,
  authToken?: string
): Promise<LogResponse> => {
  return logger.log(stack, level, packageName, message, authToken);
};
