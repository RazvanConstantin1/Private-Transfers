import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const adminEmail = process.env.ADMIN_EMAIL;
  if (!user || (adminEmail && user.email !== adminEmail)) {
    redirect(`/${locale}/admin/login`);
  }

  return (
    <div className="min-h-screen pt-16 md:pt-20 pb-20 md:pb-16 px-4 md:px-6" style={{ background: 'var(--bg-deep)' }}>
      <div className="max-w-7xl mx-auto">
        <div
          className="flex items-center justify-between mb-6 md:mb-8 pb-4 border-b"
          style={{ borderColor: 'var(--border-soft)' }}
        >
          <div>
            <span
              className="text-xs font-600 uppercase tracking-widest"
              style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-jetbrains)' }}
            >
              VOLTLANE Admin
            </span>
            <p className="text-xs mt-0.5 max-w-[160px] md:max-w-none truncate" style={{ color: 'var(--text-muted)' }}>
              {user.email}
            </p>
          </div>
          <form action={`/${locale}/admin/logout`} method="POST">
            <button
              type="submit"
              className="text-xs px-4 py-2 rounded-full border transition-vl hover:border-red-500 hover:text-red-400 active:scale-[0.97]"
              style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
            >
              Sign out
            </button>
          </form>
        </div>
        {children}
      </div>
    </div>
  );
}
