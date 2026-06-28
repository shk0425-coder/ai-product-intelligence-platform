import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function POST() {
  try {
    const cookieStore = cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, error: { message: 'No refresh token' } },
        { status: 401 }
      );
    }

    // Call Backend Refresh API
    const refreshRes = await axios.post(`${BACKEND_URL}/api/v1/auth/refresh`, {
      refreshToken,
    });

    const { accessToken } = refreshRes.data.data;

    // Set new accessToken cookie
    cookieStore.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60, // 15 minutes
    });

    return NextResponse.json({
      success: true,
      message: 'Token refreshed successfully',
    });
  } catch (error: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const axiosError = error as any;
    console.error('Error in Next.js API Auth Refresh:', axiosError.response?.data || axiosError.message);
    const status = axiosError.response?.status || 401;
    const message = axiosError.response?.data?.error?.message || 'Token refresh failed';
    return NextResponse.json(
      { success: false, error: { message } },
      { status }
    );
  }
}
