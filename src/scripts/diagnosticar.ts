/**
 * Script de diagnóstico: verificar datos y cálculos de puntos
 */

import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Partido {
  id: string;
  fase: string;
  grupo: string;
  fechaInicio: FirebaseFirestore.Timestamp;
  equipoA: string;
  equipoB: string;
  nombreA: string;
  nombreB: string;
  resultado?: { golesA: number; golesB: number };
  estadio: string;
}

interface Pronostico {
  id: string;
  usuarioId: string;
  partidoId: string;
  golesPredichoA: number;
  golesPredichoB: number;
}

async function diagnosticar() {
  console.log('🔍 DIAGNÓSTICO DE DATOS\n');
  console.log('='.repeat(50));

  // 1. Ver partidos
  console.log('\n📋 PARTIDOS:');
  const partidosSnap = await getDocs(collection(db, 'partidos'));
  console.log(`Total: ${partidosSnap.size} partidos\n`);

  if (partidosSnap.size > 0) {
    const primerPartido = partidosSnap.docs[0];
    const data = primerPartido.data();
    console.log('Primer partido:');
    console.log(`  Doc ID: "${primerPartido.id}"`);
    console.log(`  data.id: "${data.id}"`);
    console.log(`  equipoA: "${data.equipoA}"`);
    console.log(`  equipoB: "${data.equipoB}"`);
    console.log(`  resultado:`, data.resultado);
    console.log(`  tiene resultado: ${!!data.resultado}`);
  }

  // 2. Ver pronósticos
  console.log('\n' + '='.repeat(50));
  console.log('\n📝 PRONÓSTICOS:');
  const pronosticosSnap = await getDocs(collection(db, 'pronosticos'));
  console.log(`Total: ${pronosticosSnap.size} pronosticos\n`);

  if (pronosticosSnap.size > 0) {
    const primerPronostico = pronosticosSnap.docs[0];
    const data = primerPronostico.data();
    console.log('Primer pronóstico:');
    console.log(`  usuarioId: "${data.usuarioId}"`);
    console.log(`  partidoId: "${data.partidoId}"`);
    console.log(`  golesPredichoA: ${data.golesPredichoA}`);
    console.log(`  golesPredichoB: ${data.golesPredichoB}`);
  }

  // 3. Verificar match entre partidoId y doc ID
  console.log('\n' + '='.repeat(50));
  console.log('\n🔗 VERIFICACIÓN DE MATCH:');

  const partidos = partidosSnap.docs.map((doc) => ({
    docId: doc.id,
    dataId: doc.data().id,
    nombre: `${doc.data().nombreA} vs ${doc.data().nombreB}`,
    tieneResultado: !!doc.data().resultado,
  }));

  const partidoEjemplo = partidos[0];
  console.log(`\nPartido ejemplo (${partidoEjemplo.nombre}):`);
  console.log(`  Doc ID en Firebase: "${partidoEjemplo.docId}"`);
  console.log(`  ID dentro del doc:  "${partidoEjemplo.dataId}"`);
  console.log(`  Son iguales? ${partidoEjemplo.docId === partidoEjemplo.dataId ? '✅ SÍ' : '❌ NO'}`);

  // 4. Calcular puntos de un usuario ejemplo
  console.log('\n' + '='.repeat(50));
  console.log('\n🧮 CÁLCULO DE PUNTOS (usuario ejemplo):');

  const usuariosSnap = await getDocs(collection(db, 'usuarios'));
  if (usuariosSnap.size > 0) {
    const primerUsuario = usuariosSnap.docs[0];
    const userId = primerUsuario.id;
    console.log(`\nUsuario: ${userId}`);
    console.log(`Display name: ${primerUsuario.data().displayName}`);

    const misPronosticos = pronosticosSnap.docs
      .filter((doc) => doc.data().usuarioId === userId)
      .map((doc) => doc.data() as Pronostico);

    console.log(`Pronósticos del usuario: ${misPronosticos.length}`);

    let puntosTotales = 0;
    let exactos = 0;
    let winners = 0;
    let perdidos = 0;

    for (const pronostico of misPronosticos) {
      // Buscar partido
      const partidoDoc = partidosSnap.docs.find((doc) => doc.id === pronostico.partidoId);

      if (!partidoDoc) {
        console.log(`  ⚠️ Partido no encontrado: "${pronostico.partidoId}"`);
        continue;
      }

      const partidoData = partidoDoc.data() as Partido;

      if (!partidoData.resultado) {
        console.log(`  ⏳ Partido sin resultado: ${partidoData.nombreA} vs ${partidoData.nombreB}`);
        continue;
      }

      const { golesA: realA, golesB: realB } = partidoData.resultado;
      const { golesPredichoA, golesPredichoB } = pronostico;

      const esExacto = realA === golesPredichoA && realB === golesPredichoB;
      const prediceGanadorA = golesPredichoA > golesPredichoB;
      const prediceGanadorB = golesPredichoB > golesPredichoA;
      const prediceEmpate = golesPredichoA === golesPredichoB;
      const realGanadorA = realA > realB;
      const realGanadorB = realB > realA;
      const realEmpate = realA === realB;
      const esGanadorCorrecto =
        (prediceGanadorA && realGanadorA) ||
        (prediceGanadorB && realGanadorB) ||
        (prediceEmpate && realEmpate);

      let puntos = 0;
      if (esExacto) {
        puntos = 5;
        exactos++;
      } else if (esGanadorCorrecto) {
        puntos = 2;
        winners++;
      } else {
        perdidos++;
      }

      puntosTotales += puntos;

      console.log(`  ${partidoData.nombreA} vs ${partidoData.nombreB}:`);
      console.log(`    Real: ${realA}-${realB} | Predicho: ${golesPredichoA}-${golesPredichoB}`);
      console.log(`    ${esExacto ? '✅ EXACTO (5 pts)' : esGanadorCorrecto ? '🔵 WINNER (2 pts)' : '❌ ERRADO'}`);
    }

    console.log(`\n📊 RESULTADO:`);
    console.log(`  Exactos: ${exactos} → ${exactos * 5} pts`);
    console.log(`  Winners: ${winners} → ${winners * 2} pts`);
    console.log(`  Errados: ${perdidos}`);
    console.log(`  TOTAL: ${puntosTotales} pts`);
  }

  console.log('\n' + '='.repeat(50));
  console.log('FIN DIAGNÓSTICO\n');
}

diagnosticar().catch(console.error);