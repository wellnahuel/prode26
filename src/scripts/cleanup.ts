/**
 * Script para limpiar Firestore de datos de test
 * Uso: npx tsx src/scripts/cleanup.ts
 *
 * Qué hace:
 * - Borra todos los documentos de pronosticos
 * - Borra todos los documentos de pronosticosPremios
 * - Resetea el campo resultado de todos los partidos (vuelve a null)
 * - NO borra usuarios de Authentication
 * - NO borra config/admin
 */

import { collection, getDocs, doc, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase';

async function cleanup() {
  console.log('🧹 LIMPIEZA DE FIREBASE PARA PRODUCCIÓN\n');
  console.log('='.repeat(50) + '\n');

  // 1. Limpiar pronosticos
  console.log('📋 Limpiando colección pronosticos...');
  const pronosticosRef = collection(db, 'pronosticos');
  const pronosticosSnap = await getDocs(pronosticosRef);
  console.log(`   Encontrados: ${pronosticosSnap.size} documentos`);

  if (pronosticosSnap.size > 0) {
    const batch = writeBatch(db);
    pronosticosSnap.docs.forEach((d) => batch.delete(doc(db, 'pronosticos', d.id)));
    await batch.commit();
    console.log('   ✅ Pronosticos borrados\n');
  } else {
    console.log('   ℹ️  Ya estaba vacío\n');
  }

  // 2. Limpiar pronosticosPremios
  console.log('📋 Limpiando colección pronosticosPremios...');
  const premiosRef = collection(db, 'pronosticosPremios');
  const premiosSnap = await getDocs(premiosRef);
  console.log(`   Encontrados: ${premiosSnap.size} documentos`);

  if (premiosSnap.size > 0) {
    const batch = writeBatch(db);
    premiosSnap.docs.forEach((d) => batch.delete(doc(db, 'pronosticosPremios', d.id)));
    await batch.commit();
    console.log('   ✅ PronosticosPremios borrados\n');
  } else {
    console.log('   ℹ️  Ya estaba vacío\n');
  }

  // 3. Resetear resultados de partidos
  console.log('📋 Reseteando resultados de partidos...');
  const partidosRef = collection(db, 'partidos');
  const partidosSnap = await getDocs(partidosRef);
  console.log(`   Encontrados: ${partidosSnap.size} partidos`);

  let reseteados = 0;
  const batch = writeBatch(db);
  partidosSnap.docs.forEach((d) => {
    const data = d.data();
    if (data.resultado && (data.resultado.golesA !== null || data.resultado.golesB !== null)) {
      batch.update(doc(db, 'partidos', d.id), { resultado: null });
      reseteados++;
    }
  });

  if (reseteados > 0) {
    await batch.commit();
    console.log(`   ✅ ${reseteados} partidos con resultado reseteado a null\n`);
  } else {
    console.log('   ℹ️  Todos los partidos ya tenían resultado null\n');
  }

  console.log('='.repeat(50));
  console.log('✅ LIMPIEZA COMPLETA');
  console.log('\n📝 Ahora tu Firestore está limpio para producción.');
  console.log('   - Los partidos tienen estructura pero sin resultados');
  console.log('   - Las predicciones están vacías');
  console.log('   - Los usuarios en Authentication siguen ahí');
  console.log('   - La config de admin está intacta');
}

cleanup().catch(console.error);
