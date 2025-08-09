import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'https://api.168.231.88.105.sslip.io/api/v1';

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

async function proxyRequest(
  request: NextRequest,
  method: string,
  { params }: { params: { path: string[] } }
) {
  const path = params.path?.join('/') || '';
  // Always add trailing slash to avoid redirects that lose Authorization header
  const pathWithSlash = path.endsWith('/') ? path : `${path}/`;
  const url = `${BACKEND_URL}/${pathWithSlash}${request.nextUrl.search}`;

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
