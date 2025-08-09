import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Basic health checks
    const checks = {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
    };

    // Test backend connectivity
    let backendHealth = 'unknown';
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') + '/api/v1/health';
      const response = await fetch(backendUrl, {
        method: 'GET',
        timeout: 5000,
      });
      backendHealth = response.ok ? 'healthy' : 'unhealthy';
    } catch (error) {
      backendHealth = 'unhealthy';
    }

    // Performance metrics
    const responseTime = Date.now() - startTime;
    
    const healthData = {
      status: 'healthy',
      timestamp: checks.timestamp,
      uptime: checks.uptime,
      environment: checks.environment,
      version: checks.version,
      backend: backendHealth,
      responseTime: `${responseTime}ms`,
      checks: {
        frontend: 'healthy',
        backend: backendHealth,
        memory: process.memoryUsage(),
      },
    };

    // Return 503 if any critical service is down
    const statusCode = backendHealth === 'unhealthy' ? 503 : 200;
    
    return NextResponse.json(healthData, { 
      status: statusCode,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });
    
  } catch (error) {
    const errorResponse = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      responseTime: `${Date.now() - startTime}ms`,
    };
    
    return NextResponse.json(errorResponse, { 
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      }
    });
  }
}

export async function HEAD(request: NextRequest) {
  // Quick health check for monitoring systems
  try {
    return new NextResponse(null, { status: 200 });
  } catch (error) {
    return new NextResponse(null, { status: 503 });
  }
}