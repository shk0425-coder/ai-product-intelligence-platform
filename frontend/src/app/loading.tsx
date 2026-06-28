'use client';

import React from 'react';

export default function Loading() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-slate-950 text-slate-200">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="text-sm font-medium tracking-wide">페이지를 구성 중입니다...</p>
      </div>
    </div>
  );
}
