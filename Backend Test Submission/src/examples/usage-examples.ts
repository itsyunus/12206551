import { logger, log } from '../middleware/logging';

/**
 * Usage Examples for the Logging Middleware
 * These examples demonstrate various scenarios and use cases
 */

// Example 1: Database Error Logging
export async function logDatabaseError() {
  try {
    await logger.error(
      'backend',
      'db',
      'Connection to PostgreSQL database failed: timeout after 30 seconds',
      'your-auth-token-here' // Optional: override default token
    );
  } catch (error) {
    console.error('Failed to log database error:', error);
  }
}

// Example 2: API Warning
export async function logApiWarning() {
  try {
    await logger.warn(
      'backend',
      'api',
      'Rate limit approaching: 90% of allowed requests used in current window'
    );
  } catch (error) {
    console.error('Failed to log API warning:', error);
  }
}

// Example 3: Handler Mismatch
export async function logHandlerMismatch() {
  try {
    await logger.error(
      'backend',
      'handler',
      'Request handler mismatch: expected POST /api/users but received GET /api/user'
    );
  } catch (error) {
    console.error('Failed to log handler mismatch:', error);
  }
}

// Example 4: Frontend Authentication Error
export async function logFrontendAuthError() {
  try {
    await logger.error(
      'frontend',
      'auth',
      'User authentication failed: invalid JWT token signature'
    );
  } catch (error) {
    console.error('Failed to log auth error:', error);
  }
}

// Example 5: Frontend API Success
export async function logFrontendApiSuccess() {
  try {
    await logger.info(
      'frontend',
      'api',
      'User profile data successfully fetched and cached'
    );
  } catch (error) {
    console.error('Failed to log API success:', error);
  }
}

// Example 6: Using the simple function interface
export async function logWithSimpleFunction() {
  try {
    await log(
      'frontend',
      'debug',
      'utils',
      'Utility function calculateTax() executed successfully with result: $124.50'
    );
  } catch (error) {
    console.error('Failed to log with simple function:', error);
  }
}

// Example 7: Cache Operations
export async function logCacheOperations() {
  try {
    // Cache hit
    await logger.debug(
      'backend',
      'cache',
      'Cache hit for key: user_profile_12345, retrieved in 2ms'
    );

    // Cache miss
    await logger.info(
      'backend',
      'cache',
      'Cache miss for key: product_inventory_98765, fetching from database'
    );

    // Cache error
    await logger.error(
      'backend',
      'cache',
      'Redis connection lost: unable to write cache entry for session_abc123'
    );
  } catch (error) {
    console.error('Failed to log cache operations:', error);
  }
}

// Example 8: Service Layer Logging
export async function logServiceOperations() {
  try {
    await logger.info(
      'backend',
      'service',
      'User registration service: successfully created user account for email@example.com'
    );

    await logger.warn(
      'backend',
      'service',
      'Payment service: retry attempt 2/3 for transaction txn_987654321'
    );

    await logger.fatal(
      'backend',
      'service',
      'Email service: SMTP server completely unavailable, all email delivery suspended'
    );
  } catch (error) {
    console.error('Failed to log service operations:', error);
  }
}

// Example 9: Validation Errors
export async function logValidationErrors() {
  try {
    await logger.warn(
      'frontend',
      'validation',
      'Form validation failed: email field contains invalid format (user input: "not-an-email")'
    );

    await logger.error(
      'backend',
      'validation',
      'Request validation failed: required field "userId" missing from payload'
    );
  } catch (error) {
    console.error('Failed to log validation errors:', error);
  }
}

// Example 10: Batch Logging with Error Handling
export async function logMultipleEvents() {
  const events = [
    { stack: 'frontend' as const, level: 'info' as const, package: 'controller' as const, message: 'Page loaded successfully' },
    { stack: 'frontend' as const, level: 'debug' as const, package: 'utils' as const, message: 'DOM manipulation completed' },
    { stack: 'frontend' as const, level: 'warn' as const, package: 'api' as const, message: 'Slow network detected' }
  ];

  for (const event of events) {
    try {
      await logger.log(event.stack, event.level, event.package, event.message);
    } catch (error) {
      console.error(`Failed to log event: ${event.message}`, error);
      // Continue with next event instead of failing completely
    }
  }
}