import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Enhanced Prisma configuration for production resilience
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  errorFormat: 'pretty',
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

// Connection health monitoring
let isConnected = false;
let lastConnectionCheck = 0;
const CONNECTION_CHECK_INTERVAL = 30000; // 30 seconds

export async function ensureDbConnection(): Promise<boolean> {
  const now = Date.now();
  
  // Skip check if recently validated
  if (isConnected && (now - lastConnectionCheck) < CONNECTION_CHECK_INTERVAL) {
    return true;
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    isConnected = true;
    lastConnectionCheck = now;
    return true;
  } catch (error) {
    isConnected = false;
    console.error('[DB] Connection failed:', error);
    return false;
  }
}

// Enhanced database operation wrapper with retry logic
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = parseInt(process.env.DATABASE_RETRY_ATTEMPTS || '3'),
  baseDelay: number = parseInt(process.env.DATABASE_RETRY_DELAY || '1000')
): Promise<T> {
  let lastError: Error = new Error('Database operation failed');
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Ensure connection before operation
      if (!await ensureDbConnection()) {
        throw new Error('Database connection unavailable');
      }
      
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown database error');
      
      // Don't retry on the last attempt
      if (attempt === maxRetries) {
        break;
      }
      
      // Exponential backoff with jitter
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
      console.warn(`[DB] Operation failed (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${Math.round(delay)}ms:`, lastError.message);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Reset connection status to force recheck
      isConnected = false;
    }
  }
  
  console.error('[DB] Operation failed after all retry attempts:', lastError.message);
  throw lastError;
}

// Graceful shutdown handling
export async function disconnectDb(): Promise<void> {
  try {
    await prisma.$disconnect();
    isConnected = false;
    console.log('[DB] Connection closed gracefully');
  } catch (error) {
    console.error('[DB] Error during disconnect:', error);
  }
}

// Register cleanup handlers
if (typeof process !== 'undefined') {
  process.on('beforeExit', disconnectDb);
  process.on('SIGINT', disconnectDb);
  process.on('SIGTERM', disconnectDb);
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
