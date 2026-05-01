import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { PARTIDOS_GRUPOS } from '@/data/partidos';

async function cargarPartidos() {
  console.log('🚀 Cargando partidos a Firestore...\n');

  const partidosRef = collection(db, 'partidos');
  const snapshot = await getDocs(partidosRef);

  console.log(`📦 Partidos existentes: ${snapshot.size}`);

  if (snapshot.size > 0) {
    console.log('🗑️  Limpiando...');
    for (const docSnap of snapshot.docs) {
      await deleteDoc(doc(partidosRef, docSnap.id));
    }
  }

  console.log('\n📝 Cargando partidos...\n');

  for (const partido of PARTIDOS_GRUPOS) {
    try {
      await addDoc(partidosRef, partido);
      console.log(`✅ ${partido.grupo} - ${partido.nombreA} vs ${partido.nombreB}`);
    } catch (error) {
      console.error(`❌ Error:`, error);
    }
  }

  console.log(`\n✅ Listo! ${PARTIDOS_GRUPOS.length} partidos cargados.`);
}

cargarPartidos().catch(console.error);