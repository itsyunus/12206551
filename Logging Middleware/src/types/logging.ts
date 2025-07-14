export type LogStack = 'backend' | 'frontend';
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';
export type LogPackage =
  | 'handler' | 'db' | 'api' | 'auth' | 'middleware'
  | 'service' | 'controller' | 'utils' | 'validation'
  | 'cache' | 'queue' | 'scheduler';

export interface LogEntry {
  stack: LogStack;
  level: LogLevel;
  package: LogPackage;
  message: string;
}

export interface LogConfig {
  apiUrl?: string;
  authToken?: string;
  timeout?: number;
}

export interface LogResponse {
  success: boolean;
  timestamp: string;
  [key: string]: any;
}

export interface LogError {
  error: string;
  details?: string;
  timestamp: string;
}
