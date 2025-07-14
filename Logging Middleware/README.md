# Logging Middleware

A production-ready, universal logging middleware designed for AffordMed applications. This middleware works seamlessly in both Node.js and browser environments, providing a clean, type-safe interface for sending structured logs to a remote API endpoint.

## Features

- ✅ **Universal Compatibility**: Works in both Node.js and browser environments
- ✅ **TypeScript Support**: Full type safety with comprehensive interfaces
- ✅ **Environment Agnostic**: Supports various auth token configuration methods
- ✅ **Robust Error Handling**: Comprehensive validation and error management
- ✅ **Production Ready**: Includes timeout handling, retry logic, and fallbacks
- ✅ **Clean API**: Simple function interface with optional convenience methods
- ✅ **Comprehensive Documentation**: Usage examples and integration guides

## Installation

```bash
# Clone the repository
git clone <your-repository-url>
cd logging-middleware

# Install dependencies
npm install

# Start development server
npm run dev
```

## Environment Setup

### Option 1: Environment Variables
```bash
# For Node.js applications
export LOG_AUTH_TOKEN="your-bearer-token-here"

# For Vite/React applications (in .env file)
VITE_LOG_AUTH_TOKEN="your-bearer-token-here"
```

### Option 2: Programmatic Setup
```typescript
import { setupLoggingEnvironment } from './utils/env-setup';

setupLoggingEnvironment({
  logAuthToken: 'your-bearer-token-here',
  logApiUrl: 'http://20.244.56.144/evaluation-service/logs' // optional
});
```

## Basic Usage

### Simple Function Interface
```typescript
import { log } from './middleware/logging';

// Basic usage
await log('frontend', 'info', 'api', 'User successfully authenticated');

// With custom auth token
await log('backend', 'error', 'db', 'Connection failed', 'custom-token');
```

### Logger Instance Interface
```typescript
import { logger } from './middleware/logging';

// Using the logger instance
await logger.error('backend', 'db', 'Database connection timeout');
await logger.warn('frontend', 'api', 'Slow network detected');
await logger.info('backend', 'service', 'User registration completed');

// Convenience methods
await logger.debug('frontend', 'utils', 'Debug information');
await logger.fatal('backend', 'service', 'Critical system failure');
```

## Usage Examples

### 1. Database Error
```typescript
await logger.error(
  'backend',
  'db',
  'Connection to PostgreSQL database failed: timeout after 30 seconds'
);
```

### 2. API Warning
```typescript
await logger.warn(
  'backend',
  'api',
  'Rate limit approaching: 90% of allowed requests used in current window'
);
```

### 3. Handler Mismatch
```typescript
await logger.error(
  'backend',
  'handler',
  'Request handler mismatch: expected POST /api/users but received GET /api/user'
);
```

### 4. Frontend Authentication
```typescript
await logger.error(
  'frontend',
  'auth',
  'User authentication failed: invalid JWT token signature'
);
```

### 5. Cache Operations
```typescript
await logger.debug('backend', 'cache', 'Cache hit for key: user_profile_12345');
await logger.info('backend', 'cache', 'Cache miss for key: product_inventory_98765');
```

## API Reference

### Types

```typescript
type LogStack = 'backend' | 'frontend';
type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';
type LogPackage = 'handler' | 'db' | 'api' | 'auth' | 'middleware' | 
                  'service' | 'controller' | 'utils' | 'validation' | 
                  'cache' | 'queue' | 'scheduler';
```

### Main Function

```typescript
log(
  stack: LogStack,
  level: LogLevel,
  package: LogPackage,
  message: string,
  authToken?: string
): Promise<LogResponse>
```

### Logger Instance Methods

```typescript
logger.log(stack, level, package, message, authToken?): Promise<LogResponse>
logger.debug(stack, package, message, authToken?): Promise<LogResponse>
logger.info(stack, package, message, authToken?): Promise<LogResponse>
logger.warn(stack, package, message, authToken?): Promise<LogResponse>
logger.error(stack, package, message, authToken?): Promise<LogResponse>
logger.fatal(stack, package, message, authToken?): Promise<LogResponse>
```

## Error Handling

The middleware includes comprehensive error handling:

```typescript
try {
  await logger.error('backend', 'db', 'Connection failed');
} catch (error) {
  console.error('Logging failed:', error.message);
  // Handle logging failure gracefully
}
```

Common error scenarios:
- Missing or invalid authorization token
- Network connectivity issues
- Invalid parameter values
- API endpoint unavailable

## Validation Rules

- **Stack**: Must be 'backend' or 'frontend'
- **Level**: Must be 'debug', 'info', 'warn', 'error', or 'fatal'
- **Package**: Must be one of the predefined package identifiers
- **Message**: Cannot be empty, maximum 1000 characters
- **Auth Token**: Required either as parameter or environment variable

## Integration Examples

### React Application
```typescript
// In your React component
import { logger } from './middleware/logging';

const MyComponent = () => {
  const handleUserAction = async () => {
    try {
      // Your business logic here
      await logger.info('frontend', 'controller', 'User action completed successfully');
    } catch (error) {
      await logger.error('frontend', 'controller', `User action failed: ${error.message}`);
    }
  };
};
```

### Node.js Backend
```typescript
// In your Express middleware
import { logger } from './middleware/logging';

app.use(async (req, res, next) => {
  try {
    await logger.info('backend', 'middleware', `Request: ${req.method} ${req.path}`);
    next();
  } catch (error) {
    await logger.error('backend', 'middleware', `Logging failed: ${error.message}`);
    next(); // Continue request processing
  }
});
```

## Project Structure

```
src/
├── types/
│   └── logging.ts          # TypeScript type definitions
├── middleware/
│   └── logging.ts          # Main logging middleware
├── utils/
│   └── env-setup.ts        # Environment configuration utilities
├── examples/
│   └── usage-examples.ts   # Comprehensive usage examples
└── App.tsx                 # Demo application
```

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint
```

## Security Considerations

- Never commit authorization tokens to version control
- Use environment variables for sensitive configuration
- Implement proper token rotation in production
- Consider implementing request rate limiting
- Validate and sanitize log messages to prevent injection attacks

## Browser Compatibility

- Modern browsers with `fetch` API support
- Node.js 14+ for backend usage
- Automatic fallbacks for environments without `AbortController`

## Contributing

1. Follow TypeScript best practices
2. Maintain backward compatibility
3. Add comprehensive tests for new features
4. Update documentation for API changes
5. Ensure cross-platform compatibility

## License

This project is intended for educational and assignment purposes.