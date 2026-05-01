'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Save, Check, X, Trophy, Globe } from 'lucide-react';

// Estructura: país -> lista de mejores jugadores
const JUGADORES_POR_PAIS: Record<string, string[]> = {
  'Argentina': [
    'Lionel Messi', 'Lautaro Martínez', 'Julian Álvarez', 'Ángel Di María',
    'Cristian Romero', 'Lisandro Martínez', 'Rodrigo De Paul', 'Giovani Lo Celso',
    'Exequiel Palacios', 'Nicolás Otamendi', 'Emiliano Martínez', 'Germán Pezzella',
  ],
  'Brasil': [
    'Neymar Jr', 'Vinicius Jr', 'Rodri', 'Raphinha', 'Antony',
    'Casemiro', 'Fred', 'Gabriel Jesus', 'Marquinhos', 'Thiago Silva',
    'Alisson Becker', 'Éder Militão',
  ],
  'Francia': [
    'Kylian Mbappé', 'Antoine Griezmann', 'Ousmane Dembélé', 'Kingsley Coman',
    'Eduardo Camavinga', 'Aurélien Tchouaméni', 'N\'Golo Kanté', 'Blaise Matuidi',
    'Raphaël Varane', 'William Saliba', 'Hugo Lloris', 'Theo Hernandez',
  ],
  'Inglaterra': [
    'Harry Kane', 'Phil Foden', 'Bukayo Saka', 'Marcus Rashford', 'Jack Grealish',
    'Declan Rice', 'Jude Bellingham', 'Mason Mount', 'Kyle Walker', 'John Stones',
    'Jordan Pickford', 'Trent Alexander-Arnold',
  ],
  'España': [
    'Pedri', 'Gavi', 'Rodri', 'Ferran Torres', 'Lamine Yamal',
    'Dani Olmo', 'Mikel Oyarzabal', 'Aymeric Laporte', 'Robin Le Normand',
    'Dani Carvajal', 'Unai Simón', 'José Luis Gayà',
  ],
  'Alemania': [
    'Jamal Musiala', 'Florian Wirtz', 'Kai Havertz', 'Leroy Sané', 'Thomas Müller',
    'Ilkay Gündogan', 'Toni Kroos', 'Joshua Kimmich', 'Antonio Rüdiger',
    'Manuel Neuer', 'Jonathan Tah', 'Benedikt Süle',
  ],
  'Italia': [
    'Gianluigi Donnarumma', 'Gianluca Mancini', 'Alessandro Bastoni', 'Leonardo Bonucci',
    'Marcelo Brozovic', 'Nicolò Barella', 'Jorginho', 'Lorenzo Insigne',
    'Ciro Immobile', 'Gianluca Scamacca', 'Federico Chiesa', 'Manuel Locatelli',
  ],
'Portugal': [
    'Cristiano Ronaldo', 'Bruno Fernandes', 'Bernardo Silva', 'João Félix',
    'Rúben Neves', 'Otávio', 'William Carvalho', 'Nuno Mendes',
    'Rúben Dias', 'Pepe', 'Diogo Costa', 'Rafael Leão',
  ],
  'Ghana': [
    'Mohammed Kudus', 'Pierre Kunde', 'André Ayew', 'Jordan Ayew',
    'Tariq Lamptey', 'Iddrisu Baba', 'Edo Abdul", "Daniel Kofi Kyereh',
    'Lawrence Ati', 'Mason United', 'Danlad Asibri', 'Baba Rahman',
  ],
  'Nigeria': [
    'Victor Osimhen', 'Ademola Lookman', 'Kelechi Iheanacho', 'Samuel Chukwueze',
    'Moses Simon', 'Wilfred Ndidi', 'Kamil', 'Olaoluwa Adefemi',
    'Stanley Nwobili', 'Francis Uzoho', 'Chidozie Awaziem', 'Nelson Abe',
  ],
  'Ecuador': [
    'Enner Valencia', 'Pervis Estupiñán', 'Moisés Caicedo', 'Piero Hincapie',
    'Jeremy Sarmiento', 'José Carranza', 'Alan Franco', 'Xavier Arretteaga',
    'Hernán Galíndez', 'Romario Caicedo', 'Leonardo Realpe', 'Adriániez',
  ],
  'Colombia': [
    'Luis Díaz', 'James Rodríguez', 'Juan Cuadrado', 'Radamel Falcao',
    'Julián Álvarez', 'Mateo Kovačić', 'David Ospina', 'Yairo Muñoz',
    'Jorman Mackenzie', 'Sebastián Gómez', 'Óscar Murcia', 'Jherson Cacique',
  ],
  'Chile': [
    'Arturo Vidal', 'Gary Medel', 'Claudio Bravo', 'Marcelo Allende',
    'Ben Brereton', 'Mauricio Isla', 'Gabriel Suazo', 'Gabriel Arias',
    'Leonardo Gil', 'Julián Alfaro', 'Thomas Campodónico', 'Francesco Apostol',
  ],
  'Perú': [
    'Paolo Guerrero', 'André Carrillo', 'Lapadula', 'Cueva',
    'Gallese', 'Valera', 'Trauco', 'Carlos Zambrano',
    'Hidalgo', 'Polo', 'Cartí', 'Yotun',
  ],
  'Qatar': [
    'Almoez Ali', 'Akram Afif', 'Hassan Al-Haydos', 'Al-Mehairi',
    'Bassel', 'Khalid Mrogon', 'Abdelrazzaq', 'Salauddin',
    'Jassem Gaber', 'Sultan Al-Breik', 'Meshaal Barsham', 'Al-Mehairi',
  ],
  'Arabia Saudita': [
    'Saleh Al-Shehri', 'Feras Al-Brikan', ' Salem Al-Dawsari', 'Yasser Al-Shahrani',
    'Mohammed Al-Olayan', 'Hattan Bahbri', 'Ali Al-Habsi', 'Yasser Al-Mosailem',
    'Sami Al-Najei', 'Abdullah Al-Khaibari', 'Musab Al-Juwayr', 'Turki Al-Ammar',
  ],
  'Irán': [
    'Sardar Azmoun', 'Mehdi Taremi', 'Jalal Hosseini', 'Alireza Jahanbakhsh',
    'Roozbeh Cheshmi', 'Seyed Milad Salehi', 'Hossein Hosseini', 'Majid Hosseini',
    'Rashid Mazaheri', 'Sadegh Moharrami', 'Ahmad Nourollahi', 'Ali Gholizadeh',
  ],
};

