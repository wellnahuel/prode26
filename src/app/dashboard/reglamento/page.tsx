'use client';

import { BookOpen, Trophy, Target, Award, Users } from 'lucide-react';
import Link from 'next/link';

export default function ReglamentoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-amber-400" />
            <div>
              <h1 className="text-xl font-bold text-white">Reglamento</h1>
              <p className="text-xs text-slate-400">Copa Mundial 2026</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Introducción */}
        <div className="bg-gradient-to-r from-amber-400/10 to-amber-500/5 border border-amber-400/20 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            ¿Cómo funciona el Prode 2026?
          </h2>
          <p className="text-slate-300">
            Participá预测 los resultados del Mundial 2026 y competí con tus amigos. 
            Cuantos más aciertos, más puntos acumulás para llegar a la cima de la tabla.
          </p>
        </div>

        {/* Sistema de puntos */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-amber-400" />
            Sistema de Puntos
          </h3>

          {/* Fase de Grupos */}
          <div className="mb-6">
            <h4 className="text-amber-400 font-medium mb-3">📊 Fase de Grupos (72 partidos)</h4>
            <div className="bg-slate-700/30 rounded-xl p-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-green-400/20 text-green-400 px-3 py-1 rounded-lg font-bold text-lg">5</div>
                  <div>
                    <p className="text-white font-medium">Resultado Exacto</p>
                    <p className="text-xs text-slate-400">Score correcto (ej: 2-1)</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-400/20 text-blue-400 px-3 py-1 rounded-lg font-bold text-lg">2</div>
                  <div>
                    <p className="text-white font-medium">Ganador + Score</p>
                    <p className="text-xs text-slate-400">Acertar ganador, no score</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="bg-slate-700 px-2 py-1 rounded text-slate-300">
                  <span className="text-green-400">✅ Exacto</span>: 5 pts
                </span>
                <span className="bg-slate-700 px-2 py-1 rounded text-slate-300">
                  <span className="text-blue-400">🔵 Winner</span>: 2 pts
                </span>
                <span className="bg-slate-700 px-2 py-1 rounded text-slate-300">
                  <span className="text-red-400">❌ Errado</span>: 0 pts
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-3">
                <span className="text-amber-400 font-medium">Máximo:</span> 360 puntos (todos exactos)
              </p>
            </div>
          </div>

          {/* Fase Eliminatoria */}
          <div className="mb-6">
            <h4 className="text-purple-400 font-medium mb-3">⚔️ Fase Eliminatoria (16 partidos)</h4>
            <div className="bg-slate-700/30 rounded-xl p-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-green-400/20 text-green-400 px-3 py-1 rounded-lg font-bold text-lg">7</div>
                  <div>
                    <p className="text-white font-medium">Resultado Exacto</p>
                    <p className="text-xs text-slate-400">Score correcto del partido</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-400/20 text-blue-400 px-3 py-1 rounded-lg font-bold text-lg">3</div>
                  <div>
                    <p className="text-white font-medium">Ganador</p>
                    <p className="text-xs text-slate-400">Acertar quién avanza</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-400">
                <span className="text-amber-400 font-medium">Fases:</span> 16avos, Octavos, Cuartos, Semifinales, Tercer Puesto, Final
              </p>
              <p className="text-sm text-slate-400 mt-1">
                <span className="text-amber-400 font-medium">Máximo:</span> 112 puntos (todos exactos)
              </p>
            </div>
          </div>

          {/* Premios Individuales */}
          <div>
            <h4 className="text-amber-300 font-medium mb-3">🏆 Premios Individuales (3 premios)</h4>
            <div className="bg-slate-700/30 rounded-xl p-4">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-2xl mb-1">⚽</p>
                  <p className="text-white text-sm font-medium">Goleador</p>
                  <p className="text-green-400 text-xs mt-1">+5 puntos</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl mb-1">🅰️</p>
                  <p className="text-white text-sm font-medium">Asistidor</p>
                  <p className="text-green-400 text-xs mt-1">+5 puntos</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl mb-1">⭐</p>
                  <p className="text-white text-sm font-medium">MVP</p>
                  <p className="text-green-400 text-xs mt-1">+5 puntos</p>
                </div>
              </div>
              <p className="text-sm text-slate-400">
                <span className="text-amber-400 font-medium">Máximo:</span> 15 puntos
              </p>
            </div>
          </div>
        </div>

        {/* Puntaje Total */}
        <div className="bg-gradient-to-r from-green-400/10 to-green-500/5 border border-green-400/30 rounded-2xl p-6">
          <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-green-400" />
            Puntaje Total Máximo
          </h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-slate-700/50 rounded-xl p-4">
              <p className="text-3xl font-bold text-amber-400">360</p>
              <p className="text-xs text-slate-400">Fase Grupos</p>
            </div>
            <div className="bg-slate-700/50 rounded-xl p-4">
              <p className="text-3xl font-bold text-purple-400">112</p>
              <p className="text-xs text-slate-400">Eliminatoria</p>
            </div>
            <div className="bg-slate-700/50 rounded-xl p-4">
              <p className="text-3xl font-bold text-green-400">15</p>
              <p className="text-xs text-slate-400">Premios</p>
            </div>
          </div>
          <div className="mt-4 bg-amber-400/20 rounded-xl p-4 text-center">
            <p className="text-slate-300 text-sm mb-1">Puntaje Total Máximo</p>
            <p className="text-4xl font-bold text-amber-400">487 puntos</p>
          </div>
        </div>

        {/* Reglas Generales */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            Reglas Generales
          </h3>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-amber-400/20 text-amber-400 w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">1</div>
              <div>
                <p className="text-white font-medium">Los pronósticos se pueden modificar</p>
                <p className="text-sm text-slate-400">Hasta que el partido comience. Después queda cerrado.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-amber-400/20 text-amber-400 w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">2</div>
              <div>
                <p className="text-white font-medium">Los empates cuentan como Winner</p>
                <p className="text-sm text-slate-400">Si predijiste 1-1 y el resultado fue 1-1, ganás 2 puntos (en grupos) o 3 puntos (eliminatoria).</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-amber-400/20 text-amber-400 w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">3</div>
              <div>
                <p className="text-white font-medium">Los premios son independientes</p>
                <p className="text-sm text-slate-400">No importa si tu equipo pasa o no, lo que importa es si el jugador gana el premio individual.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-amber-400/20 text-amber-400 w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">4</div>
              <div>
                <p className="text-white font-medium">En caso de empate en puntos</p>
                <p className="text-sm text-slate-400">El desempate favore al que tenga más <span className="text-green-400">resultados exactos</span>. Si persiste el empate, más <span className="text-blue-400">winners</span>.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-amber-400/20 text-amber-400 w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">5</div>
              <div>
                <p className="text-white font-medium">Los resultados se cargan赛后</p>
                <p className="text-sm text-slate-400">Los adminstradores del Prode cargan los resultados reales después de cada partido.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Criterios de Desempate */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            Criterios de Desempate
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="bg-green-400/20 text-green-400 px-2 py-0.5 rounded text-xs font-medium">1°</span>
              <span className="text-slate-300">Mayor cantidad de <span className="text-green-400">resultados exactos</span></span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="bg-blue-400/20 text-blue-400 px-2 py-0.5 rounded text-xs font-medium">2°</span>
              <span className="text-slate-300">Mayor cantidad de <span className="text-blue-400">winners</span></span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="bg-slate-600/50 text-slate-400 px-2 py-0.5 rounded text-xs font-medium">3°</span>
              <span className="text-slate-300">Menor cantidad de <span className="text-red-400">errados</span></span>
            </div>
          </div>
        </div>

        {/* Resumen Visual */}
        <div className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 border border-slate-600/50 rounded-2xl p-6">
          <h3 className="text-white font-bold mb-4">📋 Resumen Rápido</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400 border-b border-slate-700">
                  <th className="text-left py-2">Tipo</th>
                  <th className="text-center py-2">Exacto</th>
                  <th className="text-center py-2">Winner</th>
                  <th className="text-center py-2">Partidos</th>
                  <th className="text-right py-2">Máximo</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                <tr className="border-b border-slate-700/50">
                  <td className="py-2">Fase de Grupos</td>
                  <td className="text-center text-green-400">5 pts</td>
                  <td className="text-center text-blue-400">2 pts</td>
                  <td className="text-center">72</td>
                  <td className="text-right text-amber-400">360 pts</td>
                </tr>
                <tr className="border-b border-slate-700/50">
                  <td className="py-2">Eliminatoria</td>
                  <td className="text-center text-green-400">7 pts</td>
                  <td className="text-center text-blue-400">3 pts</td>
                  <td className="text-center">16</td>
                  <td className="text-right text-amber-400">112 pts</td>
                </tr>
                <tr className="border-b border-slate-700/50">
                  <td className="py-2">Premios</td>
                  <td className="text-center text-green-400">5 pts</td>
                  <td className="text-center">—</td>
                  <td className="text-center">3</td>
                  <td className="text-right text-amber-400">15 pts</td>
                </tr>
                <tr className="bg-amber-400/10">
                  <td className="py-2 font-bold text-white">TOTAL</td>
                  <td colSpan={3}></td>
                  <td className="text-right font-bold text-amber-400">487 pts</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Botón volver */}
        <div className="text-center pb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-all"
          >
            ← Volver al Inicio
          </Link>
        </div>
      </main>
    </div>
  );
}