
// Health Check Utility for Production Readiness
// Part of Upstream Connection Issue Resolution

import { prisma } from './db';

export interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  services: {
    database: ServiceHealth;
    environment: ServiceHealth;
    dependencies: ServiceHealth;
  };
  errors?: string[];
}

interface ServiceHealth {
  status: 'healthy' | 'unhealthy';
  responseTime?: number;
  error?: string;
}

export async function checkHealth(): Promise<HealthStatus> {
  const timestamp = new Date().toISOString();
  const errors: string[] = [];

  // Database Health Check
  const database = await checkDatabaseHealth();
  if (database.status === 'unhealthy' && database.error) {
    errors.push(`Database: ${database.error}`);
  }

  // Environment Health Check  
  const environment = await checkEnvironmentHealth();
  if (environment.status === 'unhealthy' && environment.error) {
    errors.push(`Environment: ${environment.error}`);
  }

  // Dependencies Health Check
  const dependencies = await checkDependenciesHealth();
  if (dependencies.status === 'unhealthy' && dependencies.error) {
    errors.push(`Dependencies: ${dependencies.error}`);
  }

  const overallStatus = 
    database.status === 'healthy' && 
    environment.status === 'healthy' && 
    dependencies.status === 'healthy' 
      ? 'healthy' 
      : 'unhealthy';

  return {
    status: overallStatus,
    timestamp,
    services: {
      database,
      environment,
      dependencies
    },
    ...(errors.length > 0 && { errors })
  };
}

async function checkDatabaseHealth(): Promise<ServiceHealth> {
  const startTime = Date.now();
  
  try {
    await prisma.$queryRaw`SELECT 1`;
    const responseTime = Date.now() - startTime;
    
    return { 
      status: 'healthy', 
      responseTime 
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    return { 
      status: 'unhealthy', 
      responseTime,
      error: error instanceof Error ? error.message : 'Unknown database error'
    };
  }
}

async function checkEnvironmentHealth(): Promise<ServiceHealth> {
  const startTime = Date.now();
  
  try {
    const requiredEnvVars = [
      'DATABASE_URL',
      'NEXTAUTH_SECRET',
      'NEXTAUTH_URL'
    ];
    
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      return {
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        error: `Missing environment variables: ${missingVars.join(', ')}`
      };
    }

    // Check for port configuration mismatch
    const nextAuthUrl = process.env.NEXTAUTH_URL;
    const currentPort = process.env.PORT || '3000';
    
    if (nextAuthUrl && currentPort !== '3000') {
      // Only flag mismatch if we're running on a different port than expected
      const expectedPort = nextAuthUrl.match(/:(\d+)/)?.[1] || '3000';
      if (expectedPort !== currentPort) {
        return {
          status: 'unhealthy',
          responseTime: Date.now() - startTime,
          error: `Port mismatch: NEXTAUTH_URL port (${expectedPort}) differs from current PORT (${currentPort})`
        };
      }
    }

    return { 
      status: 'healthy',
      responseTime: Date.now() - startTime 
    };
  } catch (error) {
    return { 
      status: 'unhealthy',
      responseTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown environment error'
    };
  }
}

async function checkDependenciesHealth(): Promise<ServiceHealth> {
  const startTime = Date.now();
  
  try {
    // Check if we can make a basic fetch (tests network connectivity)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    try {
      const response = await fetch('https://www.google.com/generate_204', {
        method: 'GET',
        signal: controller.signal,
        cache: 'no-cache'
      });
      clearTimeout(timeoutId);
      
      if (response.status === 204) {
        return { 
          status: 'healthy',
          responseTime: Date.now() - startTime 
        };
      }
    } catch (fetchError) {
      clearTimeout(timeoutId);
      return {
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        error: 'Network connectivity test failed'
      };
    }
    
    return { 
      status: 'healthy',
      responseTime: Date.now() - startTime 
    };
  } catch (error) {
    return { 
      status: 'unhealthy',
      responseTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown dependencies error'
    };
  }
}

// Enhanced fetch utility with retry logic and timeout
export async function fetchWithRetry(
  url: string, 
  options: RequestInit = {}, 
  retries: number = 3,
  timeoutMs: number = 10000
): Promise<Response> {
  let lastError: Error = new Error('Fetch operation failed');
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        return response;
      }
      
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    } catch (error) {
      clearTimeout(timeoutId);
      lastError = error instanceof Error ? error : new Error('Unknown fetch error');
      
      if (attempt < retries) {
        // Exponential backoff: wait longer between retries
        const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}
