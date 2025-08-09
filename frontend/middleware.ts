import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Interceptar requisições para /api/*
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Construir a URL do backend
    const backendUrl = new URL(request.nextUrl.pathname.replace('/api/', '/api/v1/'), 'https://api.168.231.88.105.sslip.io');
    
    // Copiar query params
    backendUrl.search = request.nextUrl.search;
    
    // Fazer o proxy preservando headers
    const headers = new Headers(request.headers);
    headers.set('x-forwarded-proto', 'https');
    headers.set('x-forwarded-host', request.headers.get('host') || '');
    
    // Retornar um rewrite (proxy interno)
    return NextResponse.rewrite(backendUrl, {
      request: {
        headers: headers,
      },
    });
  }
}

export const config = {
  matcher: '/api/:path*',
};