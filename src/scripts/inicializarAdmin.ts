import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

// ============================================================
// Script para inicializar la configuración del admin y pozo
// Run: npx tsx src/scripts/inicializarAdmin.ts
// ============================================================

const CONFIG = {
  // Tu UID de Firebase Auth (test@email.com)
  adminUid: 'YANsZ4IXZ6WmtaRRemOqh17UOOJ3',

  // Pozo: % para los 3 primeros (debe sumar 100)
  pozoPorcentaje1: 50,
  pozoPorcentaje2: 30,
  pozoPorcentaje3: 20,

  // Costo de inscripción
  inscripcionEuros: 25,

  // Pozo total (se actualiza solo según participantes)
  pozoTotal: 0,
};

async function inicializarAdmin() {
  console.log('🔧 Inicializando configuración del Prode...\n');

  // Guardar documento de configuración
  await setDoc(doc(db, 'config', 'admin'), {
    ...CONFIG,
    actualizadoEl: new Date(),
  });

  console.log('✅ Configuración guardada en Firestore: config/admin');
  console.log('\n📊 Config actual:');
  console.log(`   Admin UID: ${CONFIG.adminUid}`);
  console.log(`   Inscripción: ${CONFIG.inscripcionEuros}€`);
  console.log(`   Pozo: ${CONFIG.pozoPorcentaje1}% + ${CONFIG.pozoPorcentaje2}% + ${CONFIG.pozoPorcentaje3}%`);
  console.log('\n💡 Para cambiar la config, usá el panel admin en /dashboard/admin');
}

async function verConfig() {
  const snap = await getDoc(doc(db, 'config', 'admin'));
  if (snap.exists()) {
    console.log('\n📋 Config actual en Firestore:');
    console.log(JSON.stringify(snap.data(), null, 2));
  } else {
    console.log('❌ No existe config. Ejecutá primero inicializarAdmin');
  }
}

const args = process.argv.slice(2);
if (args[0] === '--ver') {
  verConfig().catch(console.error);
} else {
  inicializarAdmin().catch(console.error);
}