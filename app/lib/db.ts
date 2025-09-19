import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Enhanced Prisma configuration for production resilience with idle timeout handling
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  errorFormat: 'pretty',
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

// Initialize connection pool warming
let connectionWarmupInterval: NodeJS.Timeout;

// Connection pool warmup to prevent idle timeouts
async function warmupConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('[DB] Connection keepalive successful');
  } catch (error) {
    console.error('[DB] Connection keepalive failed:', error);
    isConnected = false;
  }
}

// Start connection warming (every 4 minutes to prevent 5-minute idle timeout)
if (typeof process !== 'undefined' && process.env.NODE_ENV === 'production') {
  const keepaliveInterval = parseInt(process.env.DB_KEEPALIVE_INTERVAL || '240000');
  connectionWarmupInterval = setInterval(warmupConnection, keepaliveInterval);
  console.log(`[DB] Connection keepalive started (interval: ${keepaliveInterval}ms)`);
}

// Connection health monitoring
let isConnected = false;
let lastConnectionCheck = 0;
const CONNECTION_CHECK_INTERVAL = parseInt(process.env.DB_CONNECTION_CHECK_INTERVAL || '30000'); // 30 seconds

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
  } catch (error: any) {
    isConnected = false;
    
    // Handle specific idle timeout errors
    if (error?.message?.includes('idle-session timeout') || 
        error?.message?.includes('terminating connection') ||
        error?.code === 'P1017' || 
        error?.code === 'P1001') {
      console.warn('[DB] Idle connection timeout detected, reconnecting...');
      
      // Force disconnect and reconnect
      try {
        await prisma.$disconnect();
      } catch (disconnectError) {
        console.warn('[DB] Error during forced disconnect:', disconnectError);
      }
      
      // Attempt immediate reconnection
      try {
        await prisma.$queryRaw`SELECT 1`;
        isConnected = true;
        lastConnectionCheck = now;
        console.log('[DB] Successfully reconnected after timeout');
        return true;
      } catch (reconnectError) {
        console.error('[DB] Failed to reconnect after timeout:', reconnectError);
      }
    }
    
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
    // Clear the connection warmup interval
    if (connectionWarmupInterval) {
      clearInterval(connectionWarmupInterval);
      console.log('[DB] Connection warmup interval cleared');
    }
    
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
