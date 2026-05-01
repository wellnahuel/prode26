'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePartidos, useMisPronosticos } from '@/hooks/usePartidos';
import { Timestamp } from 'firebase/firestore';
import { collection, addDoc, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ChevronLeft, ChevronRight, Save, Lock, Check, X } from 'lucide-react';
import { getBandera } from '@/lib/banderas';

const GRUPOS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

interface PronosticoLocal {
  [partidoId: string]: { golesA: number; golesB: number };
}

export default function PronosticosPage() {
  const { user } = useAuth();
  const { partidos, loading: loadingPartidos } = usePartidos();
  const { pronosticos, loading: loadingPronosticos } = useMisPronosticos(user?.uid);

  const [pronosticoLocal, setPronosticoLocal] = useState<PronosticoLocal>({});
  const [grupoActual, setGrupoActual] = useState('A');
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);

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

  const partidoHaComenzado = (fechaInicio: Timestamp) => {
    return Timestamp.now().toMillis() > fechaInicio.toMillis();
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

        // Buscar si ya existe
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

      setMensaje({ tipo: 'success', texto: '¡Pronósticos guardados!' });
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
          <p className="text-slate-400">Cargando partidos...</p>
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
            <h1 className="text-xl font-bold text-white">Cargar Pronósticos</h1>
            <div className="text-sm text-slate-400">Fase de Grupos</div>
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
            const bloqueo = partidoHaComenzado(partido.fechaInicio);
            const pronostico = pronosticoLocal[partido.id];

            return (
              <div
                key={partido.id}
                className={`bg-slate-800/50 border rounded-2xl p-4 ${
                  bloqueo ? 'border-red-500/30 opacity-75' : 'border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-slate-400">
                    {partido.fechaInicio.toDate().toLocaleDateString('es-ES', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                  {bloqueo && (
                    <div className="flex items-center gap-1 text-red-400 text-sm">
                      <Lock className="w-4 h-4" />
                      Cerrado
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1 text-center">
                    <div className="text-2xl mb-2">{getBandera(partido.equipoA)}</div>
                    <div className="text-sm font-bold text-white">{partido.nombreA}</div>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={pronostico?.golesA ?? ''}
                      onChange={(e) =>
                        handleInputChange(partido.id, 'A', parseInt(e.target.value) || 0)
                      }
                      disabled={bloqueo}
                      placeholder="-"
                      className="w-16 h-12 text-center text-2xl font-bold bg-slate-900 border border-slate-600 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>

                  <div className="px-6 text-slate-500 font-bold text-xl">X</div>

                  <div className="flex-1 text-center">
                    <div className="text-2xl mb-2">{getBandera(partido.equipoB)}</div>
                    <div className="text-sm font-bold text-white">{partido.nombreB}</div>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={pronostico?.golesB ?? ''}
                      onChange={(e) =>
                        handleInputChange(partido.id, 'B', parseInt(e.target.value) || 0)
                      }
                      disabled={bloqueo}
                      placeholder="-"
                      className="w-16 h-12 text-center text-2xl font-bold bg-slate-900 border border-slate-600 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                </div>

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
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Guardar Pronósticos Grupo {grupoActual}
                </>
              )}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}