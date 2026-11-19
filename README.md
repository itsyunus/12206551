# Cross-Platform Logging Middleware & Evaluation Suite

A standardized, multi-environment logging middleware and testing harness implementing unified logging across browser runtimes and Node.js backend microservices.

## Architecture

- Reusable Middleware (`Logging Middleware/src/middleware/logging.ts`): Unified API supporting log levels (`debug`, `info`, `warn`, `error`, `fatal`). Seamlessly transitions between Node.js standard outputs and browser console streams with automated bearer token extraction.
- Backend Test Service (`Backend Test Submission`): Express.js REST application demonstrating middleware interception across authentication, user management, and transactional endpoints.
- Frontend Client (`Frontend Test Submission`): React + Vite application verifying non-blocking log event dispatch during asynchronous UI interactions.

## Execution

```bash
# Backend Test Service
cd "Backend Test Submission"
npm install
npm start

# Frontend Test Client
cd "../Frontend Test Submission"
npm install
npm run dev
```
