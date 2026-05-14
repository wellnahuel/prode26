'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { usePartidos, useMisPronosticos } from '@/hooks/usePartidos';
import { Timestamp } from 'firebase/firestore';
import { collection, addDoc, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ChevronLeft, ChevronRight, Save, Lock, Check, X, Clock } from 'lucide-react';
import { getBandera } from '@/lib/banderas';

const GRUPOS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

// Duración aproximada de un partido de mundial (2h 45min en ms)
const MATCH_DURATION_MS = (2 * 60 * 60 + 45 * 60) * 1000;

interface PronosticoLocal {
  [partidoId: string]: { golesA: number; golesB: number };
}

type TimeStatus = 'countdown' | 'live' | 'cerrado';

function getPartidoStatus(fechaInicio: Timestamp): TimeStatus {
  const ahora = Date.now();
  const inicio = fechaInicio.toMillis();
  const finEstimado = inicio + MATCH_DURATION_MS;

  if (ahora < inicio) return 'countdown';
  if (ahora < finEstimado) return 'live';
  return 'cerrado';
}

function getTimeRemaining(fechaInicio: Timestamp): { horas: number; minutos: number } | null {
  const ahora = Date.now();
  const inicio = fechaInicio.toMillis();
  const diff = inicio - ahora;

  if (diff <= 0) return null;

  const horas = Math.floor(diff / (1000 * 60 * 60));
  const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return { horas, minutos };
}

