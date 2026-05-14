import { Timestamp } from 'firebase/firestore';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';

type RondaEliminatoria = '16avos' | 'octavos' | 'cuartos' | 'semis' | 'tercer-puesto' | 'final';

// Mundial 2026: 48 equipos, 12 grupos de 4
// Grupos: M1-M72 (72 partidos)
// Eliminatoria: M73-M104 (32 partidos)
const ELIMINATORIA_PARTIDOS = [
  // 16avos (16 partidos): M73-M88
  { numero: 73, ronda: '16avos' as RondaEliminatoria, fecha: new Date('2026-06-28T16:00:00'), grupo: 'A' },
  { numero: 74, ronda: '16avos' as RondaEliminatoria, fecha: new Date('2026-06-28T20:00:00'), grupo: 'B' },
  { numero: 75, ronda: '16avos' as RondaEliminatoria, fecha: new Date('2026-06-29T16:00:00'), grupo: 'C' },
  { numero: 76, ronda: '16avos' as RondaEliminatoria, fecha: new Date('2026-06-29T20:00:00'), grupo: 'D' },
  { numero: 77, ronda: '16avos' as RondaEliminatoria, fecha: new Date('2026-06-30T16:00:00'), grupo: 'E' },
  { numero: 78, ronda: '16avos' as RondaEliminatoria, fecha: new Date('2026-06-30T20:00:00'), grupo: 'F' },
  { numero: 79, ronda: '16avos' as RondaEliminatoria, fecha: new Date('2026-07-01T16:00:00'), grupo: 'G' },
  { numero: 80, ronda: '16avos' as RondaEliminatoria, fecha: new Date('2026-07-01T20:00:00'), grupo: 'H' },
  { numero: 81, ronda: '16avos' as RondaEliminatoria, fecha: new Date('2026-07-02T16:00:00'), grupo: 'I' },
  { numero: 82, ronda: '16avos' as RondaEliminatoria, fecha: new Date('2026-07-02T20:00:00'), grupo: 'J' },
  { numero: 83, ronda: '16avos' as RondaEliminatoria, fecha: new Date('2026-07-03T16:00:00'), grupo: 'K' },
  { numero: 84, ronda: '16avos' as RondaEliminatoria, fecha: new Date('2026-07-03T20:00:00'), grupo: 'L' },
  { numero: 85, ronda: '16avos' as RondaEliminatoria, fecha: new Date('2026-07-04T16:00:00'), grupo: 'M' },
  { numero: 86, ronda: '16avos' as RondaEliminatoria, fecha: new Date('2026-07-04T20:00:00'), grupo: 'N' },
  { numero: 87, ronda: '16avos' as RondaEliminatoria, fecha: new Date('2026-07-05T16:00:00'), grupo: 'O' },
  { numero: 88, ronda: '16avos' as RondaEliminatoria, fecha: new Date('2026-07-05T20:00:00'), grupo: 'P' },

  // Octavos (8 partidos): M89-M96
  { numero: 89, ronda: 'octavos' as RondaEliminatoria, fecha: new Date('2026-07-06T16:00:00'), grupo: '1' },
  { numero: 90, ronda: 'octavos' as RondaEliminatoria, fecha: new Date('2026-07-06T20:00:00'), grupo: '2' },
  { numero: 91, ronda: 'octavos' as RondaEliminatoria, fecha: new Date('2026-07-07T16:00:00'), grupo: '3' },
  { numero: 92, ronda: 'octavos' as RondaEliminatoria, fecha: new Date('2026-07-07T20:00:00'), grupo: '4' },
  { numero: 93, ronda: 'octavos' as RondaEliminatoria, fecha: new Date('2026-07-08T16:00:00'), grupo: '5' },
  { numero: 94, ronda: 'octavos' as RondaEliminatoria, fecha: new Date('2026-07-08T20:00:00'), grupo: '6' },
  { numero: 95, ronda: 'octavos' as RondaEliminatoria, fecha: new Date('2026-07-09T16:00:00'), grupo: '7' },
  { numero: 96, ronda: 'octavos' as RondaEliminatoria, fecha: new Date('2026-07-09T20:00:00'), grupo: '8' },

  // Cuartos (4 partidos): M97-M100
  { numero: 97, ronda: 'cuartos' as RondaEliminatoria, fecha: new Date('2026-07-10T16:00:00'), grupo: 'A' },
  { numero: 98, ronda: 'cuartos' as RondaEliminatoria, fecha: new Date('2026-07-10T20:00:00'), grupo: 'B' },
  { numero: 99, ronda: 'cuartos' as RondaEliminatoria, fecha: new Date('2026-07-11T16:00:00'), grupo: 'C' },
  { numero: 100, ronda: 'cuartos' as RondaEliminatoria, fecha: new Date('2026-07-11T20:00:00'), grupo: 'D' },

  // Semis (2 partidos): M101-M102
  { numero: 101, ronda: 'semis' as RondaEliminatoria, fecha: new Date('2026-07-14T20:00:00'), grupo: '1' },
  { numero: 102, ronda: 'semis' as RondaEliminatoria, fecha: new Date('2026-07-15T20:00:00'), grupo: '2' },

  // Tercer puesto (1 partido): M103
  { numero: 103, ronda: 'tercer-puesto' as RondaEliminatoria, fecha: new Date('2026-07-17T20:00:00'), grupo: '1' },

  // Final (1 partido): M104
  { numero: 104, ronda: 'final' as RondaEliminatoria, fecha: new Date('2026-07-18T20:00:00'), grupo: '1' },
];

