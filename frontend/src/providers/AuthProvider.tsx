'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuthStore } from '@/stores/useAuthStore';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const setUser = useAuthStore((state) => state.setUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      // If we are on the login page, we don't block
      const isLoginPage = pathname === '/login';

      try {
        const res = await axios.get('/api/auth/me');
        if (res.data.success && res.data.data.user) {
          setUser(res.data.data.user);
          // If logged in and on /login page, redirect to dashboard
          if (isLoginPage) {
            router.push('/dashboard');
          }
        }
      } catch {
        setUser(null);
        // If not logged in and not on login page, redirect to login
        if (!isLoginPage) {
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, [pathname, setUser, router]);

  if (loading && pathname !== '/login') {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-950 text-slate-200">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
          <p className="text-sm font-medium tracking-wide">세션을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
