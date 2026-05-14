'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { collection, doc, getDocs, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Shield, DollarSign, Users, Trophy, Calendar, Check, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface ConfigAdmin {
  adminUid: string;
  pozoPorcentaje1: number;
  pozoPorcentaje2: number;
  pozoPorcentaje3: number;
  inscripcionEuros: number;
  pozoTotal: number;
}

export default function AdminPage() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<ConfigAdmin | null>(null);
  const [participantesCount, setParticipantesCount] = useState(0);

  const [pozo1, setPozo1] = useState(50);
  const [pozo2, setPozo2] = useState(30);
  const [pozo3, setPozo3] = useState(20);
  const [guardandoConfig, setGuardandoConfig] = useState(false);
  const [mensajeConfig, setMensajeConfig] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);

  useEffect(() => {
    async function checkAdmin() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const snap = await getDoc(doc(db, 'config', 'admin'));
        if (snap.exists()) {
          const data = snap.data() as ConfigAdmin;
          setIsAdmin(data.adminUid === user.uid);
          setConfig(data);
          setPozo1(data.pozoPorcentaje1);
          setPozo2(data.pozoPorcentaje2);
          setPozo3(data.pozoPorcentaje3);
        } else {
          setIsAdmin(false);
        }

        const usuariosSnap = await getDocs(collection(db, 'usuarios'));
        setParticipantesCount(usuariosSnap.size);
      } catch {
        console.error('Error checking admin');
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    }

    checkAdmin();
  }, [user]);

  const guardarConfigPozo = async () => {
    if (pozo1 + pozo2 + pozo3 !== 100) {
      setMensajeConfig({ tipo: 'error', texto: 'Los porcentajes deben sumar 100' });
      return;
    }

    setGuardandoConfig(true);
    setMensajeConfig(null);

    try {
      const pozoTotalCalculado = participantesCount * 25;
      await updateDoc(doc(db, 'config', 'admin'), {
        pozoPorcentaje1: pozo1,
        pozoPorcentaje2: pozo2,
        pozoPorcentaje3: pozo3,
        inscripcionEuros: 25,
        pozoTotal: pozoTotalCalculado,
        actualizadoEl: new Date(),
      });

      setConfig({
        ...config!,
        pozoPorcentaje1: pozo1,
        pozoPorcentaje2: pozo2,
        pozoPorcentaje3: pozo3,
        inscripcionEuros: 25,
        pozoTotal: pozoTotalCalculado,
      });

      setMensajeConfig({ tipo: 'success', texto: 'Configuración guardada' });
    } catch {
      setMensajeConfig({ tipo: 'error', texto: 'Error guardando configuración' });
    } finally {
      setGuardandoConfig(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-400 border-t-transparent"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Acceso Denegado</h1>
          <p className="text-slate-400 mb-6">No tenés permisos de administrador.</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold rounded-xl transition-all"
          >
            ← Volver al Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const pozoTotalCalculado = participantesCount * 25;
  const premio1 = Math.round(pozoTotalCalculado * pozo1 / 100);
  const premio2 = Math.round(pozoTotalCalculado * pozo2 / 100);
  const premio3 = Math.round(pozoTotalCalculado * pozo3 / 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <header className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-amber-400" />
            <div>
              <h1 className="text-xl font-bold text-white">Panel de Administración</h1>
              <p className="text-xs text-slate-400">Configuración del Prode 2026</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Stats overview */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center">
            <Users className="w-6 h-6 text-amber-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{participantesCount}</p>
            <p className="text-xs text-slate-400">Participantes</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center">
            <DollarSign className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{pozoTotalCalculado}€</p>
            <p className="text-xs text-slate-400">Pozo Total</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center">
            <Trophy className="w-6 h-6 text-amber-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{config?.inscripcionEuros || 25}€</p>
            <p className="text-xs text-slate-400">Por persona</p>
          </div>
        </div>

        {/* Configuración del pozo */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-400" />
            Configuración del Pozo
          </h2>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm text-slate-400 mb-2">1° Puesto (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={pozo1}
                onChange={(e) => setPozo1(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-center text-lg font-bold focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <p className="text-center text-sm text-green-400 mt-1">{premio1}€</p>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">2° Puesto (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={pozo2}
                onChange={(e) => setPozo2(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-center text-lg font-bold focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <p className="text-center text-sm text-blue-400 mt-1">{premio2}€</p>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">3° Puesto (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={pozo3}
                onChange={(e) => setPozo3(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-center text-lg font-bold focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <p className="text-center text-sm text-orange-400 mt-1">{premio3}€</p>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <p className={`text-sm ${pozo1 + pozo2 + pozo3 === 100 ? 'text-green-400' : 'text-red-400'}`}>
              Total: {pozo1 + pozo2 + pozo3}% (debe ser 100)
            </p>
            <p className="text-sm text-slate-400">
              Basado en {participantesCount} participantes × 25€
            </p>
          </div>

          {mensajeConfig && (
            <div className={`mb-4 p-3 rounded-xl flex items-center gap-2 ${
              mensajeConfig.tipo === 'success'
                ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                : 'bg-red-500/20 border border-red-500/50 text-red-400'
            }`}>
              {mensajeConfig.tipo === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              {mensajeConfig.texto}
            </div>
          )}

          <button
            onClick={guardarConfigPozo}
            disabled={guardandoConfig || pozo1 + pozo2 + pozo3 !== 100}
            className="w-full py-3 px-6 bg-amber-400 hover:bg-amber-300 disabled:bg-amber-400/50 disabled:cursor-not-allowed text-slate-900 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {guardandoConfig ? 'Guardando...' : 'Guardar Configuración'}
          </button>
        </div>

        {/* Acceso rápido a scripts */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-400" />
            Herramientas
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-700/30 rounded-xl p-4">
              <h3 className="text-white font-medium mb-2">Cargar Resultados</h3>
              <p className="text-xs text-slate-400 mb-3">Para cargar resultados de partidos, usar scripts de Firebase.</p>
              <div className="bg-slate-800 rounded-lg p-3 font-mono text-xs text-slate-300">
                npx tsx src/scripts/cargarResultadosTest.ts
              </div>
            </div>

            <div className="bg-slate-700/30 rounded-xl p-4">
              <h3 className="text-white font-medium mb-2">Ver Config</h3>
              <p className="text-xs text-slate-400 mb-3">Ver la configuración actual en Firestore.</p>
              <div className="bg-slate-800 rounded-lg p-3 font-mono text-xs text-slate-300">
                npx tsx src/scripts/inicializarAdmin.ts --ver
              </div>
            </div>

            <div className="bg-slate-700/30 rounded-xl p-4">
              <h3 className="text-white font-medium mb-2">Reiniciar Predicciones</h3>
              <p className="text-xs text-slate-400 mb-3">Regenera todas las predicciones de usuarios.</p>
              <div className="bg-slate-800 rounded-lg p-3 font-mono text-xs text-slate-300">
                npx tsx src/scripts/recargarPredicciones.ts
              </div>
            </div>

            <div className="bg-slate-700/30 rounded-xl p-4">
              <h3 className="text-white font-medium mb-2">Diagnosticar</h3>
              <p className="text-xs text-slate-400 mb-3">Debug de datos en Firestore.</p>
              <div className="bg-slate-800 rounded-lg p-3 font-mono text-xs text-slate-300">
                npx tsx src/scripts/diagnosticar.ts
              </div>
            </div>
          </div>
        </div>

        {/* Volver */}
        <div className="text-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-all"
          >
            ← Volver al Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}