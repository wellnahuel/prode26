'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { usePartidos } from '@/hooks/usePartidos';
import { collection, addDoc, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Timestamp } from 'firebase/firestore';
import { Trophy, Lock, Calendar, Save, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { getBandera } from '@/lib/banderas';

const FASES = [
  { key: '16avos', label: '16avos', labelEs: 'Dieciseisavos', labelIt: 'Sedicesimi' },
  { key: 'octavos', label: 'octavos', labelEs: 'Octavos', labelIt: 'Ottavi' },
  { key: 'cuartos', label: 'cuartos', labelEs: 'Cuartos', labelIt: 'Quarti' },
  { key: 'semis', label: 'semis', labelEs: 'Semifinales', labelIt: 'Semifinali' },
  { key: 'tercer-puesto', label: 'tercer-puesto', labelEs: 'Tercer Puesto', labelIt: 'Terzo Posto' },
  { key: 'final', label: 'final', labelEs: 'Final', labelIt: 'Finale' },
];

type RondaEliminatoria = '16avos' | 'octavos' | 'cuartos' | 'semis' | 'tercer-puesto' | 'final';

// Duración aproximada de un partido de mundial (2h 45min en ms)
const MATCH_DURATION_MS = (2 * 60 * 60 + 45 * 60) * 1000;

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

interface PronosticoLocal {
  [partidoId: string]: { golesA: number; golesB: number };
}

export default function EliminatoriaPage() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const { partidos, loading: loadingPartidos } = usePartidos();

  const [faseActual, setFaseActual] = useState<RondaEliminatoria>('16avos');
  const [pronosticoLocal, setPronosticoLocal] = useState<PronosticoLocal>({});
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);
  const [, setTick] = useState(0);

  // Force re-render every minute to update countdowns
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  // Cargar mis pronósticos de eliminatoria
  useEffect(() => {
    async function cargarPronosticos() {
      if (!user || partidos.length === 0) return;

      try {
        const q = query(
          collection(db, 'pronosticos'),
          where('usuarioId', '==', user.uid)
        );
        const snap = await getDocs(q);

        const inicial: PronosticoLocal = {};
        snap.docs.forEach((doc) => {
          const data = doc.data();
          // Solo cargarpronosticos de partidos de eliminatoria
          const partido = partidos.find((p) => p.id === data.partidoId);
          if (partido && partido.fase === 'eliminatoria') {
            inicial[data.partidoId] = {
              golesA: data.golesPredichoA,
              golesB: data.golesPredichoB,
            };
          }
        });

        setPronosticoLocal(inicial);
      } catch (error) {
        console.error('Error cargando pronosticos:', error);
      }
    }

    cargarPronosticos();
  }, [user, partidos]);

  const handleInputChange = (partidoId: string, equipo: 'A' | 'B', valor: number) => {
    setPronosticoLocal((prev) => ({
      ...prev,
      [partidoId]: {
        ...prev[partidoId],
        [equipo === 'A' ? 'golesA' : 'golesB']: valor,
      },
    }));
  };

  const guardarPronosticosDeFase = async () => {
    if (!user) return;

    setGuardando(true);
    setMensaje(null);

    try {
      const partidosDeFase = partidos.filter(
        (p) => p.fase === 'eliminatoria' && p.ronda === faseActual
      );

      for (const partido of partidosDeFase) {
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

  const partidosEliminatoria = partidos.filter((p) => p.fase === 'eliminatoria');
  const partidosDeFase = partidosEliminatoria.filter((p) => p.ronda === faseActual);

  const faseIdx = FASES.findIndex((f) => f.key === faseActual);
  const faseLabel = language === 'it'
    ? FASES[faseIdx].labelIt
    : FASES[faseIdx].labelEs;

  if (loadingPartidos) {
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
      <header className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-amber-400" />
            <div>
              <h1 className="text-xl font-bold text-white">{t.faseEliminatoria}</h1>
              <p className="text-xs text-slate-400">{t.copaMundial2026}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Info */}
        <div className="bg-gradient-to-r from-amber-400/10 to-amber-500/5 border border-amber-400/20 rounded-2xl p-6 mb-6">
          <div className="text-center mb-4">
            <div className="text-5xl mb-3">🏆</div>
            <h2 className="text-xl font-bold text-white mb-2">
              {t.pronosticosDeFaseEliminatoria}
            </h2>
            <p className="text-slate-300">
              {t.alFinalDeLaFaseDeGrupos}
            </p>
          </div>
        </div>

        {/* Navegación de fases */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setFaseActual(FASES[faseIdx - 1]?.key as RondaEliminatoria)}
            disabled={faseIdx === 0}
            className="p-3 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="flex gap-1 flex-wrap justify-center">
            {FASES.map((fase) => (
              <button
                key={fase.key}
                onClick={() => setFaseActual(fase.key as RondaEliminatoria)}
                className={`px-3 py-2 rounded-lg font-bold text-sm transition-all ${
                  faseActual === fase.key
                    ? 'bg-amber-400 text-slate-900'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {language === 'it' ? fase.labelIt : fase.labelEs}
              </button>
            ))}
          </div>

          <button
            onClick={() => setFaseActual(FASES[faseIdx + 1]?.key as RondaEliminatoria)}
            disabled={faseIdx === FASES.length - 1}
            className="p-3 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

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

        {/* Partidos de la fase */}
        <div className="space-y-4">
          {partidosDeFase.length === 0 ? (
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 text-center">
              <p className="text-slate-400">No hay partidos de {faseLabel} cargados aún.</p>
            </div>
          ) : (
            partidosDeFase.map((partido) => {
              const status = getPartidoStatus(partido.fechaInicio);
              const esCerrado = status === 'cerrado';
              const esLive = status === 'live';
              const pronostico = pronosticoLocal[partido.id];
              const timeInfo = getTimeRemaining(partido.fechaInicio);
              const esPorDefinir = partido.nombreA === 'Por definir';

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
                  {/* Header */}
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

                    {/* Status badge */}
                    <div className="flex items-center gap-2">
                      {status === 'countdown' && timeInfo && (
                        <div className={`flex items-center gap-1 text-sm px-3 py-1 rounded-full ${
                          timeInfo.horas < 1 ? 'bg-amber-400/20 text-amber-400' : 'bg-slate-700/50 text-slate-400'
                        }`}>
                          <Calendar className="w-4 h-4" />
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

                  {/* Equipos */}
                  <div className="flex items-center justify-between">
                    <div className="flex-1 text-center">
                      <div className="text-2xl mb-2">{getBandera(partido.equipoA)}</div>
                      <div className={`text-sm font-bold ${esPorDefinir ? 'text-slate-400' : 'text-white'}`}>
                        {partido.nombreA}
                      </div>
                      {esPorDefinir ? (
                        <p className="text-xs text-slate-500 mt-1">Por definir</p>
                      ) : (
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
                          disabled={esCerrado || esPorDefinir}
                          placeholder="-"
                          className="w-16 h-12 text-center text-2xl font-bold bg-slate-900 border border-slate-600 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-amber-400 mt-2"
                        />
                      )}
                    </div>

                    <div className="px-6 text-slate-500 font-bold text-xl">vs</div>

                    <div className="flex-1 text-center">
                      <div className="text-2xl mb-2">{getBandera(partido.equipoB)}</div>
                      <div className={`text-sm font-bold ${esPorDefinir ? 'text-slate-400' : 'text-white'}`}>
                        {partido.nombreB}
                      </div>
                      {esPorDefinir ? (
                        <p className="text-xs text-slate-500 mt-1">Por definir</p>
                      ) : (
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
                          disabled={esCerrado || esPorDefinir}
                          placeholder="-"
                          className="w-16 h-12 text-center text-2xl font-bold bg-slate-900 border border-slate-600 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-amber-400 mt-2"
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Botón guardar */}
        {partidosDeFase.length > 0 && !partidosDeFase[0]?.nombreA?.includes('Por definir') && (
          <div className="mt-6">
            <button
              onClick={guardarPronosticosDeFase}
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
                  Guardar Pronósticos - {faseLabel}
                </>
              )}
            </button>
          </div>
        )}

        {/* Info puntos */}
        <div className="mt-6 bg-slate-800/50 border border-slate-700 rounded-2xl p-4">
          <h4 className="text-white font-medium mb-3">{t.comoFuncionanLosPuntos}</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-700/30 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-green-400">7</p>
              <p className="text-xs text-slate-400">{t.exactoSignificaAcertarElScore}</p>
            </div>
            <div className="bg-slate-700/30 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-blue-400">3</p>
              <p className="text-xs text-slate-400">{t.winnerSignificaAcertarQuienAvanza}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/dashboard/pronosticos"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-all"
          >
            ← {t.verPronosticosDeFaseDeGrupos}
          </Link>
        </div>
      </main>
    </div>
  );
}