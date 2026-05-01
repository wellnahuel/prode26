/**
 * Script para cargar partidos con el ID correcto como doc ID en Firebase
 * Arregla el problema de partidoId que no coincidía
 */

import { collection, addDoc, getDocs, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { PARTIDOS_GRUPOS } from '@/data/partidos';

async function cargarPartidos() {
  console.log('🚀 Cargando partidos a Firestore...\n');

  const partidosRef = collection(db, 'partidos');
  const snapshot = await getDocs(partidosRef);

  console.log(`📦 Partidos existentes en Firebase: ${snapshot.size}`);

  // Mostrar algunos IDs para debug
  if (snapshot.size > 0) {
    console.log('\n🔍 IDs actuales en Firebase:');
    snapshot.docs.slice(0, 3).forEach((d) => {
      const data = d.data();
      console.log(`  - Doc ID: "${d.id}" | partido.id: "${data.id}"`);
    });
  }

  console.log('\n🗑️  Limpiando partidos existentes...');
  for (const docSnap of snapshot.docs) {
    await deleteDoc(doc(partidosRef, docSnap.id));
  }

  console.log('\n📝 Cargando partidos con ID correcto...\n');

  let cargados = 0;
  let errores = 0;

  for (const partido of PARTIDOS_GRUPOS) {
    try {
      // Usar partido.id como Firebase doc ID
      await setDoc(doc(partidosRef, partido.id), partido);
      console.log(`✅ ${partido.id}: ${partido.nombreA} vs ${partido.nombreB}`);
      cargados++;
    } catch (error) {
      console.error(`❌ Error cargando ${partido.id}:`, error);
      errores++;
    }
  }

  console.log(`\n✅ Listo! ${cargados} partidos cargados, ${errores} errores.`);
  console.log('\n⚠️  AHORA CORRÉ: npx tsx src/scripts/recargarPredicciones.ts');
  console.log('   para regenerar las predicciones con los IDs correctos.');
}

cargarPartidos().catch(console.error);