const PAISES = Object.keys(JUGADORES_POR_PAIS).sort();

export default function PremiosPage() {
  const { user } = useAuth();
  const [paisGoleador, setPaisGoleador] = useState('');
  const [paisAsistidor, setPaisAsistidor] = useState('');
  const [paisMvp, setPaisMvp] = useState('');
  const [jugadorGoleador, setJugadorGoleador] = useState('');
  const [jugadorAsistidor, setJugadorAsistidor] = useState('');
  const [jugadorMvp, setJugadorMvp] = useState('');
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
          if (data.tipo === 'goleador') {
            // Buscar país del jugador
            for (const [pais, jugadores] of Object.entries(JUGADORES_POR_PAIS)) {
              if (jugadores.includes(data.valorPredicho)) {
                setPaisGoleador(pais);
                setJugadorGoleador(data.valorPredicho);
                break;
              }
            }
          }
          if (data.tipo === 'asistidor') {
            for (const [pais, jugadores] of Object.entries(JUGADORES_POR_PAIS)) {
              if (jugadores.includes(data.valorPredicho)) {
                setPaisAsistidor(pais);
                setJugadorAsistidor(data.valorPredicho);
                break;
              }
            }
          }
          if (data.tipo === 'mvp') {
            for (const [pais, jugadores] of Object.entries(JUGADORES_POR_PAIS)) {
              if (jugadores.includes(data.valorPredicho)) {
                setPaisMvp(pais);
                setJugadorMvp(data.valorPredicho);
                break;
              }
            }
          }
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

    if (!jugadorGoleador || !jugadorAsistidor || !jugadorMvp) {
      setMensaje({ tipo: 'error', texto: 'Completá todos los campos' });
      return;
    }

    setGuardando(true);
    setMensaje(null);

    try {
      const premios = [
        { tipo: 'goleador', valor: jugadorGoleador },
        { tipo: 'asistidor', valor: jugadorAsistidor },
        { tipo: 'mvp', valor: jugadorMvp },
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
            Primero seleccioná el país, luego elegí al jugador. Ganá <span className="text-amber-400 font-bold">5 puntos</span> por cada acierto.
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

        {/* Goleador */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mb-4">
          <h2 className="text-lg font-bold text-white mb-4">⚽ Goleador del Torneo</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-2">País</label>
              <select
                value={paisGoleador}
                onChange={(e) => {
                  setPaisGoleador(e.target.value);
                  setJugadorGoleador('');
                }}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <option value="">Seleccioná un país</option>
                {PAISES.map((pais) => (
                  <option key={pais} value={pais}>{pais}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Jugador</label>
              <select
                value={jugadorGoleador}
                onChange={(e) => setJugadorGoleador(e.target.value)}
                disabled={!paisGoleador}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Seleccioná un jugador</option>
                {paisGoleador && JUGADORES_POR_PAIS[paisGoleador]?.map((j) => (
                  <option key={j} value={j}>{j}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Asistidor */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mb-4">
          <h2 className="text-lg font-bold text-white mb-4">🅰️ Asistidor del Torneo</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-2">País</label>
              <select
                value={paisAsistidor}
                onChange={(e) => {
                  setPaisAsistidor(e.target.value);
                  setJugadorAsistidor('');
                }}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <option value="">Seleccioná un país</option>
                {PAISES.map((pais) => (
                  <option key={pais} value={pais}>{pais}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Jugador</label>
              <select
                value={jugadorAsistidor}
                onChange={(e) => setJugadorAsistidor(e.target.value)}
                disabled={!paisAsistidor}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Seleccioná un jugador</option>
                {paisAsistidor && JUGADORES_POR_PAIS[paisAsistidor]?.map((j) => (
                  <option key={j} value={j}>{j}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* MVP */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-bold text-white mb-4">⭐ MVP del Torneo (Balón de Oro)</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-2">País</label>
              <select
                value={paisMvp}
                onChange={(e) => {
                  setPaisMvp(e.target.value);
                  setJugadorMvp('');
                }}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <option value="">Seleccioná un país</option>
                {PAISES.map((pais) => (
                  <option key={pais} value={pais}>{pais}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Jugador</label>
              <select
                value={jugadorMvp}
                onChange={(e) => setJugadorMvp(e.target.value)}
                disabled={!paisMvp}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Seleccioná un jugador</option>
                {paisMvp && JUGADORES_POR_PAIS[paisMvp]?.map((j) => (
                  <option key={j} value={j}>{j}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button
          onClick={guardar}
          disabled={guardando || !jugadorGoleador || !jugadorAsistidor || !jugadorMvp}
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