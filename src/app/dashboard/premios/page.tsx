'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { doc, setDoc, getDocs, collection, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Save, Check, X, Trophy } from 'lucide-react';

// Lista de jugadores candidatos
export const JUGADORES_GOLEADOR = [
  'Lionel Messi', 'Kylian Mbappé', 'Harry Kane', 'Erling Haaland',
  'Cristiano Ronaldo', 'Neymar Jr', 'Karim Benzema', 'Robert Lewandowski',
  'Lautaro Martínez', 'Julian Álvarez', 'Vinicius Jr', 'Rodri',
  'Phil Foden', 'Bukayo Saka', 'Mohamed Salah', 'Victor Osimhen',
];

export const JUGADORES_ASISTIDOR = [
  'Kevin De Bruyne', 'Bruno Fernandes', 'Lionel Messi', 'Neymar Jr',
  'Kylian Mbappé', 'Phil Foden', 'Bukayo Saka', 'Vinicius Jr',
  'Lautaro Martínez', 'Julian Álvarez', 'Mohamed Salah', 'Rodri',
  'Bernardo Silva', 'Pedri', 'Gavi', 'Federico Valverde',
];

export const JUGADORES_MVP = [
  'Lionel Messi', 'Kylian Mbappé', 'Erling Haaland', 'Kevin De Bruyne',
  'Vinicius Jr', 'Rodri', 'Phil Foden', 'Jude Bellingham',
  'Harry Kane', 'Neymar Jr', 'Lautaro Martínez', 'Julian Álvarez',
  'Florian Wirtz', 'Pedri', 'Gavi', 'Federico Valverde',
];

export default function PremiosPage() {
  const { user } = useAuth();
  const [goleador, setGoleador] = useState('');
  const [asistidor, setAsistidor] = useState('');
  const [mvp, setMvp] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);
  const [cargado, setCargado] = useState(false);

  useEffect(() => {
    if (!user) return;

    async function cargarExistentes() {
      try {
        const q = query(collection(db, 'pronosticosPremios'), where('usuarioId', '==', user.uid));
        const snap = await getDocs(q);

        snap.forEach((docSnap) => {
          const data = docSnap.data();
          if (data.tipo === 'goleador') setGoleador(data.valorPredicho);
          if (data.tipo === 'asistidor') setAsistidor(data.valorPredicho);
          if (data.tipo === 'mvp') setMvp(data.valorPredicho);
        });

        if (!snap.empty) setCargado(true);
      } catch (error) {
        console.error('Error:', error);
      }
    }

    cargarExistentes();
  }, [user]);

  const guardar = async () => {
    if (!user) return;

    if (!goleador || !asistidor || !mvp) {
      setMensaje({ tipo: 'error', texto: 'Completá todos los campos' });
      return;
    }

    setGuardando(true);
    setMensaje(null);

    try {
      const premios = [
        { tipo: 'goleador', valor: goleador },
        { tipo: 'asistidor', valor: asistidor },
        { tipo: 'mvp', valor: mvp },
      ];

      for (const premio of premios) {
        const q = query(
          collection(db, 'pronosticosPremios'),
          where('usuarioId', '==', user.uid),
          where('tipo', '==', premio.tipo)
        );
        const existing = await getDocs(q);

        if (existing.empty) {
          await setDoc(doc(collection(db, 'pronosticosPremios')), {
            usuarioId: user.uid,
            tipo: premio.tipo,
            valorPredicho: premio.valor,
            creadoEn: new Date(),
          });
        } else {
          await setDoc(doc(db, 'pronosticosPremios', existing.docs[0].id), {
            valorPredicho: premio.valor,
          }, { merge: true });
        }
      }

      setMensaje({ tipo: 'success', texto: '¡Premios guardados!' });
      setCargado(true);
    } catch (error) {
      console.error('Error:', error);
      setMensaje({ tipo: 'error', texto: 'Error al guardar' });
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <header className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-amber-400" />
            <div>
              <h1 className="text-xl font-bold text-white">Premios Especiales</h1>
              <p className="text-xs text-slate-400">5 puntos por cada acierto</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-amber-400/10 border border-amber-400/20 rounded-2xl p-4 mb-6">
          <p className="text-amber-400 font-medium mb-1">🏆 Pronosticá los premios individuales</p>
          <p className="text-slate-300 text-sm">
            Acertá el goleador, asistidor o MVP del torneo y ganá <span className="text-amber-400 font-bold">5 puntos</span> por cada uno.
          </p>
        </div>

        {mensaje && (
          <div className={`mb-4 p-4 rounded-xl flex items-center gap-3 ${
            mensaje.tipo === 'success'
              ? 'bg-green-500/20 border border-green-500/50 text-green-400'
              : 'bg-red-500/20 border border-red-500/50 text-red-400'
          }`}>
            {mensaje.tipo === 'success' ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
            {mensaje.texto}
          </div>
        )}

        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mb-4">
          <h2 className="text-lg font-bold text-white mb-4">⚽ Goleador del Torneo</h2>
          <select
            value={goleador}
            onChange={(e) => setGoleador(e.target.value)}
            className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <option value="">Seleccioná un jugador</option>
            {JUGADORES_GOLEADOR.map((j) => (
              <option key={j} value={j}>{j}</option>
            ))}
          </select>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mb-4">
          <h2 className="text-lg font-bold text-white mb-4">🅰️ Asistidor del Torneo</h2>
          <select
            value={asistidor}
            onChange={(e) => setAsistidor(e.target.value)}
            className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <option value="">Seleccioná un jugador</option>
            {JUGADORES_ASISTIDOR.map((j) => (
              <option key={j} value={j}>{j}</option>
            ))}
          </select>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-bold text-white mb-4">⭐ MVP del Torneo (Balón de Oro)</h2>
          <select
            value={mvp}
            onChange={(e) => setMvp(e.target.value)}
            className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <option value="">Seleccioná un jugador</option>
            {JUGADORES_MVP.map((j) => (
              <option key={j} value={j}>{j}</option>
            ))}
          </select>
        </div>

        <button
          onClick={guardar}
          disabled={guardando || !goleador || !asistidor || !mvp}
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
              Guardar Pronósticos de Premios
            </>
          )}
        </button>

        {cargado && (
          <p className="text-center text-slate-400 text-sm mt-4">
            ✓ Ya tenés tus premios cargados. Podés cambiarlos.
          </p>
        )}
      </main>
    </div>
  );
}