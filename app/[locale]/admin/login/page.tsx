'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Logo from '@/components/shared/Logo';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'en';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }
    router.push(`/${locale}/admin`);
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <Logo className="justify-center mb-4" />
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Admin Dashboard</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border p-8 space-y-5"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <div>
            <label htmlFor="email" className="block text-sm font-600 mb-2" style={{ color: 'var(--text-secondary)' }}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border text-sm transition-vl focus:outline-none focus:border-[var(--accent-volt)]"
              style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-600 mb-2" style={{ color: 'var(--text-secondary)' }}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border text-sm transition-vl focus:outline-none focus:border-[var(--accent-volt)]"
              style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            />
          </div>

          {error && (
            <p className="text-sm" style={{ color: '#ef4444' }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-sm font-600 rounded-full transition-vl hover:opacity-90 disabled:opacity-50"
            style={{ background: 'var(--accent-volt)', color: '#0A0A0B' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
