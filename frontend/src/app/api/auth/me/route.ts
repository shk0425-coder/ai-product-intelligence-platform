import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function GET() {
  const cookieStore = cookies();
  let accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  if (!accessToken && !refreshToken) {
    return NextResponse.json(
      { success: false, error: { message: 'Not authenticated' } },
      { status: 401 }
    );
  }

  // 1. Try to Refresh Token if accessToken is missing but refreshToken is present
  if (!accessToken && refreshToken) {
    try {
      const refreshRes = await axios.post(`${BACKEND_URL}/api/v1/auth/refresh`, {
        refreshToken,
      });
      accessToken = refreshRes.data.data.accessToken;
      cookieStore.set('accessToken', accessToken!, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 15 * 60,
      });
    } catch {
      cookieStore.delete('accessToken');
      cookieStore.delete('refreshToken');
      return NextResponse.json(
        { success: false, error: { message: 'Session expired' } },
        { status: 401 }
      );
    }
  }

  // 2. Call backend protected route to verify session and retrieve user
  try {
    const userRes = await axios.get(`${BACKEND_URL}/api/v1/protected`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const user = userRes.data.data.user;

    return NextResponse.json({
      success: true,
      data: { user },
    });
  } catch (error: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const axiosError = error as any;

    // If access token is expired, try to refresh once dynamically
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

        // Retry the request to backend
        const retryUserRes = await axios.get(`${BACKEND_URL}/api/v1/protected`, {
          headers: {
            Authorization: `Bearer ${newAccessToken}`,
          },
        });
        const user = retryUserRes.data.data.user;
        return NextResponse.json({
          success: true,
          data: { user },
        });
      } catch {
        cookieStore.delete('accessToken');
        cookieStore.delete('refreshToken');
      }
    }

    return NextResponse.json(
      { success: false, error: { message: 'Authentication failed' } },
      { status: 401 }
    );
  }
}
