import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // 1. Call Backend Login API
    const loginRes = await axios.post(`${BACKEND_URL}/api/v1/auth/login`, {
      email,
      password,
    });

    const { accessToken, refreshToken } = loginRes.data.data;

    // 2. Set HttpOnly cookies
    const cookieStore = cookies();
    
    cookieStore.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60, // 15 minutes
    });

    cookieStore.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    // 3. Fetch user info using the access token
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
    console.error('Error in Next.js API Auth Login:', axiosError.response?.data || axiosError.message);
    const status = axiosError.response?.status || 500;
    const message = axiosError.response?.data?.error?.message || 'Login failed';
    return NextResponse.json(
      { success: false, error: { message } },
      { status }
    );
  }
}
