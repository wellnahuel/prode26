'use client';

import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Partido, Pronostico } from '@/types';

export function usePartidos() {
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'partidos'), orderBy('fechaInicio', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Partido[] = [];
      snapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() } as Partido));
      setPartidos(data);
      setLoading(false);
    }, (err) => {
      console.error('Error:', err);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { partidos, loading };
}

export function useMisPronosticos(usuarioId: string | undefined) {
  const [pronosticos, setPronosticos] = useState<Pronostico[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!usuarioId) {
      setPronosticos([]);
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'pronosticos'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Pronostico[] = [];
      snapshot.forEach((doc) => {
        const pronostico = { id: doc.id, ...doc.data() } as Pronostico;
        if (pronostico.usuarioId === usuarioId) {
          data.push(pronostico);
        }
      });
      setPronosticos(data);
      setLoading(false);
    }, () => setLoading(false));

    return unsubscribe;
  }, [usuarioId]);

  return { pronosticos, loading };
}