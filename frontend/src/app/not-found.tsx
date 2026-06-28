'use client';

import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-center">
      <h1 className="text-6xl font-extrabold tracking-widest text-primary">404</h1>
      <div className="absolute rotate-12 rounded bg-emerald-500 px-2 py-0.5 text-xs font-bold text-slate-950">
        Page Not Found
      </div>
      <p className="mt-8 text-sm text-slate-400">
        요청하신 페이지를 찾을 수 없습니다. 경로가 올바른지 확인해 주세요.
      </p>
      <Link
        href="/dashboard"
        className="mt-6 rounded-lg bg-primary px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-primary/25 transition-all hover:bg-primary/90"
      >
        홈 대시보드로 이동
      </Link>
    </div>
  );
}
