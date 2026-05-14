'use client';

import { useLanguage } from '@/context/LanguageContext';
import { BookOpen, Trophy, Target, Award, Users } from 'lucide-react';
import Link from 'next/link';

export default function ReglamentoPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <header className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-amber-400" />
            <div>
              <h1 className="text-xl font-bold text-white">{t.reglamento}</h1>
              <p className="text-xs text-slate-400">{t.copaMundial2026}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <div className="bg-gradient-to-r from-amber-400/10 to-amber-500/5 border border-amber-400/20 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            {t.comoFuncionaElProde2026}
          </h2>
          <p className="text-slate-300">
            {t.participaLosResultadosDelMundial}
          </p>
        </div>

        {/* Sobre la inscripción */}
        <div className="bg-gradient-to-r from-green-400/10 to-green-500/5 border border-green-400/30 rounded-2xl p-6">
          <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
            💰 {t.sobreElPozo}
          </h3>
          <p className="text-slate-300 text-sm mb-4">
            {t.sobreElPozoDesc}
          </p>

          <div className="bg-slate-700/30 rounded-xl p-4 mb-4">
            <h4 className="text-amber-400 font-medium mb-2">{t.comoFuncionaInscripcion}</h4>
            <p className="text-slate-300 text-sm mb-3">
              {t.inscripcion25Euros}
            </p>
            <div className="flex flex-col sm:flex-row gap-2 text-sm">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="text-green-400">🏦</span>
                {t.inscripcionTransferencia}
              </div>
              <span className="hidden sm:inline text-slate-500">|</span>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="text-blue-400">💵</span>
                {t.inscripcionContado}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-amber-400/10 border border-amber-400/30 rounded-xl p-3 text-center">
              <p className="text-2xl mb-1">🥇</p>
              <p className="text-amber-400 text-sm font-bold">{t.premio1Desc}</p>
            </div>
            <div className="bg-slate-600/50 border border-slate-500/50 rounded-xl p-3 text-center">
              <p className="text-2xl mb-1">🥈</p>
              <p className="text-slate-300 text-sm font-bold">{t.premio2Desc}</p>
            </div>
            <div className="bg-orange-400/10 border border-orange-400/30 rounded-xl p-3 text-center">
              <p className="text-2xl mb-1">🥉</p>
              <p className="text-orange-400 text-sm font-bold">{t.premio3Desc}</p>
            </div>
          </div>

          <p className="text-slate-400 text-xs mt-4 text-center">
            {t.cuandoSeCierraInscripcion}
          </p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-amber-400" />
            {t.sistemaDePuntos_2}
          </h3>

          <div className="mb-6">
            <h4 className="text-amber-400 font-medium mb-3">{t.faseDeGrupos72Partidos}</h4>
            <div className="bg-slate-700/30 rounded-xl p-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-green-400/20 text-green-400 px-3 py-1 rounded-lg font-bold text-lg">5</div>
                  <div>
                    <p className="text-white font-medium">{t.resultadoExacto}</p>
                    <p className="text-xs text-slate-400">{t.scoreCorrectoEj}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-400/20 text-blue-400 px-3 py-1 rounded-lg font-bold text-lg">2</div>
                  <div>
                    <p className="text-white font-medium">{t.ganadorScore}</p>
                    <p className="text-xs text-slate-400">{t.acertarGanadorNoScore_2}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="bg-slate-700 px-2 py-1 rounded text-slate-300">
                  <span className="text-green-400">✅ {t.exacto}</span>: 5 pts
                </span>
                <span className="bg-slate-700 px-2 py-1 rounded text-slate-300">
                  <span className="text-blue-400">🔵 {t.winner}</span>: 2 pts
                </span>
                <span className="bg-slate-700 px-2 py-1 rounded text-slate-300">
                  <span className="text-red-400">❌ {t.errado}</span>: 0 pts
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-3">
                <span className="text-amber-400 font-medium">{t.maximo}:</span> 360 pts ({t.todosExactos})
              </p>
              <div className="bg-slate-600/30 rounded-lg p-3 mt-3">
                <p className="text-xs text-slate-300 font-medium mb-1">📌 {t.casoDeEmpate}</p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-green-400">✅ {t.exacto} (1-1)</span>
                    <br /><span className="text-slate-400">→ 5 pts</span>
                  </div>
                  <div>
                    <span className="text-blue-400">🔵 {t.winner} (0-0, 2-2)</span>
                    <br /><span className="text-slate-400">→ 2 pts</span>
                  </div>
                  <div>
                    <span className="text-red-400">❌ {t.errado}</span>
                    <br /><span className="text-slate-400">→ 0 pts</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-purple-400 font-medium mb-3">{t.faseEliminatoria16Partidos}</h4>
            <div className="bg-slate-700/30 rounded-xl p-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-green-400/20 text-green-400 px-3 py-1 rounded-lg font-bold text-lg">7</div>
                  <div>
                    <p className="text-white font-medium">{t.resultadoExacto}</p>
                    <p className="text-xs text-slate-400">{t.scoreCorrectoDelPartido}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-400/20 text-blue-400 px-3 py-1 rounded-lg font-bold text-lg">3</div>
                  <div>
                    <p className="text-white font-medium">{t.winner}</p>
                    <p className="text-xs text-slate-400">{t.acertarQuienAvanza}</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-400">
                <span className="text-amber-400 font-medium">{t.fases}:</span> 16avos, Octavos, Cuartos, Semifinales, Tercer Puesto, Final
              </p>
              <div className="bg-slate-600/30 rounded-lg p-3 mt-3">
                <p className="text-xs text-slate-300 font-medium mb-1">📌 {t.casoDeEmpate}</p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-green-400">✅ {t.exacto} (2-2)</span>
                    <br /><span className="text-slate-400">→ 7 pts</span>
                  </div>
                  <div>
                    <span className="text-blue-400">🔵 {t.winner} (1-1, 3-3)</span>
                    <br /><span className="text-slate-400">→ 3 pts</span>
                  </div>
                  <div>
                    <span className="text-red-400">❌ {t.errado}</span>
                    <br /><span className="text-slate-400">→ 0 pts</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-amber-300 font-medium mb-3">{t.premiosIndividuales3premios}</h4>
            <div className="bg-slate-700/30 rounded-xl p-4">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-2xl mb-1">⚽</p>
                  <p className="text-white text-sm font-medium">{t.goleadorDelTorneo}</p>
                  <p className="text-green-400 text-xs mt-1">{t.ptsPorCada}</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl mb-1">🅰️</p>
                  <p className="text-white text-sm font-medium">{t.asistidorDelTorneo}</p>
                  <p className="text-green-400 text-xs mt-1">{t.ptsPorCada}</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl mb-1">⭐</p>
                  <p className="text-white text-sm font-medium">{t.mvpDelTorneo}</p>
                  <p className="text-green-400 text-xs mt-1">{t.ptsPorCada}</p>
                </div>
              </div>
              <p className="text-sm text-slate-400">
                <span className="text-amber-400 font-medium">{t.maximo}:</span> 15 pts
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-400/10 to-green-500/5 border border-green-400/30 rounded-2xl p-6">
          <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-green-400" />
            {t.puntajeTotalMaximo}
          </h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-slate-700/50 rounded-xl p-4">
              <p className="text-3xl font-bold text-amber-400">360</p>
              <p className="text-xs text-slate-400">{t.faseGrupos}</p>
            </div>
            <div className="bg-slate-700/50 rounded-xl p-4">
              <p className="text-3xl font-bold text-purple-400">112</p>
              <p className="text-xs text-slate-400">{t.faseEliminatoria}</p>
            </div>
            <div className="bg-slate-700/50 rounded-xl p-4">
              <p className="text-3xl font-bold text-green-400">45</p>
              <p className="text-xs text-slate-400">{t.premios}</p>
            </div>
          </div>
          <div className="mt-4 bg-amber-400/20 rounded-xl p-4 text-center">
            <p className="text-slate-300 text-sm mb-1">{t.puntajeTotalMaximo}</p>
            <p className="text-4xl font-bold text-amber-400">517 {t.pts}</p>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            {t.reglasGenerales}
          </h3>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-amber-400/20 text-amber-400 w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">1</div>
              <div>
                <p className="text-white font-medium">{t.losPronosticosSePuedenModificar}</p>
                <p className="text-sm text-slate-400">{t.hastaQueElPartidoComience}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-amber-400/20 text-amber-400 w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">2</div>
              <div>
                <p className="text-white font-medium">{t.losEmpatesCuentanComoGanador}</p>
                <p className="text-sm text-slate-400">{t.resultadoExacto5Pts}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-amber-400/20 text-amber-400 w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">3</div>
              <div>
                <p className="text-white font-medium">{t.losPremiosSonIndependientes}</p>
                <p className="text-sm text-slate-400">{t.noImportaSiTuEquipoPasa}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-amber-400/20 text-amber-400 w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">4</div>
              <div>
                <p className="text-white font-medium">{t.enCasoDeEmpateEnPuntos}</p>
                <p className="text-sm text-slate-400">{t.elDesempateFavoreAlQueTengaMas} <span className="text-green-400">{t.exactos}</span>. {t.mayorCantidadDeWinners}.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-amber-400/20 text-amber-400 w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">5</div>
              <div>
                <p className="text-white font-medium">{t.resultadosSeCarganPost}</p>
                <p className="text-sm text-slate-400">{t.losAdministradoresCarganResultados}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            {t.criteriosDeDesempate}
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="bg-green-400/20 text-green-400 px-2 py-0.5 rounded text-xs font-medium">1°</span>
              <span className="text-slate-300">{t.mayorCantidadDeResultadosExactos}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="bg-blue-400/20 text-blue-400 px-2 py-0.5 rounded text-xs font-medium">2°</span>
              <span className="text-slate-300">{t.mayorCantidadDeWinners}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="bg-slate-600/50 text-slate-400 px-2 py-0.5 rounded text-xs font-medium">3°</span>
              <span className="text-slate-300">{t.menorCantidadDeErrados}</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 border border-slate-600/50 rounded-2xl p-6">
          <h3 className="text-white font-bold mb-4">{t.resumenRapido}</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400 border-b border-slate-700">
                  <th className="text-left py-2">{t.tipo}</th>
                  <th className="text-center py-2">{t.exacto}</th>
                  <th className="text-center py-2">{t.winner}</th>
                  <th className="text-center py-2">{t.partidosLabel}</th>
                  <th className="text-right py-2">{t.maximo_2}</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                <tr className="border-b border-slate-700/50">
                  <td className="py-2">{t.faseGrupos}</td>
                  <td className="text-center text-green-400">5 pts</td>
                  <td className="text-center text-blue-400">2 pts</td>
                  <td className="text-center">72</td>
                  <td className="text-right text-amber-400">360 pts</td>
                </tr>
                <tr className="border-b border-slate-700/50">
                  <td className="py-2">{t.faseEliminatoria}</td>
                  <td className="text-center text-green-400">7 pts</td>
                  <td className="text-center text-blue-400">3 pts</td>
                  <td className="text-center">16</td>
                  <td className="text-right text-amber-400">112 pts</td>
                </tr>
                <tr className="border-b border-slate-700/50">
                  <td className="py-2">{t.premios}</td>
                  <td className="text-center text-green-400">15 pts</td>
                  <td className="text-center">—</td>
                  <td className="text-center">3</td>
                  <td className="text-right text-amber-400">45 pts</td>
                </tr>
                <tr className="bg-amber-400/10">
                  <td className="py-2 font-bold text-white">TOTAL</td>
                  <td colSpan={3}></td>
                  <td className="text-right font-bold text-amber-400">517 {t.pts}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-center pb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-all"
          >
            ← {t.volverAlInicio}
          </Link>
        </div>
      </main>
    </div>
  );
}