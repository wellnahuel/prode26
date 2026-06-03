import { collection, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

async function limpiarUsuarios() {
  console.log('🧹 Limpiando coleccion usuarios...\n');

  const snap = await getDocs(collection(db, 'usuarios'));
  console.log(`📋 Usuarios encontrados: ${snap.size}`);

  let borrados = 0;
  for (const doc of snap.docs) {
    await deleteDoc(doc.ref);
    console.log(`   ✅ Borrado: ${doc.id} - ${doc.data().displayName || 'sin nombre'}`);
    borrados++;
  }

  console.log(`\n✨ ${borrados} usuarios borrados de Firestore`);
}

limpiarUsuarios().catch(console.error);