async function cargarEliminatoria() {
  console.log('🔄 Cargando partidos de eliminatoria (Mundial 2026)...\n');

  // Primero borrar partidos de eliminatoria existentes
  console.log('🗑️  Limpiando partidos de eliminatoria existentes...');
  const existentes = await getDocs(collection(db, 'partidos'));
  const eliminatorios = existentes.docs.filter((d) => d.data().fase === 'eliminatoria');

  for (const d of eliminatorios) {
    await deleteDoc(doc(db, 'partidos', d.id));
  }
  console.log(`   Eliminados ${eliminatorios.length} partidos existentes\n`);

  // Cargar nuevos partidos
  console.log('📦 Creando partidos de eliminatoria...\n');

  const countByRonda: Record<string, number> = {};
  for (const partido of ELIMINATORIA_PARTIDOS) {
    const partidoId = `elim-${partido.numero}`;

    await addDoc(collection(db, 'partidos'), {
      id: partidoId,
      fase: 'eliminatoria',
      numero: partido.numero,
      ronda: partido.ronda,
      equipoA: 'TBD',
      equipoB: 'TBD',
      nombreA: 'Por definir',
      nombreB: 'Por definir',
      fechaInicio: Timestamp.fromDate(partido.fecha),
      resultado: null,
      estadio: null,
      grupo: partido.grupo,
    });

    countByRonda[partido.ronda] = (countByRonda[partido.ronda] || 0) + 1;
    console.log(`   ✅ M${partido.numero}: ${partido.ronda}`);
  }

  console.log('\n✨Done! 32 partidos de eliminatoria cargados (M73-M104).');
  console.log('\n📊 Resumen:');
  console.log(`   16avos: ${countByRonda['16avos']} partidos (M73-M88)`);
  console.log(`   Octavos: ${countByRonda['octavos']} partidos (M89-M96)`);
  console.log(`   Cuartos: ${countByRonda['cuartos']} partidos (M97-M100)`);
  console.log(`   Semis: ${countByRonda['semis']} partidos (M101-M102)`);
  console.log(`   Tercer Puesto: ${countByRonda['tercer-puesto']} partido (M103)`);
  console.log(`   Final: ${countByRonda['final']} partido (M104)`);
  console.log('\n📝 NOTA: Los equipos están como "TBD" (por definir).');
  console.log('   Usa el script "asignarEquiposEliminatoria.ts" para actualizar los equipos.');
}

cargarEliminatoria().catch(console.error);