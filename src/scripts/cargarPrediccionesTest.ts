/**
 * Script para cargar predicciones de TEST para el usuario actual
 * Genera predicciones aleatorias para todos los partidos
 */

import { collection, addDoc, getDocs, deleteDoc, query, where, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

async function cargarPrediccionesTest(email: string, password: string) {
  console.log('🔐 Login...');

  const auth = getAuth();
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  console.log(`✅ Logueado como: ${user.uid}\n`);

  // Limpiar predicciones existentes
  console.log('🧹 Limpiando predicciones existentes...');
  const pronosticosRef = collection(db, 'pronosticos');
  const existing = await getDocs(query(pronosticosRef, where('usuarioId', '==', user.uid)));
  for (const docSnap of existing.docs) {
    await deleteDoc(doc(pronosticosRef, docSnap.id));
  }

  // Obtener partidos
  console.log('📋 Obteniendo partidos...');
  const partidosSnap = await getDocs(collection(db, 'partidos'));
  const partidos = partidosSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  console.log(`🎲 Cargando ${partidos.length} predicciones aleatorias...\n`);

  for (const partido of partidos) {
    // Generar predicción aleatoria
    const golesA = Math.floor(Math.random() * 5);
    const golesB = Math.floor(Math.random() * 5);

    await addDoc(pronosticosRef, {
      usuarioId: user.uid,
      partidoId: partido.id,
      golesPredichoA: golesA,
      golesPredichoB: golesB,
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    });

    console.log(`⚽ ${partido.id}: predijo ${golesA} vs ${golesB}`);
  }

  console.log('\n✅ Predicciones cargadas!');
  console.log('📊 Ve a Posiciones para ver tu puntaje.');
}

// Uso: npx tsx src/scripts/cargarPrediccionesTest.ts tu@email.com tuPassword
const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.log('Usage: npx tsx src/scripts/cargarPrediccionesTest.ts <email> <password>');
} else {
  cargarPrediccionesTest(email, password).catch(console.error);
}