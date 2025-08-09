import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'https://api.168.231.88.105.sslip.io/api/v1';

/**
 * Proxy handler for FastAPI backend requests
 * 
 * This proxy intelligently handles trailing slashes based on FastAPI endpoint patterns:
 * - Auth endpoints (login, register, me) use NO trailing slash
 * - Collection endpoints (transcriptions) use trailing slash
 * - Specific resource endpoints (transcriptions/123) use NO trailing slash
 * 
 * This fixes the 400 Bad Request errors caused by adding trailing slashes to all endpoints.
 */

async function handleRequestBody(request: NextRequest): Promise<string | FormData | null> {
  const contentType = request.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    return await request.text();
  } else if (contentType.includes('application/x-www-form-urlencoded')) {
    // Critical fix: Read the form data properly for OAuth2PasswordRequestForm
    return await request.text();
  } else if (contentType.includes('multipart/form-data')) {
    // For file uploads, pass formData
    return await request.formData();
  } else if (request.body) {
    // Fallback: read as text
    return await request.text();
  }

  return null;
}

// Define endpoints that require trailing slash (collection endpoints)
const ENDPOINTS_WITH_SLASH = new Set([
  'transcriptions'
]);

// Define endpoints that must NOT have trailing slash
const ENDPOINTS_WITHOUT_SLASH = new Set([
  'auth/login',
  'auth/register', 
  'auth/refresh',
  'auth/me',
  'transcriptions/upload',
  'texts/normalize',
  'texts/extract',
  'texts/compare',
  'texts/export/docx'
]);

function shouldHaveTrailingSlash(path: string): boolean {
  // Check exact matches first
  if (ENDPOINTS_WITHOUT_SLASH.has(path)) {
    return false;
  }
  if (ENDPOINTS_WITH_SLASH.has(path)) {
    return true;
  }
  
  // Check patterns: if path ends with ID (number), no slash
  // Example: transcriptions/123 -> no slash
  if (/\/\d+$/.test(path)) {
    return false;
  }
  
  // Collection endpoints (base paths) get slash
  const basePath = path.split('/')[0];
  if (ENDPOINTS_WITH_SLASH.has(basePath)) {
    return true;
  }
  
  // Default: no trailing slash (FastAPI default behavior)
  return false;
}

async function proxyRequest(
  request: NextRequest,
  method: string,
  { params }: { params: { path: string[] } }
) {
  const path = params.path?.join('/') || '';
  
  // Intelligently decide trailing slash based on FastAPI endpoint patterns
  const finalPath = shouldHaveTrailingSlash(path) 
    ? (path.endsWith('/') ? path : `${path}/`)
    : (path.endsWith('/') ? path.slice(0, -1) : path);
    
  const url = `${BACKEND_URL}/${finalPath}${request.nextUrl.search}`;

  const headers = new Headers(request.headers);
  headers.delete('host');

  // Handle body for methods that support it
  let body: string | FormData | null = null;
  if (['POST', 'PUT', 'PATCH'].includes(method)) {
    body = await handleRequestBody(request);
  }

  const response = await fetch(url, {
    method,
    headers,
    body,
  });

  const responseBody = await response.text();

  return new NextResponse(responseBody, {
    status: response.status,
    headers: response.headers,
  });
}

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  return proxyRequest(request, 'GET', { params });
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  return proxyRequest(request, 'POST', { params });
}

export async function PUT(request: NextRequest, { params }: { params: { path: string[] } }) {
  return proxyRequest(request, 'PUT', { params });
}

export async function DELETE(request: NextRequest, { params }: { params: { path: string[] } }) {
  return proxyRequest(request, 'DELETE', { params });
}

export async function PATCH(request: NextRequest, { params }: { params: { path: string[] } }) {
  return proxyRequest(request, 'PATCH', { params });
}
