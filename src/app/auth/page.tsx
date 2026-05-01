'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Trophy, UserPlus, LogIn } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        router.push('/dashboard');
      } else {
        if (!displayName.trim()) {
          setError('El nombre es obligatorio');
          setLoading(false);
          return;
        }
        await register(email, password, displayName.trim());
        router.push('/dashboard');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      if (errorMessage.includes('invalid-credential') || errorMessage.includes('wrong-password') || errorMessage.includes('user-not-found')) {
        setError('Email o contraseña incorrectos');
      } else if (errorMessage.includes('email-already-in-use')) {
        setError('Este email ya está registrado');
      } else if (errorMessage.includes('weak-password')) {
        setError('La contraseña debe tener al menos 6 caracteres');
      } else {
        setError('Error al iniciar sesión. Intentá de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-3 mb-2">
          <Trophy className="w-12 h-12 text-amber-400" />
          <h1 className="text-4xl font-bold text-white">PRODE 2026</h1>
        </div>
        <p className="text-slate-400">FIFA World Cup USA/México/Canadá 2026</p>
      </div>

      <div className="w-full max-w-md bg-slate-800/50 border border-slate-700 rounded-2xl p-8 shadow-2xl">
        <div className="flex gap-2 mb-6 bg-slate-900 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all ${
              isLogin
                ? 'bg-amber-400 text-slate-900 shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LogIn className="w-4 h-4" />
            Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all ${
              !isLogin
                ? 'bg-amber-400 text-slate-900 shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Registrarse
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-slate-300 mb-2">
                Nombre
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Tu nombre"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                required={!isLogin}
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all pr-12"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-amber-400 hover:bg-amber-300 disabled:bg-amber-400/50 disabled:cursor-not-allowed text-slate-900 font-bold rounded-xl transition-all shadow-lg shadow-amber-400/20"
          >
            {loading ? 'Cargando...' : isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </button>
        </form>

        <p className="mt-6 text-center text-slate-500 text-sm">
          {isLogin ? '¿No tenés cuenta? ' : '¿Ya tenés cuenta? '}
          <button
            type="button"
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="text-amber-400 hover:text-amber-300 font-medium"
          >
            {isLogin ? 'Registrate' : 'Iniciá sesión'}
          </button>
        </p>
      </div>

      <p className="mt-8 text-center text-slate-500 text-sm max-w-md">
        Solo para amigos - Datos guardados de forma privada en Firebase
      </p>
    </div>
  );
}