'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { Usuario, Partido, Pronostico, calcularPuntos } from '@/types';
import { Trophy, Users, Target, TrendingUp, CheckCircle, XCircle, Zap } from 'lucide-react';

interface LeaderboardEntry {
  usuarioId: string;
  displayName: string;
  puntosTotales: number;
  exactos: number;
  winners: number;
  perdidos: number;
  totalJugados: number;
  efectividad: number;
  distanciaLider: number;
}

interface DetalleUsuario {
  exactosList: string[];
  winnersList: string[];
  perdidosList: string[];
}

export default function PosicionesPage() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [detalles, setDetalles] = useState<Record<string, DetalleUsuario>>({});
  const [usuarioExpandido, setUsuarioExpandido] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [miPosicion, setMiPosicion] = useState<number | null>(null);
  const [totalPartidos, setTotalPartidos] = useState(0);

  useEffect(() => {
    async function calcularLeaderboard() {
      try {
        // Obtener usuarios
        const usuariosSnap = await getDocs(collection(db, 'usuarios'));
        const usuarios = usuariosSnap.docs.map((doc) => ({
          uid: doc.id,
          ...doc.data(),
        })) as Usuario[];

        // Obtener TODOS los partidos (para saber el total)
        const partidosSnap = await getDocs(collection(db, 'partidos'));
        const partidos = partidosSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Partido;
        setTotalPartidos(partidos.length);

        // Obtener partidos jugados (con resultado)
        const partidosJugados = partidos.filter((p) => p.resultado);

        // Obtener todos los pronósticos
        const pronosticosSnap = await getDocs(collection(db, 'pronosticos'));
        const pronosticos = pronosticosSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Pronostico[];

        // Calcular puntos y detalles por usuario
        const resultados: LeaderboardEntry[] = [];
        const detallesMap: Record<string, DetalleUsuario> = {};

        for (const usuario of usuarios) {
          let puntosTotales = 0;
          let exactos = 0;
          let winners = 0;
          let perdidos = 0;
          let totalJugados = 0;

          const exactosList: string[] = [];
          const winnersList: string[] = [];
          const perdidosList: string[] = [];

          const misPronosticos = pronosticos.filter((p) => p.usuarioId === usuario.uid);

          for (const pronostico of misPronosticos) {
            const partido = partidos.find((p) => p.id === pronostico.partidoId);
            if (partido && partido.resultado) {
              totalJugados++;
              const puntos = calcularPuntos(pronostico, partido);
              puntosTotales += puntos;

              const { golesA: realA, golesB: realB } = partido.resultado;
              const nombrePartido = `${partido.equipoA} vs ${partido.equipoB}`;

              if (
                pronostico.golesPredichoA === realA &&
                pronostico.golesPredichoB === realB
              ) {
                exactos++;
                exactosList.push(nombrePartido);
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
                  winnersList.push(nombrePartido);
                } else {
                  perdidos++;
                  perdidosList.push(nombrePartido);
                }
              }
            }
          }

          // Efectividad = (exactos + winners) / totalJugados
          const efectividad = totalJugados > 0
            ? Math.round(((exactos + winners) / totalJugados) * 100)
            : 0;

          resultados.push({
            usuarioId: usuario.uid,
            displayName: usuario.displayName,
            puntosTotales,
            exactos,
            winners,
            perdidos,
            totalJugados,
            efectividad,
            distanciaLider: 0, // Se calcula después de ordenar
          });

          detallesMap[usuario.uid] = { exactosList, winnersList, perdidosList };
        }

        // Ordenar por puntos
        resultados.sort((a, b) => {
          if (b.puntosTotales !== a.puntosTotales) {
            return b.puntosTotales - a.puntosTotales;
          }
          if (b.exactos !== a.exactos) {
            return b.exactos - a.exactos;
          }
          return b.winners - a.winners;
        });

        // Calcular distancia al líder
        const liderPuntos = resultados.length > 0 ? resultados[0].puntosTotales : 0;
        resultados.forEach((r) => {
          r.distanciaLider = liderPuntos - r.puntosTotales;
        });

        setLeaderboard(resultados);
        setDetalles(detallesMap);

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
              <h1 className="text-xl font-bold text-white">Clasificación General</h1>
              <p className="text-xs text-slate-400">Mundial 2026 • Detalle de aciertos</p>
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

        {/* Top 3 podium */}
        {leaderboard.length >= 1 && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            {leaderboard.slice(0, 3).map((entry, idx) => {
              const medals = ['🥇', '🥈', '🥉'];
              const bgColors = [
                'bg-amber-400/20 border-amber-400/50',
                'bg-slate-600/20 border-slate-500/50',
                'bg-amber-700/20 border-amber-600/50',
              ];
              const isExpanded = usuarioExpandido === entry.usuarioId;

              return (
                <div key={entry.usuarioId} className="space-y-2">
                  <div
                    className={`rounded-xl p-4 border ${bgColors[idx]} ${
                      entry.usuarioId === user?.uid ? 'ring-2 ring-amber-400' : ''
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">{medals[idx]}</div>
                      <p className={`font-bold text-lg truncate ${
                        idx === 0 ? 'text-amber-400' : idx === 1 ? 'text-slate-300' : 'text-amber-600'
                      }`}>
                        {entry.displayName}
                      </p>
                      <p className="text-2xl font-bold text-white mt-2">{entry.puntosTotales}</p>
                      <p className="text-xs text-slate-400">puntos</p>
                    </div>

                    {/* Mini stats */}
                    <div className="grid grid-cols-3 gap-1 mt-3 pt-3 border-t border-slate-700">
                      <div className="text-center">
                        <p className="text-lg font-bold text-green-400">{entry.exactos}</p>
                        <p className="text-xs text-slate-400">Exactos</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-blue-400">{entry.winners}</p>
                        <p className="text-xs text-slate-400">Winners</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-red-400">{entry.perdidos}</p>
                        <p className="text-xs text-slate-400">Errados</p>
                      </div>
                    </div>

                    {/* Extra stats: efectividad, distancia, partidos */}
                    <div className="flex items-center justify-center gap-3 mt-3 pt-3 border-t border-slate-700 flex-wrap">
                      <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        {entry.totalJugados}/{totalPartidos}
                      </span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                        entry.efectividad >= 70 ? 'bg-green-400/20 text-green-400' :
                        entry.efectividad >= 40 ? 'bg-yellow-400/20 text-yellow-400' :
                        'bg-red-400/20 text-red-400'
                      }`}>
                        {entry.efectividad}% ef.
                      </span>
                      {entry.distanciaLider > 0 && (
                        <span className="text-xs text-red-400">
                          -{entry.distanciaLider} pts
                        </span>
                      )}
                      {entry.distanciaLider === 0 && idx === 0 && (
                        <span className="text-xs text-amber-400">🏆 Líder</span>
                      )}
                    </div>

                    <button
                      onClick={() => setUsuarioExpandido(isExpanded ? null : entry.usuarioId)}
                      className="w-full mt-3 py-3 text-sm bg-slate-700/50 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors min-h-[48px]"
                    >
                      {isExpanded ? 'Ocultar detalles' : 'Ver detalles'}
                    </button>
                  </div>

                  {/* Detalles expandidos */}
                  {isExpanded && detalles[entry.usuarioId] && (
                    <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 space-y-3">
                      {detalles[entry.usuarioId].exactosList.length > 0 && (
                        <div>
                          <p className="text-xs text-green-400 font-medium mb-1 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Exactos ({entry.exactos})
                          </p>
                          <div className="space-y-1">
                            {detalles[entry.usuarioId].exactosList.map((partido, i) => (
                              <p key={i} className="text-xs text-slate-400">{partido}</p>
                            ))}
                          </div>
                        </div>
                      )}
                      {detalles[entry.usuarioId].winnersList.length > 0 && (
                        <div>
                          <p className="text-xs text-blue-400 font-medium mb-1 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" /> Winners ({entry.winners})
                          </p>
                          <div className="space-y-1">
                            {detalles[entry.usuarioId].winnersList.map((partido, i) => (
                              <p key={i} className="text-xs text-slate-400">{partido}</p>
                            ))}
                          </div>
                        </div>
                      )}
                      {detalles[entry.usuarioId].perdidosList.length > 0 && (
                        <div>
                          <p className="text-xs text-red-400 font-medium mb-1 flex items-center gap-1">
                            <XCircle className="w-3 h-3" /> Errados ({entry.perdidos})
                          </p>
                          <div className="space-y-1">
                            {detalles[entry.usuarioId].perdidosList.map((partido, i) => (
                              <p key={i} className="text-xs text-slate-400">{partido}</p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
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
              Tabla Completa
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
              {leaderboard.slice(3).map((entry, idx) => {
                const isExpanded = usuarioExpandido === entry.usuarioId;
                const posicion = idx + 4;

                return (
                  <div key={entry.usuarioId} className="space-y-2">
                    <div
                      className={`p-5 ${
                        entry.usuarioId === user?.uid ? 'bg-amber-400/10' : ''
                      }`}
                    >
                      {/* Fila principal */}
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-slate-300">
                          {posicion}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-medium text-white truncate">
                              {entry.displayName}
                            </p>
                            {entry.usuarioId === user?.uid && (
                              <span className="text-xs text-amber-400">(Vos)</span>
                            )}
                          </div>

                          {/* Stats row */}
                          <div className="flex items-center gap-3 mt-1 flex-wrap">
                            {/* Partidos jugados */}
                            <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded flex items-center gap-1">
                              <Zap className="w-3 h-3" />
                              {entry.totalJugados}/{totalPartidos}
                            </span>

                            {/* Exactos */}
                            <span className="text-xs text-green-400 flex items-center gap-1">
                              <Target className="w-3 h-3" />
                              {entry.exactos}
                            </span>

                            {/* Winners */}
                            <span className="text-xs text-blue-400 flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              {entry.winners}
                            </span>

                            {/* Errados */}
                            <span className="text-xs text-red-400 flex items-center gap-1">
                              <XCircle className="w-3 h-3" />
                              {entry.perdidos}
                            </span>

                            {/* Efectividad */}
                            <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                              entry.efectividad >= 70 ? 'bg-green-400/20 text-green-400' :
                              entry.efectividad >= 40 ? 'bg-yellow-400/20 text-yellow-400' :
                              'bg-red-400/20 text-red-400'
                            }`}>
                              {entry.efectividad}% ef.
                            </span>
                          </div>
                        </div>

                        {/* Distancia al líder */}
                        {entry.distanciaLider > 0 && (
                          <div className="text-right">
                            <p className="text-xs text-slate-400">del líder</p>
                            <p className="text-sm font-medium text-red-400">
                              -{entry.distanciaLider} pts
                            </p>
                          </div>
                        )}

                        {entry.distanciaLider === 0 && posicion === 1 && (
                          <div className="text-right">
                            <p className="text-xs text-amber-400">🏆 Líder</p>
                          </div>
                        )}

                        {/* Puntos */}
                        <div className="text-right min-w-[60px]">
                          <p className="text-xl font-bold text-amber-400">{entry.puntosTotales}</p>
                          <p className="text-xs text-slate-400">pts</p>
                        </div>

                        {/* Expand button */}
                        <button
                          onClick={() => setUsuarioExpandido(isExpanded ? null : entry.usuarioId)}
                          className="px-4 py-2 text-sm bg-slate-700/50 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                        >
                          {isExpanded ? '▲' : '▼'}
                        </button>
                      </div>
                    </div>

                    {/* Detalles expandidos */}
                    {isExpanded && detalles[entry.usuarioId] && (
                      <div className="mx-4 mb-2 bg-slate-900/50 border border-slate-700 rounded-xl p-4 space-y-3">
                        {detalles[entry.usuarioId].exactosList.length > 0 && (
                          <div>
                            <p className="text-xs text-green-400 font-medium mb-1 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" /> Exactos ({entry.exactos})
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {detalles[entry.usuarioId].exactosList.map((partido, i) => (
                                <span key={i} className="text-xs bg-green-400/10 text-green-400 px-2 py-1 rounded">
                                  {partido}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {detalles[entry.usuarioId].winnersList.length > 0 && (
                          <div>
                            <p className="text-xs text-blue-400 font-medium mb-1 flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" /> Winners ({entry.winners})
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {detalles[entry.usuarioId].winnersList.map((partido, i) => (
                                <span key={i} className="text-xs bg-blue-400/10 text-blue-400 px-2 py-1 rounded">
                                  {partido}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {detalles[entry.usuarioId].perdidosList.length > 0 && (
                          <div>
                            <p className="text-xs text-red-400 font-medium mb-1 flex items-center gap-1">
                              <XCircle className="w-3 h-3" /> Errados ({entry.perdidos})
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {detalles[entry.usuarioId].perdidosList.map((partido, i) => (
                                <span key={i} className="text-xs bg-red-400/10 text-red-400 px-2 py-1 rounded">
                                  {partido}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {entry.totalJugados === 0 && (
                          <p className="text-xs text-slate-500">Sin partidos jugados aún</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}