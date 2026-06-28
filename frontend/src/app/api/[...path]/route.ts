import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

async function handleProxy(request: Request, { params }: { params: { path: string[] } }) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  const pathStr = params.path.join('/');
  
  // We forward x-workspace-id if present in incoming headers
  const workspaceId = request.headers.get('x-workspace-id');

  const headers: Record<string, string> = {};
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }
  if (workspaceId) {
    headers['x-workspace-id'] = workspaceId;
  }

  // Parse body if it exists and request method supports it
  let body: unknown = null;
  if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
    try {
      body = await request.json();
    } catch {
      body = null;
    }
  }

  const queryParams = new URL(request.url).search;
  const targetUrl = `${BACKEND_URL}/api/${pathStr}${queryParams}`;

  try {
    const response = await axios({
      method: request.method,
      url: targetUrl,
      data: body,
      headers,
    });

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const axiosError = error as any;

    // If backend returns 401, try to refresh token once and retry the request
    if (axiosError.response?.status === 401 && refreshToken) {
      try {
        const refreshRes = await axios.post(`${BACKEND_URL}/api/v1/auth/refresh`, {
          refreshToken,
        });
        const newAccessToken = refreshRes.data.data.accessToken;
        
        cookieStore.set('accessToken', newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 15 * 60,
        });

        // Retry target request with the new access token
        headers['Authorization'] = `Bearer ${newAccessToken}`;
        const retryResponse = await axios({
          method: request.method,
          url: targetUrl,
          data: body,
          headers,
        });

        return NextResponse.json(retryResponse.data);
      } catch {
        cookieStore.delete('accessToken');
        cookieStore.delete('refreshToken');
      }
    }

    const status = axiosError.response?.status || 500;
    const errorData = axiosError.response?.data || {
      success: false,
      error: { code: 'PROXY_ERROR', message: axiosError.message || 'Proxy request failed' },
    };

    return NextResponse.json(errorData, { status });
  }
}

export async function GET(request: Request, context: { params: { path: string[] } }) {
  return handleProxy(request, context);
}

export async function POST(request: Request, context: { params: { path: string[] } }) {
  return handleProxy(request, context);
}

export async function PUT(request: Request, context: { params: { path: string[] } }) {
  return handleProxy(request, context);
}

export async function DELETE(request: Request, context: { params: { path: string[] } }) {
  return handleProxy(request, context);
}
