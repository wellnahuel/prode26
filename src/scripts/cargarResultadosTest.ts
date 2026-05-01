/**
 * Script para cargar resultados aleatorios en los partidos de fase de grupos
 * Solo para TESTING - NO usar en producción
 */

import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

async function cargarResultadosAleatorios() {
  console.log('🎲 Cargando resultados aleatorios...\n');

  const partidosRef = collection(db, 'partidos');
  const snapshot = await getDocs(partidosRef);

  console.log(`📦 Partidos encontrados: ${snapshot.size}\n`);

  for (const docSnap of snapshot.docs) {
    const partido = docSnap.data();

    // Generar resultado aleatorio (0-4 goles por equipo)
    const golesA = Math.floor(Math.random() * 5);
    const golesB = Math.floor(Math.random() * 5);

    try {
      await updateDoc(doc(partidosRef, docSnap.id), {
        resultado: {
          golesA,
          golesB,
        },
      });

      console.log(
        `⚽ ${partido.grupo} - ${partido.nombreA} ${golesA} vs ${golesB} ${partido.nombreB}`
      );
    } catch (error) {
      console.error(`❌ Error actualizando ${docSnap.id}:`, error);
    }
  }

  console.log('\n✅ Resultados cargados!');
  console.log('📊 Ahora podes ver los puntos en la tabla de posiciones.');
}

cargarResultadosAleatorios().catch(console.error);