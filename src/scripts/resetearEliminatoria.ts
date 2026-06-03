import { doc, updateDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';

/**
 * Script para resetear partidos de eliminatoria a "TBD"
 * Uso: npx tsx src/scripts/resetearEliminatoria.ts
 * 
 * Esto deja todos los partidos de eliminatoria sin equipos asignados,
 * para poder cargarlos manualmente uno por uno después de la fase de grupos.
 */

async function resetearEliminatoria() {
  console.log('🧹 Reseteando partidos de eliminatoria...\n');

  const partidosSnap = await getDocs(collection(db, 'partidos'));
  const eliminatorios = partidosSnap.docs.filter((d) => d.data().fase === 'eliminatoria');

  console.log(`📋 Partidos de eliminatoria encontrados: ${eliminatorios.length}\n`);

  let reseteados = 0;
  let errores = 0;

  for (const partidoDoc of eliminatorios) {
    const data = partidoDoc.data();
    const numero = data.numero;
    const ronda = data.ronda;

    try {
      await updateDoc(doc(db, 'partidos', partidoDoc.id), {
        equipoA: 'TBD',
        equipoB: 'TBD',
        nombreA: 'Por definir',
        nombreB: 'Por definir',
      });

      console.log(`   ✅ M${numero} (${ronda}): reseteado`);
      reseteados++;
    } catch (error) {
      console.log(`   ❌ Error M${numero}: ${error}`);
      errores++;
    }
  }

  console.log(`\n✨ Resumen:`);
  console.log(`   ✅ Reseteados: ${reseteados}`);
  console.log(`   ❌ Errores: ${errores}`);
  console.log('\n📝 Ahora podés ir cargando los equipos manualmente desde Firebase Console');
  console.log('   o esperar a que termine la fase de grupos para asignarlos todos de golpe.');
}

resetearEliminatoria().catch(console.error);