import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'https://api.168.231.88.105.sslip.io/api/v1';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path?.join('/') || '';
  const url = `${BACKEND_URL}/${path}${request.nextUrl.search}`;
  
  const headers = new Headers(request.headers);
  headers.delete('host');
  
  const response = await fetch(url, {
    method: 'GET',
    headers: headers,
  });
  
  const body = await response.text();
  
  return new NextResponse(body, {
    status: response.status,
    headers: response.headers,
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path?.join('/') || '';
  const url = `${BACKEND_URL}/${path}${request.nextUrl.search}`;
  
  const headers = new Headers(request.headers);
  headers.delete('host');
  
  const response = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: request.body,
  });
  
  const body = await response.text();
  
  return new NextResponse(body, {
    status: response.status,
    headers: response.headers,
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path?.join('/') || '';
  const url = `${BACKEND_URL}/${path}${request.nextUrl.search}`;
  
  const headers = new Headers(request.headers);
  headers.delete('host');
  
  const response = await fetch(url, {
    method: 'PUT',
    headers: headers,
    body: request.body,
  });
  
  const body = await response.text();
  
  return new NextResponse(body, {
    status: response.status,
    headers: response.headers,
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path?.join('/') || '';
  const url = `${BACKEND_URL}/${path}${request.nextUrl.search}`;
  
  const headers = new Headers(request.headers);
  headers.delete('host');
  
  const response = await fetch(url, {
    method: 'DELETE',
    headers: headers,
  });
  
  const body = await response.text();
  
  return new NextResponse(body, {
    status: response.status,
    headers: response.headers,
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path?.join('/') || '';
  const url = `${BACKEND_URL}/${path}${request.nextUrl.search}`;
  
  const headers = new Headers(request.headers);
  headers.delete('host');
  
  const response = await fetch(url, {
    method: 'PATCH',
    headers: headers,
    body: request.body,
  });
  
  const body = await response.text();
  
  return new NextResponse(body, {
    status: response.status,
    headers: response.headers,
  });
}