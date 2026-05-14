import { doc, updateDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';

// ============================================================
// INSTRUCCIONES: Editá los equipos en el objeto EQUIPOS below
// Luego ejecutá: npx tsx src/scripts/asignarEquiposEliminatoria.ts
//
// Estructura del Mundial 2026:
// - 12 grupos de 4 equipos (48 equipos)
// - 12 grupos de 4 equipos cada uno (A-L)
// - Grupos: A, B, C, D (anfitriones), E, F, G, H, I, J, K, L
// - 16avos: M73-M88
// - Octavos: M89-M96
// - Cuartos: M97-M100
// - Semis: M101-M102
// - Tercer Puesto: M103
// - Final: M104
// ============================================================

// Mapa de partidos: numero -> { equipoA, equipoB, nombreA, nombreB }
// Según el Reglamento FIFA, los cruces de 16avos son:
const EQUIPOS: Record<string, { equipoA: string; equipoB: string; nombreA: string; nombreB: string }> = {
  // ========== 16AVOS (M73-M88) ==========
  // (1) M73: 2A vs 2B
  '73': { equipoA: 'TBD', equipoB: 'TBD', nombreA: '2° Grupo A', nombreB: '2° Grupo B' },
  // (2) M74: 1E vs Mejor 3° ABCDF
  '74': { equipoA: 'TBD', equipoB: 'TBD', nombreA: '1° Grupo E', nombreB: 'Mejor 3° ABCDF' },
  // (3) M75: 1F vs 2C
  '75': { equipoA: 'TBD', equipoB: 'TBD', nombreA: '1° Grupo F', nombreB: '2° Grupo C' },
  // (4) M76: 1C vs 2F
  '76': { equipoA: 'TBD', equipoB: 'TBD', nombreA: '1° Grupo C', nombreB: '2° Grupo F' },
  // (5) M77: 1I vs Mejor 3° CDFGH
  '77': { equipoA: 'TBD', equipoB: 'TBD', nombreA: '1° Grupo I', nombreB: 'Mejor 3° CDFGH' },
  // (6) M78: 2E vs 2I
  '78': { equipoA: 'TBD', equipoB: 'TBD', nombreA: '2° Grupo E', nombreB: '2° Grupo I' },
  // (7) M79: 1A vs Mejor 3° CEFHI
  '79': { equipoA: 'TBD', equipoB: 'TBD', nombreA: '1° Grupo A', nombreB: 'Mejor 3° CEFHI' },
  // (8) M80: 1L vs Mejor 3° EHIJK
  '80': { equipoA: 'TBD', equipoB: 'TBD', nombreA: '1° Grupo L', nombreB: 'Mejor 3° EHIJK' },
  // (9) M81: 1D vs Mejor 3° BEFIJ
  '81': { equipoA: 'TBD', equipoB: 'TBD', nombreA: '1° Grupo D', nombreB: 'Mejor 3° BEFIJ' },
  // (10) M82: 1G vs Mejor 3° AEHIJ
  '82': { equipoA: 'TBD', equipoB: 'TBD', nombreA: '1° Grupo G', nombreB: 'Mejor 3° AEHIJ' },
  // (11) M83: 2K vs 2L
  '83': { equipoA: 'TBD', equipoB: 'TBD', nombreA: '2° Grupo K', nombreB: '2° Grupo L' },
  // (12) M84: 1H vs 2J
  '84': { equipoA: 'TBD', equipoB: 'TBD', nombreA: '1° Grupo H', nombreB: '2° Grupo J' },
  // (13) M85: 1B vs Mejor 3° EFGHI
  '85': { equipoA: 'TBD', equipoB: 'TBD', nombreA: '1° Grupo B', nombreB: 'Mejor 3° EFGHI' },
  // (14) M86: 1J vs 2H
  '86': { equipoA: 'TBD', equipoB: 'TBD', nombreA: '1° Grupo J', nombreB: '2° Grupo H' },
  // (15) M87: 1K vs Mejor 3° DEIJL
  '87': { equipoA: 'TBD', equipoB: 'TBD', nombreA: '1° Grupo K', nombreB: 'Mejor 3° DEIJL' },
  // (16) M88: 2D vs 2G
  '88': { equipoA: 'TBD', equipoB: 'TBD', nombreA: '2° Grupo D', nombreB: '2° Grupo G' },

  // ========== OCTAVOS (M89-M96) ==========
  // (17) M89: W74 vs W77
  '89': { equipoA: 'TBD', equipoB: 'TBD', nombreA: 'Ganador M74', nombreB: 'Ganador M77' },
  // (18) M90: W73 vs W75
  '90': { equipoA: 'TBD', equipoB: 'TBD', nombreA: 'Ganador M73', nombreB: 'Ganador M75' },
  // (19) M91: W76 vs W78
  '91': { equipoA: 'TBD', equipoB: 'TBD', nombreA: 'Ganador M76', nombreB: 'Ganador M78' },
  // (20) M92: W79 vs W80
  '92': { equipoA: 'TBD', equipoB: 'TBD', nombreA: 'Ganador M79', nombreB: 'Ganador M80' },
  // (21) M93: W83 vs W84
  '93': { equipoA: 'TBD', equipoB: 'TBD', nombreA: 'Ganador M83', nombreB: 'Ganador M84' },
  // (22) M94: W81 vs W82
  '94': { equipoA: 'TBD', equipoB: 'TBD', nombreA: 'Ganador M81', nombreB: 'Ganador M82' },
  // (23) M95: W86 vs W88
  '95': { equipoA: 'TBD', equipoB: 'TBD', nombreA: 'Ganador M86', nombreB: 'Ganador M88' },
  // (24) M96: W85 vs W87
  '96': { equipoA: 'TBD', equipoB: 'TBD', nombreA: 'Ganador M85', nombreB: 'Ganador M87' },

  // ========== CUARTOS (M97-M100) ==========
  // (A) M97: W89 vs W90
  '97': { equipoA: 'TBD', equipoB: 'TBD', nombreA: 'Ganador M89', nombreB: 'Ganador M90' },
  // (B) M98: W93 vs W94
  '98': { equipoA: 'TBD', equipoB: 'TBD', nombreA: 'Ganador M93', nombreB: 'Ganador M94' },
  // (C) M99: W91 vs W92
  '99': { equipoA: 'TBD', equipoB: 'TBD', nombreA: 'Ganador M91', nombreB: 'Ganador M92' },
  // (D) M100: W95 vs W96
  '100': { equipoA: 'TBD', equipoB: 'TBD', nombreA: 'Ganador M95', nombreB: 'Ganador M96' },

  // ========== SEMIS (M101-M102) ==========
  // SF1: W97 vs W98
  '101': { equipoA: 'TBD', equipoB: 'TBD', nombreA: 'Ganador M97', nombreB: 'Ganador M98' },
  // SF2: W99 vs W100
  '102': { equipoA: 'TBD', equipoB: 'TBD', nombreA: 'Ganador M99', nombreB: 'Ganador M100' },

  // ========== TERCER PUESTO (M103) ==========
  // Perdedora SF1 vs Perdedora SF2
  '103': { equipoA: 'TBD', equipoB: 'TBD', nombreA: 'Perdedor SF1', nombreB: 'Perdedor SF2' },

  // ========== FINAL (M104) ==========
  // Ganador SF1 vs Ganador SF2
  '104': { equipoA: 'TBD', equipoB: 'TBD', nombreA: 'Ganador SF1', nombreB: 'Ganador SF2' },
};

async function asignarEquipos() {
  console.log('⚽ Asignando equipos a partidos de eliminatoria...\n');

  const partidosSnap = await getDocs(collection(db, 'partidos'));
  const eliminatorios = partidosSnap.docs.filter((d) => d.data().fase === 'eliminatoria');

  let actualizados = 0;
  let errores = 0;

  for (const partidoDoc of eliminatorios) {
    const data = partidoDoc.data();
    const numero = data.numero?.toString();

    if (!numero || !EQUIPOS[numero]) {
      console.log(`   ⚠️  Partido ${partidoDoc.id} (M${numero}) - sin configuración`);
      continue;
    }

    const equipos = EQUIPOS[numero];

    try {
      await updateDoc(doc(db, 'partidos', partidoDoc.id), {
        equipoA: equipos.equipoA,
        equipoB: equipos.equipoB,
        nombreA: equipos.nombreA,
        nombreB: equipos.nombreB,
      });

      console.log(`   ✅ M${numero}: ${equipos.nombreA} vs ${equipos.nombreB}`);
      actualizados++;
    } catch (error) {
      console.log(`   ❌ Error M${numero}: ${error}`);
      errores++;
    }
  }

  console.log('\n✨ Resumen:');
  console.log(`   ✅ Actualizados: ${actualizados}`);
  console.log(`   ❌ Errores: ${errores}`);
  console.log('\n📝 Los cruces están definidos según el Reglamento FIFA.');
  console.log('   Los equipos se determinarán después de la fase de grupos.');
}

asignarEquipos().catch(console.error);