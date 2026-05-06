'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Trophy, Target, BarChart3, LogOut, Home, Swords, BookOpen } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-400 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-400">{t.cargando}</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const navItems = [
    { href: '/dashboard', label: t.inicio, icon: Home },
    { href: '/dashboard/pronosticos', label: t.pronosticos, icon: Target },
    { href: '/dashboard/eliminatoria', label: t.eliminatoria, icon: Swords },
    { href: '/dashboard/posiciones', label: t.posiciones, icon: BarChart3 },
    { href: '/dashboard/premios', label: t.premios, icon: Trophy },
    { href: '/dashboard/reglamento', label: t.reglamento, icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      <header className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy className="w-7 h-7 text-amber-400" />
              <div>
                <h1 className="text-lg font-bold text-white">PRODE 2026</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Language Switch */}
              <button
                onClick={() => setLanguage(language === 'es' ? 'it' : 'es')}
                className="flex items-center gap-1 px-1 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg transition-all"
                title={language === 'es' ? 'Switch to Italian' : 'Cambiar a Español'}
              >
                <span className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  language === 'es' ? 'bg-amber-400 text-slate-900' : 'text-slate-400'
                }`}>
                  🇪🇸🇦🇷 ES
                </span>
                <span className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  language === 'it' ? 'bg-amber-400 text-slate-900' : 'text-slate-400'
                }`}>
                  🇮🇹 IT
                </span>
              </button>

              <span className="text-sm text-slate-400 hidden sm:block">{user.displayName}</span>
              <Link
                href="/auth"
                onClick={async () => {
                  const { signOut } = await import('firebase/auth');
                  const { auth } = await import('@/lib/firebase');
                  await signOut(auth);
                }}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all"
                title="Cerrar sesión"
              >
                <LogOut className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-slate-800/50 border-b border-slate-700">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-2 scrollbar-hide">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                    isActive ? 'bg-amber-400 text-slate-900' : 'text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      <main className="flex-1">{children}</main>

      <footer className="py-4 text-center text-xs text-slate-500 pb-safe">
        Powered by Firebase • Prode Mundial 2026
      </footer>
    </div>
  );
}