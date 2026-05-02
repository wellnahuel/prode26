'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import { Target, Trophy, Calendar, Users } from 'lucide-react';

export default function DashboardPage() {
  const { user, usuarioData } = useAuth();
  const [participantes, setParticipantes] = useState('-');
  const [misPronosticos, setMisPronosticos] = useState(0);
  const [misPuntos, setMisPuntos] = useState(0);

  useEffect(() => {
    async function cargarDatos() {
      // Cargar participantes
      try {
        const usuariosSnap = await getDocs(collection(db, 'usuarios'));
        setParticipantes(usuariosSnap.size.toString());
      } catch (error) {
        console.error('Error cargando participantes:', error);
      }

      // Cargar mis pronósticos y puntos
      if (user) {
        try {
          // Cantidad de pronósticos del usuario
          const pronosticosQuery = query(
            collection(db, 'pronosticos'),
            where('usuarioId', '==', user.uid)
          );
          const pronosticosSnap = await getDocs(pronosticosQuery);
          setMisPronosticos(pronosticosSnap.size);

          // Calcular puntos del usuario
          // Necesito cargar sus pronósticos y calcular puntos
          const pronosticos = pronosticosSnap.docs.map((doc) => doc.data());

          // Cargar partidos con resultado
          const partidosSnap = await getDocs(collection(db, 'partidos'));
          const partidosConResultado = partidosSnap.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .filter((p: any) => p.resultado);

          let puntos = 0;
          for (const pronostico of pronosticos) {
            const partido = partidosConResultado.find((p: any) => p.id === pronostico.partidoId);
            if (partido && partido.resultado) {
              const realA = partido.resultado.golesA;
              const realB = partido.resultado.golesB;
              const predA = pronostico.golesPredichoA;
              const predB = pronostico.golesPredichoB;

              // Exacto
              if (realA === predA && realB === predB) {
                puntos += 5;
              } else {
                // Winner
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
                  puntos += 2;
                }
              }
            }
          }

          setMisPuntos(puntos);
        } catch (error) {
          console.error('Error cargando datos del usuario:', error);
        }
      }
    }

    cargarDatos();
  }, [user]);

  return (
    <div className="px-4 py-6">
      <div className="bg-gradient-to-r from-amber-400/10 to-amber-500/5 border border-amber-400/20 rounded-2xl p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-400/20 rounded-xl">
            <Trophy className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white mb-1">
              ¡Bienvenido, {usuarioData?.displayName || user?.displayName}! 🏆
            </h2>
            <p className="text-slate-300 text-sm">
              Predicí los resultados del Mundial y competí con tus amigos.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center">
          <Target className="w-6 h-6 text-amber-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{misPronosticos}</p>
          <p className="text-xs text-slate-400">Pronósticos</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center">
          <Calendar className="w-6 h-6 text-amber-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">72</p>
          <p className="text-xs text-slate-400">Partidos</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center">
          <Trophy className="w-6 h-6 text-amber-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{misPuntos}</p>
          <p className="text-xs text-slate-400">Puntos</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center">
          <Users className="w-6 h-6 text-amber-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{participantes}</p>
          <p className="text-xs text-slate-400">Participantes</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <Link
          href="/dashboard/pronosticos"
          className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-amber-400/20 flex items-center justify-center gap-3"
        >
          <Target className="w-6 h-6" />
          Cargar Pronósticos
        </Link>
        <Link
          href="/dashboard/posiciones"
          className="bg-slate-800 hover:bg-slate-700 text-white font-medium py-4 px-6 rounded-xl transition-all border border-slate-700 flex items-center justify-center gap-3"
        >
          <Trophy className="w-6 h-6 text-amber-400" />
          Ver Tabla de Posiciones
        </Link>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <h3 className="font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-400" />
            Información
          </h3>
        </div>
        <div className="p-6 text-center text-slate-400">
          <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>El Mundial 2026 comienza el 11 de junio</p>
          <p className="text-sm mt-1">Primero cargá los partidos a Firebase</p>
        </div>
      </div>
    </div>
  );
}