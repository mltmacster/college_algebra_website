
import { NextResponse } from 'next/server';
import { checkHealth } from '../../../lib/health-check';

export async function GET() {
  try {
    const healthStatus = await checkHealth();
    
    const statusCode = healthStatus.status === 'healthy' ? 200 : 503;
    
    return NextResponse.json(healthStatus, { 
      status: statusCode,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Health check failed',
      services: {
        database: { status: 'unhealthy', error: 'Unable to perform health check' },
        environment: { status: 'unhealthy', error: 'Unable to perform health check' },
        dependencies: { status: 'unhealthy', error: 'Unable to perform health check' }
      }
    }, { status: 500 });
  }
}
