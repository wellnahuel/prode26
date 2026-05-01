'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { Usuario, Partido, Pronostico, calcularPuntos } from '@/types';
import { Trophy, Users, Target, TrendingUp } from 'lucide-react';

interface LeaderboardEntry {
  usuarioId: string;
  displayName: string;
  puntosTotales: number;
  exactos: number;
  winners: number;
}

export default function PosicionesPage() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [miPosicion, setMiPosicion] = useState<number | null>(null);

  useEffect(() => {
    async function calcularLeaderboard() {
      try {
        // Obtener usuarios
        const usuariosSnap = await getDocs(collection(db, 'usuarios'));
        const usuarios = usuariosSnap.docs.map((doc) => ({
          uid: doc.id,
          ...doc.data(),
        })) as Usuario[];

        // Obtener partidos jugados (con resultado)
        const partidosSnap = await getDocs(collection(db, 'partidos'));
        const partidos = partidosSnap.docs
          .map((doc) => ({ id: doc.id, ...doc.data() } as Partido))
          .filter((p) => p.resultado);

        // Obtener todos los pronósticos
        const pronosticosSnap = await getDocs(collection(db, 'pronosticos'));
        const pronosticos = pronosticosSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Pronostico[];

        // Calcular puntos por usuario
        const resultados: LeaderboardEntry[] = [];

        for (const usuario of usuarios) {
          let puntosTotales = 0;
          let exactos = 0;
          let winners = 0;

          const misPronosticos = pronosticos.filter((p) => p.usuarioId === usuario.uid);

          for (const pronostico of misPronosticos) {
            const partido = partidos.find((p) => p.id === pronostico.partidoId);
            if (partido) {
              const puntos = calcularPuntos(pronostico, partido);
              puntosTotales += puntos;

              if (partido.resultado) {
                const { golesA: realA, golesB: realB } = partido.resultado;
                if (
                  pronostico.golesPredichoA === realA &&
                  pronostico.golesPredichoB === realB
                ) {
                  exactos++;
                } else {
                  const prediceGanadorA = pronostico.golesPredichoA > pronostico.golesPredichoB;
                  const prediceGanadorB = pronostico.golesPredichoB > pronostico.golesPredichoA;
                  const prediceEmpate = pronostico.golesPredichoA === pronostico.golesPredichoB;

                  const realGanadorA = realA > realB;
                  const realGanadorB = realB > realA;
                  const realEmpate = realA === realB;

                  if (
                    (prediceGanadorA && realGanadorA) ||
                    (prediceGanadorB && realGanadorB) ||
                    (prediceEmpate && realEmpate)
                  ) {
                    winners++;
                  }
                }
              }
            }
          }

          resultados.push({
            usuarioId: usuario.uid,
            displayName: usuario.displayName,
            puntosTotales,
            exactos,
            winners,
          });
        }

        // Ordenar
        resultados.sort((a, b) => {
          if (b.puntosTotales !== a.puntosTotales) {
            return b.puntosTotales - a.puntosTotales;
          }
          if (b.exactos !== a.exactos) {
            return b.exactos - a.exactos;
          }
          return b.winners - a.winners;
        });

        setLeaderboard(resultados);

        if (user) {
          const miIdx = resultados.findIndex((r) => r.usuarioId === user.uid);
          setMiPosicion(miIdx >= 0 ? miIdx + 1 : null);
        }
      } catch (error) {
        console.error('Error calculando leaderboard:', error);
      } finally {
        setLoading(false);
      }
    }

    calcularLeaderboard();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-400 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-400">Calculando posiciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-amber-400" />
            <div>
              <h1 className="text-xl font-bold text-white">Tabla de Posiciones</h1>
              <p className="text-xs text-slate-400">Mundial 2026</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Mi posición */}
        {miPosicion && (
          <div className="bg-gradient-to-r from-amber-400/20 to-amber-500/10 border border-amber-400/30 rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-300">Tu posición</p>
                <p className="text-3xl font-bold text-amber-400">{miPosicion}° lugar</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-300">Puntos</p>
                <p className="text-2xl font-bold text-white">
                  {leaderboard.find((r) => r.usuarioId === user?.uid)?.puntosTotales || 0}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Top 3 */}
        {leaderboard.length >= 1 && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            {leaderboard.slice(0, 3).map((entry, idx) => {
              const medals = ['🥇', '🥈', '🥉'];
              const colors = ['text-amber-400', 'text-slate-300', 'text-amber-600'];
              const bgColors = [
                'bg-amber-400/20 border-amber-400/50',
                'bg-slate-600/20 border-slate-500/50',
                'bg-amber-700/20 border-amber-600/50',
              ];

              return (
                <div
                  key={entry.usuarioId}
                  className={`rounded-xl p-4 border ${bgColors[idx]} ${
                    entry.usuarioId === user?.uid ? 'ring-2 ring-amber-400' : ''
                  }`}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">{medals[idx]}</div>
                    <p className={`font-bold text-lg truncate ${colors[idx]}`}>
                      {entry.displayName}
                    </p>
                    <p className="text-2xl font-bold text-white mt-2">{entry.puntosTotales}</p>
                    <p className="text-xs text-slate-400">puntos</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Resto del leaderboard */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-slate-700 bg-slate-800">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-slate-400" />
              Clasificación General
            </h3>
          </div>

          {leaderboard.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No hay participantes todavía</p>
              <p className="text-sm">¡Invita a tus amigos para competir!</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-700">
              {leaderboard.slice(3).map((entry, idx) => (
                <div
                  key={entry.usuarioId}
                  className={`p-4 flex items-center gap-4 ${
                    entry.usuarioId === user?.uid ? 'bg-amber-400/10' : ''
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-slate-300">
                    {idx + 4}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white">
                      {entry.displayName}
                      {entry.usuarioId === user?.uid && (
                        <span className="ml-2 text-xs text-amber-400">(Vos)</span>
                      )}
                    </p>
                    <div className="flex gap-4 text-xs text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        {entry.exactos} exactos
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {entry.winners} winners
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-amber-400">{entry.puntosTotales}</p>
                    <p className="text-xs text-slate-400">pts</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}