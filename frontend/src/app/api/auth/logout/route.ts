import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function POST() {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    // 1. Call Backend Logout (stateless, but call anyway)
    if (accessToken) {
      try {
        await axios.post(
          `${BACKEND_URL}/api/v1/auth/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      } catch (err) {
        console.warn('Backend logout call failed or expired:', err);
      }
    }

    // 2. Clear cookies
    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const axiosError = error as any;
    return NextResponse.json(
      { success: false, error: { message: axiosError.message || 'Logout failed' } },
      { status: 500 }
    );
  }
}
