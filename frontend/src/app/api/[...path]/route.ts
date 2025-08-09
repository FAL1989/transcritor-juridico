import { NextRequest, NextResponse } from 'next/server';

// Backend base URL resolution (runtime on serverless)
// Priority: BACKEND_URL > NEXT_PUBLIC_API_URL > localhost default
const DEFAULT_BACKEND_URL = 'http://localhost:8000/api/v1';
const configuredBackend = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL;
const BACKEND_URL = (configuredBackend ?? DEFAULT_BACKEND_URL).replace(/\/$/, '');

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

function sanitizeHeadersForBody(headers: Headers, body: string | FormData | null): Headers {
  const result = new Headers(headers);
  // Ensure upstream calculates correct lengths/boundaries
  result.delete('content-length');
  if (body instanceof FormData) {
    // Let fetch set the proper multipart boundary
    result.delete('content-type');
  }
  // Hop-by-hop headers should not be forwarded
  result.delete('connection');
  result.delete('keep-alive');
  result.delete('transfer-encoding');
  result.delete('upgrade');
  return result;
}

async function proxyRequest(
  request: NextRequest,
  method: string,
  { params }: { params: { path: string[] } }
) {
  const path = params.path?.join('/') || '';
  const url = `${BACKEND_URL}/${path}${request.nextUrl.search}`;
  
  const headers = new Headers(request.headers);
  headers.delete('host');
  
  // Handle body for methods that support it
  let body: string | FormData | null = null;
  if (['POST', 'PUT', 'PATCH'].includes(method)) {
    body = await handleRequestBody(request);
  }
  
  const response = await fetch(url, {
    method,
    headers: sanitizeHeadersForBody(headers, body),
    body,
  });
  
  const responseBody = await response.text();
  
  return new NextResponse(responseBody, {
    status: response.status,
    headers: response.headers,
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, 'GET', { params });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, 'POST', { params });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, 'PUT', { params });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, 'DELETE', { params });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, 'PATCH', { params });
}