'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { useAuthStore } from '@/stores/useAuthStore';
import { useToast } from '@/providers/ToastProvider';

const loginSchema = z.object({
  email: z.string().min(1, '이메일을 입력해 주세요.').email('올바른 이메일 형식이 아닙니다.'),
  password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다.'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/login', values);
      if (res.data.success && res.data.data.user) {
        setUser(res.data.data.user);
        toast('로그인에 성공했습니다.', 'success');
        router.push('/dashboard');
      }
    } catch (err) {
      console.error(err);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const axiosError = err as any;
      const errMsg = axiosError.response?.data?.error?.message || '로그인에 실패했습니다. 이메일과 비밀번호를 확인해 주세요.';
      toast(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4">
      {/* Background Radial Glow Gradient */}
      <div className="absolute -left-1/4 -top-1/4 h-[800px] w-[800px] rounded-full bg-primary/10 blur-[150px]"></div>
      <div className="absolute -bottom-1/4 -right-1/4 h-[800px] w-[800px] rounded-full bg-emerald-500/5 blur-[150px]"></div>

      <div className="relative w-full max-w-md rounded-2xl border border-slate-800/80 bg-slate-900/60 p-8 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-slate-700/50">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-emerald-500 shadow-lg shadow-primary/20">
            <span className="text-xl font-bold text-white">N</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100">AI Product Intelligence</h2>
          <p className="mt-2 text-sm text-muted-foreground">네이버 쇼핑 대시보드 로그인</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">이메일 주소</label>
            <input
              type="email"
              disabled={loading}
              className={`mt-1.5 w-full rounded-lg border bg-slate-950/50 px-3.5 py-2.5 text-sm text-slate-100 outline-none transition-all placeholder:text-slate-600 focus:border-primary focus:ring-1 focus:ring-primary ${
                errors.email ? 'border-rose-500/50' : 'border-slate-800'
              }`}
              placeholder="name@company.com"
              {...register('email')}
            />
            {errors.email && <span className="mt-1 block text-xs text-rose-400">{errors.email.message}</span>}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">비밀번호</label>
            </div>
            <input
              type="password"
              disabled={loading}
              className={`mt-1.5 w-full rounded-lg border bg-slate-950/50 px-3.5 py-2.5 text-sm text-slate-100 outline-none transition-all placeholder:text-slate-600 focus:border-primary focus:ring-1 focus:ring-primary ${
                errors.password ? 'border-rose-500/50' : 'border-slate-800'
              }`}
              placeholder="••••••••"
              {...register('password')}
            />
            {errors.password && <span className="mt-1 block text-xs text-rose-400">{errors.password.message}</span>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="relative mt-2 w-full overflow-hidden rounded-lg bg-gradient-to-r from-primary to-primary/80 py-3 text-sm font-semibold text-white shadow-md shadow-primary/25 transition-all duration-300 hover:from-primary/90 hover:to-primary/70 hover:shadow-lg active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                인증 중...
              </span>
            ) : (
              '로그인'
            )}
          </button>
        </form>

        {/* Demo Account Indicator */}
        <div className="mt-6 rounded-lg border border-emerald-950/50 bg-emerald-950/10 p-3 text-center">
          <p className="text-xs text-emerald-400">
            테스트 계정: <span className="font-semibold select-all">admin@naver.com</span> / <span className="font-semibold select-all">password123</span>
          </p>
        </div>
      </div>
    </div>
  );
}
