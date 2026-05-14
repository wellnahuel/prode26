'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Trophy, Target, BarChart3, LogOut, Home, Swords, BookOpen, Menu, X } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

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
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-slate-800/95 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-400" />
            <span className="text-lg font-bold text-white">PRODE 2026</span>
          </div>

          {/* Desktop controls - 640px+ */}
          <div className="hidden sm:flex items-center gap-4">
            <button
              onClick={() => setLanguage(language === 'es' ? 'it' : 'es')}
              className="flex items-center gap-1 px-1 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg transition-all"
            >
              <span className={`px-3 py-1 rounded-md text-sm font-medium ${
                language === 'es' ? 'bg-amber-400 text-slate-900' : 'text-slate-400'
              }`}>ES</span>
              <span className={`px-3 py-1 rounded-md text-sm font-medium ${
                language === 'it' ? 'bg-amber-400 text-slate-900' : 'text-slate-400'
              }`}>IT</span>
            </button>
            <span className="text-sm text-slate-400 max-w-[140px] truncate">{user.displayName}</span>
            <button
              onClick={async () => {
                const { signOut } = await import('firebase/auth');
                const { auth } = await import('@/lib/firebase');
                await signOut(auth);
              }}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all"
              title="Cerrar sesión"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile hamburger - below 640px */}
          {!menuOpen && (
            <button
              onClick={() => setMenuOpen(true)}
              className="sm:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all"
              aria-label="Abrir menú"
            >
              <Menu className="w-6 h-6" />
            </button>
          )}
        </div>
      </header>

      {/* Mobile menu overlay - below 640px */}
      {menuOpen && (
        <div className="sm:hidden fixed inset-0 top-14 bg-slate-900 backdrop-blur-md z-40 flex flex-col">
          {/* Menu header with close button */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
            <span className="text-white font-bold">Menú</span>
            <button
              onClick={() => setMenuOpen(false)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all"
              aria-label="Cerrar menú"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Menu content */}
          <div className="flex-1 overflow-y-auto p-4 pb-24">
            {/* Language */}
            <div className="mb-4">
              <p className="text-xs text-slate-500 uppercase mb-2">Idioma</p>
              <div className="flex gap-2">
                <button
                  onClick={() => { setLanguage('es'); setMenuOpen(false); }}
                  className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${
                    language === 'es' ? 'bg-amber-400 text-slate-900' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  ES
                </button>
                <button
                  onClick={() => { setLanguage('it'); setMenuOpen(false); }}
                  className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${
                    language === 'it' ? 'bg-amber-400 text-slate-900' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  IT
                </button>
              </div>
            </div>

            {/* User */}
            <div className="mb-4 py-3 border-y border-slate-700">
              <p className="text-xs text-slate-500 uppercase mb-2">Usuario</p>
              <p className="text-white font-bold">{user.displayName}</p>
            </div>

            {/* Nav */}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                      isActive ? 'bg-amber-400 text-slate-900' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Logout */}
            <button
              onClick={async () => {
                const { signOut } = await import('firebase/auth');
                const { auth } = await import('@/lib/firebase');
                await signOut(auth);
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-slate-800 transition-all w-full mt-4"
            >
              <LogOut className="w-5 h-5" />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      )}

      {/* Desktop nav - 640px+ */}
      <nav className="bg-slate-800/50 border-b border-slate-700 hidden sm:block">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-2">
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
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-14 sm:pt-0 pb-24 sm:pb-4">{children}</main>

      {/* Bottom tab bar - below 640px */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-800/95 backdrop-blur-sm border-t border-slate-700 sm:hidden z-40">
        <div className="flex justify-around items-center py-2 px-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg min-w-[50px] min-h-[44px] justify-center transition-all ${
                  isActive ? 'text-amber-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[9px] font-medium leading-tight">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <footer className="py-4 text-center text-xs text-slate-500 pb-16 sm:pb-4">
        Powered by Firebase • Prode Mundial 2026
      </footer>
    </div>
  );
}