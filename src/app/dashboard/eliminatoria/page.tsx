'use client';

import { Trophy, Lock, Calendar } from 'lucide-react';
import Link from 'next/link';

const FASES_ELIMINATORIAS = [
  { nombre: 'Dieciseisavos', icono: '16', color: 'text-blue-400' },
  { nombre: 'Octavos', icono: '8', color: 'text-purple-400' },
  { nombre: 'Cuartos', icono: '4', color: 'text-amber-400' },
  { nombre: 'Semifinales', icono: '2', color: 'text-amber-300' },
  { nombre: 'Tercer Puesto', icono: '3°', color: 'text-slate-400' },
  { nombre: 'Final', icono: '1', color: 'text-amber-400' },
];

export default function EliminatoriaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-amber-400" />
            <div>
              <h1 className="text-xl font-bold text-white">Fase Eliminatoria</h1>
              <p className="text-xs text-slate-400">Copa Mundial 2026</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Mensaje principal */}
        <div className="bg-gradient-to-r from-amber-400/10 to-amber-500/5 border border-amber-400/20 rounded-2xl p-6 mb-6">
          <div className="text-center mb-4">
            <div className="text-5xl mb-3">🏆</div>
            <h2 className="text-xl font-bold text-white mb-2">
              ¡Pronósticos de Fase Eliminatoria!
            </h2>
            <p className="text-slate-300">
              Al final de la fase de grupos se cargarán los 16 equipos clasificados y podrás hacer tus predicciones.
            </p>
          </div>

          <div className="bg-amber-400/10 rounded-xl p-4 mt-4">
            <p className="text-amber-400 font-medium text-center">
              🎯 ¡Suerte con tus pronósticos!
            </p>
          </div>
        </div>

        {/* Preview de las fases */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-400" />
            Fases del Knockout
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {FASES_ELIMINATORIAS.map((fase) => (
              <div
                key={fase.nombre}
                className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-4 text-center"
              >
                <div className={`text-3xl font-bold mb-2 ${fase.color}`}>
                  {fase.icono}
                </div>
                <p className="text-sm text-slate-300">{fase.nombre}</p>
                <div className="mt-2 flex items-center justify-center gap-1 text-slate-500">
                  <Lock className="w-3 h-3" />
                  <span className="text-xs">Cerrado</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info adicional */}
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="bg-blue-400/20 rounded-full p-2 shrink-0">
              <span className="text-xl">ℹ️</span>
            </div>
            <div>
              <h4 className="text-white font-medium mb-1">¿Cómo funcionan los puntos?</h4>
              <p className="text-sm text-slate-400">
                En eliminatorias, un resultado <span className="text-green-400">exacto (7 pts)</span> significa acertar el score final. 
                Un <span className="text-blue-400">winner (3 pts)</span> significa acertar quién avanza, sin importar el score.
              </p>
            </div>
          </div>
        </div>

        {/* Estados de ejemplo (visual de cómo se verá) */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-slate-700 bg-slate-800">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              Vista Previa - Ejemplo
            </h3>
          </div>

          <div className="p-4 space-y-3">
            {/* Ejemplo de partido cerrado */}
            <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-4 opacity-50">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate-400">Dieciseisavos • Partido 49</span>
                <div className="flex items-center gap-1 text-red-400 text-sm">
                  <Lock className="w-4 h-4" />
                  Cerrado
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-center flex-1">
                  <div className="text-2xl mb-1">🇦🇷</div>
                  <div className="text-sm text-white">Argentina</div>
                </div>
                <div className="px-4 text-slate-500 text-xl font-bold">vs</div>
                <div className="text-center flex-1">
                  <div className="text-2xl mb-1">🇧🇷</div>
                  <div className="text-sm text-white">Brasil</div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-center gap-2 text-sm text-slate-400">
                <span className="text-green-400">Tu predicción: 2-1</span>
                <span>|</span>
                <span className="text-amber-400">Resultado: 2-1</span>
                <span className="bg-green-400/20 text-green-400 px-2 py-0.5 rounded text-xs">+7 pts</span>
              </div>
            </div>

            {/* Ejemplo de partido abierto */}
            <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate-400">Cuartos • Partido 57</span>
                <div className="flex items-center gap-1 text-amber-400 text-sm">
                  <Calendar className="w-4 h-4" />
                  Pronto
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-center flex-1">
                  <div className="text-2xl mb-1">❓</div>
                  <div className="text-sm text-slate-400">Por definir</div>
                </div>
                <div className="px-4 text-slate-500 text-xl font-bold">vs</div>
                <div className="text-center flex-1">
                  <div className="text-2xl mb-1">❓</div>
                  <div className="text-sm text-slate-400">Por definir</div>
                </div>
              </div>
              <div className="mt-3 text-center">
                <p className="text-xs text-slate-500">Los equipos se definirán al terminar la fase de grupos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Botón volver a pronósticos */}
        <div className="mt-6 text-center">
          <Link
            href="/dashboard/pronosticos"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-all"
          >
            ← Ver Pronósticos de Fase de Grupos
          </Link>
        </div>
      </main>
    </div>
  );
}