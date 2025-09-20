
// Error mitigation and connection stability utilities
// Prevents upstream connection errors and database timeouts

export interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  retryCondition?: (error: any) => boolean;
}

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  retryCondition: (error) => {
    // Retry on common upstream connection errors
    return error?.message?.includes('upstream connect error') ||
           error?.message?.includes('ECONNRESET') ||
           error?.message?.includes('ETIMEDOUT') ||
           error?.message?.includes('ENOTFOUND') ||
           error?.code === 'ECONNREFUSED' ||
           error?.code === 'ECONNRESET' ||
           error?.code === 'ETIMEDOUT';
  }
};

export async function withRetry<T>(
  operation: () => Promise<T>,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      // Don't retry if it's the last attempt or error doesn't match retry condition
      if (attempt === config.maxRetries || !config.retryCondition?.(error)) {
        break;
      }
      
      // Calculate exponential backoff delay
      const delay = Math.min(
        config.baseDelay * Math.pow(2, attempt),
        config.maxDelay
      );
      
      console.warn(`Attempt ${attempt + 1} failed, retrying in ${delay}ms:`, error instanceof Error ? error.message : 'Unknown error');
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}

export function createTimeoutPromise<T>(promise: Promise<T>, timeoutMs: number = 30000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Operation timed out after ${timeoutMs}ms`));
      }, timeoutMs);
    })
  ]);
}

// Database connection health check
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    const { prisma } = await import('./db');
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}

// API response wrapper with error handling
export function createApiResponse<T>(
  data?: T, 
  error?: string | null, 
  status: number = 200
) {
  if (error) {
    return Response.json(
      { error, timestamp: new Date().toISOString() },
      { status: status >= 400 ? status : 500 }
    );
  }
  
  return Response.json({
    data,
    timestamp: new Date().toISOString(),
    success: true
  }, { status });
}

// Graceful error handling for React components
export function handleAsyncError(error: any, fallbackMessage?: string): string {
  console.error('Async operation failed:', error);
  
  if (error?.message?.includes('upstream connect error')) {
    return 'Connection temporarily unavailable. Please try again.';
  }
  
  if (error?.message?.includes('timeout')) {
    return 'Request timed out. Please check your connection and try again.';
  }
  
  if (error?.code === 'ENOTFOUND') {
    return 'Service temporarily unavailable. Please try again later.';
  }
  
  return fallbackMessage || 'An unexpected error occurred. Please try again.';
}
