/**
 * Script para regenerar TODAS las predicciones de TODOS los usuarios
 * Usa los IDs correctos de partidos
 */

import { collection, getDocs, deleteDoc, doc, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

async function recargarPredicciones() {
  console.log('🔄 Recargando TODAS las predicciones...\n');

  const partidosRef = collection(db, 'partidos');
  const pronosticosRef = collection(db, 'pronosticos');

  // Obtener todos los partidos
  const partidosSnap = await getDocs(partidosRef);
  const partidos = partidosSnap.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));

  console.log(`📋 Partidos en Firebase: ${partidos.length}`);

  if (partidos.length === 0) {
    console.log('❌ No hay partidos! Primero correr cargarPartidosCorregido.ts');
    return;
  }

  // Obtener todos los usuarios
  const usuariosSnap = await getDocs(collection(db, 'usuarios'));
  console.log(`👥 Usuarios: ${usuariosSnap.size}\n`);

  // Obtener todos los pronósticos existentes
  const pronosticosSnap = await getDocs(pronosticosRef);
  console.log(`📝 Pronósticos existentes: ${pronosticosSnap.size}`);

  // Limpiar TODOS los pronósticos
  console.log('🧹 Limpiando pronósticosexistentes...');
  for (const docSnap of pronosticosSnap.docs) {
    await deleteDoc(doc(pronosticosRef, docSnap.id));
  }

  // Regenerar predicciones para cada usuario
  for (const usuarioDoc of usuariosSnap.docs) {
    const usuario = { uid: usuarioDoc.id, ...usuarioDoc.data() };
    console.log(`\n👤 Usuario: ${usuario.displayName || usuario.email}`);

    for (const partido of partidos) {
      // Generar predicción aleatoria
      const golesA = Math.floor(Math.random() * 5);
      const golesB = Math.floor(Math.random() * 5);

      await addDoc(pronosticosRef, {
        usuarioId: usuario.uid,
        partidoId: partido.id, // Usar partido.id como ID del doc
        golesPredichoA: golesA,
        golesPredichoB: golesB,
        creadoEn: new Date(),
        actualizadoEn: new Date(),
      });

      console.log(`  ⚽ ${partido.id}: predijo ${golesA}-${golesB}`);
    }
  }

  console.log('\n✅ TODAS las predicciones fueron regeneradas!');
  console.log('📊 Ve a Posiciones para ver los puntajes.');
}

recargarPredicciones().catch(console.error);