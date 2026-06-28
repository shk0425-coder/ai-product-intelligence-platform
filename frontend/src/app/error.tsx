'use client';

import React, { useEffect } from 'react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App Router runtime error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-rose-500">오류가 발생했습니다</h1>
      <p className="mt-4 text-sm text-slate-400 max-w-md">
        애플리케이션 실행 도중 예기치 않은 에러가 일어났습니다. 다시 시도해 주세요.
      </p>
      <div className="mt-6 flex gap-4">
        <button
          onClick={() => reset()}
          className="rounded-lg bg-primary px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-primary/25 transition-all hover:bg-primary/90"
        >
          다시 로드
        </button>
      </div>
    </div>
  );
}
