import { collection, getDocs, addDoc, doc, setDoc, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';

/**
 * Script para generar predicciones aleatorias de prueba
 * Corre: npx tsx src/scripts/generarPrediccionesAleatorias.ts
 */

async function generarPrediccionesAleatorias() {
  console.log('🎲 Generando predicciones aleatorias...\n');

  // 1. Obtener todos los partidos de eliminatoria
  const partidosSnap = await getDocs(collection(db, 'partidos'));
  const eliminatorios = partidosSnap.docs.filter(d => d.data().fase === 'eliminatoria');

  console.log(`📋 Partidos de eliminatoria encontrados: ${eliminatorios.length}`);

  // 2. Obtener todos los usuarios
  const usuariosSnap = await getDocs(collection(db, 'usuarios'));
  console.log(`👥 Usuarios encontrados: ${usuariosSnap.size}`);

  let totalPredicciones = 0;
  let errores = 0;

  for (const usuarioDoc of usuariosSnap.docs) {
    const usuarioId = usuarioDoc.id;
    const usuarioNombre = usuarioDoc.data().displayName || usuarioId;

    for (const partidoDoc of eliminatorios) {
      const partidoId = partidoDoc.id;
      const partidoNum = partidoDoc.data().numero;

      // Generar score aleatorio 0-4 para cada equipo
      const golesA = Math.floor(Math.random() * 5);
      const golesB = Math.floor(Math.random() * 5);

      try {
        // Buscar si ya existe el pronostico
        const q = query(
          collection(db, 'pronosticos'),
          where('usuarioId', '==', usuarioId),
          where('partidoId', '==', partidoId)
        );
        const existing = await getDocs(q);

        if (existing.empty) {
          await addDoc(collection(db, 'pronosticos'), {
            usuarioId,
            partidoId,
            golesPredichoA: golesA,
            golesPredichoB: golesB,
            creadoEn: new Date(),
            actualizadoEn: new Date(),
          });
          totalPredicciones++;
        } else {
          // Ya existe, actualizar
          await setDoc(
            doc(db, 'pronosticos', existing.docs[0].id),
            {
              golesPredichoA: golesA,
              golesPredichoB: golesB,
              actualizadoEn: new Date(),
            },
            { merge: true }
          );
          totalPredicciones++;
        }
      } catch (error) {
        console.log(`   ❌ Error M${partidoNum} para ${usuarioNombre}: ${error}`);
        errores++;
      }
    }

    console.log(`   ✅ ${usuarioNombre}: ${eliminatorios.length} predicciones`);
  }

  console.log('\n✨ Resumen:');
  console.log(`   ✅ Predicciones generadas: ${totalPredicciones}`);
  console.log(`   ❌ Errores: ${errores}`);
  console.log('\n📝 Ahora cargá resultados con: npx tsx src/scripts/cargarResultadosTest.ts');
}

generarPrediccionesAleatorias().catch(console.error);