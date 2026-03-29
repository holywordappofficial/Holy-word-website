'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, User, AlertCircle, Loader2 } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/admin';
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    
    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.get('userName'),
          password: formData.get('password'),
        }),
      });
      const result = await res.json();

      if (result.success) {
        router.push(from);
        router.refresh();
      } else {
        setError(result.error || 'Authentication failed');
        setLoading(false);
      }
    } catch {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 p-8 rounded-3xl shadow-2xl space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-300 ml-1">Username</label>
        <div className="relative group">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-indigo-400 transition-colors" />
          <input 
            name="userName"
            type="text" 
            required
            placeholder="Enter admin username"
            className="w-full bg-neutral-950 border border-neutral-800 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-neutral-600 outline-none"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-300 ml-1">Password</label>
        <div className="relative group">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-indigo-400 transition-colors" />
          <input 
            name="password"
            type="password" 
            required
            placeholder="••••••••"
            className="w-full bg-neutral-950 border border-neutral-800 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-neutral-600 outline-none"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <button 
        disabled={loading}
        type="submit" 
        className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-neutral-800 disabled:text-neutral-600 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 group"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            Sign In
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </>
        )}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-neutral-950 to-neutral-950">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 mb-6 shadow-2xl shadow-indigo-500/10">
            <Lock className="w-10 h-10 text-indigo-400" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">Admin Portal</h1>
          <p className="text-neutral-400">Please sign in to manage Holy Canvas.</p>
        </div>

        <Suspense fallback={
          <div className="bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 p-8 rounded-3xl shadow-2xl flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          </div>
        }>
          <LoginForm />
        </Suspense>

        <p className="text-center text-neutral-500 text-sm">
          &copy; 2026 Holy Canvas App. All rights reserved.
        </p>
      </div>
    </div>
  );
}