export default function PronosticosPage() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const { partidos, loading: loadingPartidos } = usePartidos();
  const { pronosticos, loading: loadingPronosticos } = useMisPronosticos(user?.uid);

  const [pronosticoLocal, setPronosticoLocal] = useState<PronosticoLocal>({});
  const [grupoActual, setGrupoActual] = useState('A');
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);
  const [, setTick] = useState(0);

  // Force re-render every minute to update countdowns
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (pronosticos.length > 0) {
      const inicial: PronosticoLocal = {};
      pronosticos.forEach((p) => {
        inicial[p.partidoId] = {
          golesA: p.golesPredichoA,
          golesB: p.golesPredichoB,
        };
      });
      setPronosticoLocal(inicial);
    }
  }, [pronosticos]);

  const handleInputChange = (partidoId: string, equipo: 'A' | 'B', valor: number) => {
    setPronosticoLocal((prev) => ({
      ...prev,
      [partidoId]: {
        ...prev[partidoId],
        [equipo === 'A' ? 'golesA' : 'golesB']: valor,
      },
    }));
  };

  const guardarPronosticosDelGrupo = async () => {
    if (!user) return;

    setGuardando(true);
    setMensaje(null);

    try {
      const partidosDelGrupo = partidos.filter(
        (p) => p.fase === 'grupos' && p.grupo === grupoActual
      );

      for (const partido of partidosDelGrupo) {
        const pronostico = pronosticoLocal[partido.id];
        if (pronostico === undefined) continue;

        const q = query(
          collection(db, 'pronosticos'),
          where('usuarioId', '==', user.uid),
          where('partidoId', '==', partido.id)
        );
        const existing = await getDocs(q);

        if (existing.empty) {
          await addDoc(collection(db, 'pronosticos'), {
            usuarioId: user.uid,
            partidoId: partido.id,
            golesPredichoA: pronostico.golesA,
            golesPredichoB: pronostico.golesB,
            creadoEn: new Date(),
            actualizadoEn: new Date(),
          });
        } else {
          const docId = existing.docs[0].id;
          await setDoc(
            doc(db, 'pronosticos', docId),
            {
              golesPredichoA: pronostico.golesA,
              golesPredichoB: pronostico.golesB,
              actualizadoEn: new Date(),
            },
            { merge: true }
          );
        }
      }

      setMensaje({ tipo: 'success', texto: t.partidosListos });
      setTimeout(() => setMensaje(null), 3000);
    } catch (error) {
      console.error('Error guardando:', error);
      setMensaje({ tipo: 'error', texto: 'Error al guardar' });
    } finally {
      setGuardando(false);
    }
  };

  const grupoIdx = GRUPOS.indexOf(grupoActual);
  const partidosDelGrupo = partidos.filter(
    (p) => p.fase === 'grupos' && p.grupo === grupoActual
  );

  if (loadingPartidos || loadingPronosticos) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-400 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-400">{t.cargando}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-white">{t.cargarPronosticosTitle}</h1>
            <div className="text-sm text-slate-400">{t.faseGruposLarga}</div>
          </div>

          {/* Navegación de grupos */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setGrupoActual(GRUPOS[grupoIdx - 1])}
              disabled={grupoIdx === 0}
              className="p-3 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="flex gap-1 flex-wrap justify-center">
              {GRUPOS.map((g) => (
                <button
                  key={g}
                  onClick={() => setGrupoActual(g)}
                  className={`w-11 h-11 rounded-lg font-bold text-sm transition-all ${
                    grupoActual === g
                      ? 'bg-amber-400 text-slate-900'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>

            <button
              onClick={() => setGrupoActual(GRUPOS[grupoIdx + 1])}
              disabled={grupoIdx === GRUPOS.length - 1}
              className="p-3 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Info de puntos */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 mb-6">
          <h3 className="text-white font-medium mb-3 flex items-center gap-2">
            <span className="text-lg">📊</span> {t.sistemaDePuntos}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-700/50 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-green-400">5</p>
              <p className="text-xs text-slate-400">{t.puntos}</p>
              <p className="text-xs text-slate-500 mt-1">{t.scoreCorrecto}</p>
            </div>
            <div className="bg-slate-700/50 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-blue-400">2</p>
              <p className="text-xs text-slate-400">{t.puntos}</p>
              <p className="text-xs text-slate-500 mt-1">{t.ganadorScore}</p>
            </div>
            <div className="bg-slate-700/50 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-green-400">72</p>
              <p className="text-xs text-slate-400">{t.partidosLabel}</p>
              <p className="text-xs text-slate-500 mt-1">6 x 12</p>
            </div>
            <div className="bg-slate-700/50 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-amber-400">360</p>
              <p className="text-xs text-slate-400">{t.puntosMax}</p>
              <p className="text-xs text-slate-500 mt-1">{t.todosExactos}</p>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3">
            <span className="text-green-400">✅ {t.exacto}</span> = {t.scoreCorrecto} |
            <span className="text-blue-400 ml-2">🔵 {t.winner}</span> = {t.acertarGanadorNoScore}
          </p>
        </div>

        {/* Efectividad por grupo */}
        {(() => {
          const grupoStats: Record<string, { total: number; correctos: number; exactos: number }> = {};

          partidos
            .filter(p => p.fase === 'grupos' && p.grupo === grupoActual && p.resultado)
            .forEach(partido => {
              const pronostico = pronosticos.find(pr => pr.partidoId === partido.id);
              if (!pronostico) return;

              if (!grupoStats[grupoActual]) {
                grupoStats[grupoActual] = { total: 0, correctos: 0, exactos: 0 };
              }

              grupoStats[grupoActual].total++;

              const { golesA: realA, golesB: realB } = partido.resultado!;
              const predA = pronostico.golesPredichoA;
              const predB = pronostico.golesPredichoB;

              if (realA === predA && realB === predB) {
                grupoStats[grupoActual].exactos++;
                grupoStats[grupoActual].correctos++;
              } else {
                const predWinnerA = predA > predB;
                const predWinnerB = predB > predA;
                const predEmpate = predA === predB;
                const realWinnerA = realA > realB;
                const realWinnerB = realB > realA;
                const realEmpate = realA === realB;

                if (
                  (predWinnerA && realWinnerA) ||
                  (predWinnerB && realWinnerB) ||
                  (predEmpate && realEmpate)
                ) {
                  grupoStats[grupoActual].correctos++;
                }
              }
            });

          const stats = grupoStats[grupoActual];
          if (!stats || stats.total === 0) return null;

          const efectividad = Math.round((stats.correctos / stats.total) * 100);
          return (
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 mb-6">
              <h4 className="text-white font-medium mb-3">📈 Efectividad del grupo {grupoActual}</h4>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="w-full bg-slate-700 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${
                        efectividad >= 70 ? 'bg-green-400' : efectividad >= 40 ? 'bg-amber-400' : 'bg-red-400'
                      }`}
                      style={{ width: `${efectividad}%` }}
                    />
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className={`text-lg font-bold ${
                    efectividad >= 70 ? 'text-green-400' : efectividad >= 40 ? 'text-amber-400' : 'text-red-400'
                  }`}>
                    {efectividad}%
                  </span>
                  <span className="text-xs text-slate-400 ml-2">
                    ({stats.correctos}/{stats.total})
                  </span>
                </div>
              </div>
              <div className="flex gap-4 mt-2 text-xs text-slate-400">
                <span>✅ Exactos: {stats.exactos}</span>
                <span>🔵 Winners: {stats.correctos - stats.exactos}</span>
                <span>❌ Errados: {stats.total - stats.correctos}</span>
              </div>
            </div>
          );
        })()}

        {/* Mensaje */}
        {mensaje && (
          <div
            className={`mb-4 p-4 rounded-xl flex items-center gap-3 ${
              mensaje.tipo === 'success'
                ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                : 'bg-red-500/20 border border-red-500/50 text-red-400'
            }`}
          >
            {mensaje.tipo === 'success' ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
            {mensaje.texto}
          </div>
        )}

        {/* Partidos */}
        <div className="space-y-4">
          {partidosDelGrupo.map((partido) => {
            const status = getPartidoStatus(partido.fechaInicio);
            const esCerrado = status === 'cerrado';
            const esLive = status === 'live';
            const pronostico = pronosticoLocal[partido.id];
            const timeInfo = getTimeRemaining(partido.fechaInicio);

            return (
              <div
                key={partido.id}
                className={`bg-slate-800/50 border rounded-2xl p-4 transition-all ${
                  esCerrado
                    ? 'border-red-500/30 opacity-75'
                    : esLive
                    ? 'border-green-500/50 shadow-lg shadow-green-500/10'
                    : 'border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-slate-400">
                    {partido.fechaInicio.toDate().toLocaleDateString(language === 'it' ? 'it-IT' : 'es-ES', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                  <div className="flex items-center gap-2">
                    {status === 'countdown' && timeInfo && (
                      <div className={`flex items-center gap-1 text-sm px-3 py-1 rounded-full ${
                        timeInfo.horas < 1 ? 'bg-amber-400/20 text-amber-400' : 'bg-slate-700/50 text-slate-400'
                      }`}>
                        <Clock className="w-4 h-4" />
                        <span className="font-mono font-medium">
                          {timeInfo.horas > 0
                            ? `${timeInfo.horas}h ${timeInfo.minutos}m`
                            : `${timeInfo.minutos}m`
                          }
                        </span>
                      </div>
                    )}

                    {esLive && (
                      <div className="flex items-center gap-2 bg-green-400/20 text-green-400 px-3 py-1 rounded-full">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                        </span>
                        <span className="text-sm font-bold uppercase tracking-wide">En juego</span>
                      </div>
                    )}

                    {esCerrado && (
                      <div className="flex items-center gap-1 text-red-400 text-sm px-3 py-1 rounded-full bg-red-400/10">
                        <Lock className="w-4 h-4" />
                        <span className="font-medium">{t.partidoCerrado}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1 text-center">
                    <div className="text-2xl mb-2">{getBandera(partido.equipoA)}</div>
                    <div className="text-sm font-bold text-white">{partido.nombreA}</div>
                    <input
                      type="text"
                      inputMode="decimal"
                      pattern="[0-9]*"
                      min="0"
                      max="20"
                      value={pronostico?.golesA ?? ''}
                      onChange={(e) =>
                        handleInputChange(partido.id, 'A', parseInt(e.target.value) || 0)
                      }
                      disabled={esCerrado}
                      placeholder="-"
                      className="w-16 h-12 text-center text-2xl font-bold bg-slate-900 border border-slate-600 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>

                  <div className="px-6 text-slate-500 font-bold text-xl">X</div>

                  <div className="flex-1 text-center">
                    <div className="text-2xl mb-2">{getBandera(partido.equipoB)}</div>
                    <div className="text-sm font-bold text-white">{partido.nombreB}</div>
                    <input
                      type="text"
                      inputMode="decimal"
                      pattern="[0-9]*"
                      min="0"
                      max="20"
                      value={pronostico?.golesB ?? ''}
                      onChange={(e) =>
                        handleInputChange(partido.id, 'B', parseInt(e.target.value) || 0)
                      }
                      disabled={esCerrado}
                      placeholder="-"
                      className="w-16 h-12 text-center text-2xl font-bold bg-slate-900 border border-slate-600 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                </div>

                {/* Predicción vs Resultado (solo si cerrado y tiene resultado) */}
                {esCerrado && partido.resultado && pronostico && (
                  <div className="mt-3 pt-3 border-t border-slate-700">
                    <div className="flex items-center justify-center gap-4 text-xs">
                      <div className="text-center">
                        <p className="text-slate-500 mb-1">Tu predicción</p>
                        <p className="font-bold text-white">
                          {pronostico.golesA} - {pronostico.golesB}
                        </p>
                      </div>
                      <div className="text-slate-500">→</div>
                      <div className="text-center">
                        <p className="text-slate-500 mb-1">Resultado</p>
                        <p className="font-bold text-white">
                          {partido.resultado.golesA} - {partido.resultado.golesB}
                        </p>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-bold ${
                        pronostico.golesA === partido.resultado.golesA &&
                        pronostico.golesB === partido.resultado.golesB
                          ? 'bg-green-400/20 text-green-400'
                          : 'bg-red-400/20 text-red-400'
                      }`}>
                        {pronostico.golesA === partido.resultado.golesA &&
                        pronostico.golesB === partido.resultado.golesB
                          ? 'EXACTO'
                          : 'EQUIVOCADO'}
                      </div>
                    </div>
                  </div>
                )}

                <div className="text-center text-xs text-slate-500 mt-3">
                  📍 {partido.estadio}
                </div>
              </div>
            );
          })}
        </div>

        {/* Botón guardar */}
        {partidosDelGrupo.length > 0 && (
          <div className="mt-6">
            <button
              onClick={guardarPronosticosDelGrupo}
              disabled={guardando}
              className="w-full py-4 px-6 bg-amber-400 hover:bg-amber-300 disabled:bg-amber-400/50 disabled:cursor-not-allowed text-slate-900 font-bold rounded-xl transition-all shadow-lg shadow-amber-400/20 flex items-center justify-center gap-3"
            >
              {guardando ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-slate-900 border-t-transparent"></div>
                  {t.guardando}
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {t.guardarPronosticosGrupo} {grupoActual}
                </>
              )}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}