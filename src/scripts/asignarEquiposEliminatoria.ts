import { doc, updateDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';

// Mapa de partidos: numero -> { equipoA, equipoB, nombreA, nombreB }
// Cruces según Reglamento FIFA Copa Mundial 2026 - Dieciseisavos de final
const EQUIPOS: Record<string, { equipoA: string; equipoB: string; nombreA: string; nombreB: string }> = {
  // ========== 16AVOS (M73-M88) ==========
  // M73: 2°A vs 2°B
  '73': { equipoA: 'Mexico', equipoB: 'Canada', nombreA: '2° Grupo A', nombreB: '2° Grupo B' },
  // M74: 1°E vs 3°A/B/C/D/F
  '74': { equipoA: 'Germany', equipoB: 'SouthAfrica', nombreA: '1° Grupo E', nombreB: '3° Grupo A/B/C/D/F' },
  // M75: 1°F vs 2°C
  '75': { equipoA: 'Netherlands', equipoB: 'Scotland', nombreA: '1° Grupo F', nombreB: '2° Grupo C' },
  // M76: 1°C vs 2°F
  '76': { equipoA: 'Brazil', equipoB: 'Japan', nombreA: '1° Grupo C', nombreB: '2° Grupo F' },
  // M77: 1°I vs 3°C/D/F/G/H
  '77': { equipoA: 'France', equipoB: 'Egypt', nombreA: '1° Grupo I', nombreB: '3° Grupo C/D/F/G/H' },
  // M78: 2°E vs 2°I
  '78': { equipoA: 'Ecuador', equipoB: 'Norway', nombreA: '2° Grupo E', nombreB: '2° Grupo I' },
  // M79: 1°A vs 3°C/E/F/H/I
  '79': { equipoA: 'Mexico', equipoB: 'Ireland', nombreA: '1° Grupo A', nombreB: '3° Grupo C/E/F/H/I' },
  // M80: 1°L vs 3°E/H/I/J/K
  '80': { equipoA: 'England', equipoB: 'Jamaica', nombreA: '1° Grupo L', nombreB: '3° Grupo E/H/I/J/K' },
  // M81: 1°D vs 3°B/E/F/I/J
  '81': { equipoA: 'USA', equipoB: 'Qatar', nombreA: '1° Grupo D', nombreB: '3° Grupo B/E/F/I/J' },
  // M82: 1°G vs 3°A/E/H/I/J
  '82': { equipoA: 'Belgium', equipoB: 'Senegal', nombreA: '1° Grupo G', nombreB: '3° Grupo A/E/H/I/J' },
  // M83: 2°K vs 2°L
  '83': { equipoA: 'Colombia', equipoB: 'Croatia', nombreA: '2° Grupo K', nombreB: '2° Grupo L' },
  // M84: 1°H vs 2°J
  '84': { equipoA: 'Spain', equipoB: 'Austria', nombreA: '1° Grupo H', nombreB: '2° Grupo J' },
  // M85: 1°B vs 3°E/F/G/I/J
  '85': { equipoA: 'Switzerland', equipoB: 'Algeria', nombreA: '1° Grupo B', nombreB: '3° Grupo E/F/G/I/J' },
  // M86: 1°J vs 2°H
  '86': { equipoA: 'Argentina', equipoB: 'Portugal', nombreA: '1° Grupo J', nombreB: '2° Grupo H' },
  // M87: 1°K vs 3°D/E/I/J/L
  '87': { equipoA: 'Portugal', equipoB: 'Uzbekistan', nombreA: '1° Grupo K', nombreB: '3° Grupo D/E/I/J/L' },
  // M88: 2°D vs 2°G
  '88': { equipoA: 'Paraguay', equipoB: 'Iran', nombreA: '2° Grupo D', nombreB: '2° Grupo G' },

  // ========== OCTAVOS (M89-M96) ==========
  // Los winners de 16avos según bracket FIFA
  '89': { equipoA: 'Germany', equipoB: 'France', nombreA: 'Ganador M74', nombreB: 'Ganador M77' },
  '90': { equipoA: 'Mexico', equipoB: 'Brazil', nombreA: 'Ganador M73', nombreB: 'Ganador M75' },
  '91': { equipoA: 'Netherlands', equipoB: 'Ecuador', nombreA: 'Ganador M76', nombreB: 'Ganador M78' },
  '92': { equipoA: 'England', equipoB: 'USA', nombreA: 'Ganador M79', nombreB: 'Ganador M80' },
  '93': { equipoA: 'Colombia', equipoB: 'Spain', nombreA: 'Ganador M83', nombreB: 'Ganador M84' },
  '94': { equipoA: 'Belgium', equipoB: 'Argentina', nombreA: 'Ganador M81', nombreB: 'Ganador M82' },
  '95': { equipoA: 'Switzerland', equipoB: 'Argentina', nombreA: 'Ganador M85', nombreB: 'Ganador M86' },
  '96': { equipoA: 'Paraguay', equipoB: 'Portugal', nombreA: 'Ganador M88', nombreB: 'Ganador M87' },

  // ========== CUARTOS (M97-M100) ==========
  '97': { equipoA: 'Germany', equipoB: 'Brazil', nombreA: 'Ganador M89', nombreB: 'Ganador M90' },
  '98': { equipoA: 'Colombia', equipoB: 'Belgium', nombreA: 'Ganador M93', nombreB: 'Ganador M94' },
  '99': { equipoA: 'Netherlands', equipoB: 'England', nombreA: 'Ganador M91', nombreB: 'Ganador M92' },
  '100': { equipoA: 'Argentina', equipoB: 'Portugal', nombreA: 'Ganador M95', nombreB: 'Ganador M96' },

  // ========== SEMIS (M101-M102) ==========
  '101': { equipoA: 'Germany', equipoB: 'Belgium', nombreA: 'Ganador M97', nombreB: 'Ganador M98' },
  '102': { equipoA: 'England', equipoB: 'Argentina', nombreA: 'Ganador M99', nombreB: 'Ganador M100' },

  // ========== TERCER PUESTO (M103) ==========
  '103': { equipoA: 'Belgium', equipoB: 'England', nombreA: 'Perdedor M101', nombreB: 'Perdedor M102' },

  // ========== FINAL (M104) ==========
  '104': { equipoA: 'Germany', equipoB: 'Argentina', nombreA: 'Ganador M101', nombreB: 'Ganador M102' },
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
  console.log('\n📝 Cruces según Reglamento FIFA 2026');
}

asignarEquipos().catch(console.error);