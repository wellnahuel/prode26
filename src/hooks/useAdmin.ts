import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface ConfigAdmin {
  adminUid: string;
  pozoPorcentaje1: number;
  pozoPorcentaje2: number;
  pozoPorcentaje3: number;
  inscripcionEuros: number;
  pozoTotal: number;
}

export async function isAdmin(uid: string): Promise<boolean> {
  try {
    const snap = await getDoc(doc(db, 'config', 'admin'));
    if (snap.exists()) {
      const data = snap.data() as ConfigAdmin;
      return data.adminUid === uid;
    }
    return false;
  } catch (error) {
    console.error('Error checking admin:', error);
    return false;
  }
}

export async function getConfigAdmin(): Promise<ConfigAdmin | null> {
  try {
    const snap = await getDoc(doc(db, 'config', 'admin'));
    if (snap.exists()) {
      return snap.data() as ConfigAdmin;
    }
    return null;
  } catch (error) {
    console.error('Error getting config:', error);
    return null;
  }
}