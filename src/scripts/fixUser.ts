/**
 * Script para crear/actualizar documento de usuario en Firestore
 */

import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

async function fixUser(email: string, password: string) {
  console.log('🔐 Login...');

  const auth = getAuth();
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  console.log(`✅ Logueado como: ${user.uid}\n`);

  // Verificar si existe el documento
  const userDoc = await getDoc(doc(db, 'usuarios', user.uid));

  if (userDoc.exists()) {
    console.log('✅ Usuario ya existe en Firestore');
    console.log('📄 Datos:', userDoc.data());
  } else {
    console.log('❌ Usuario NO existe en Firestore - Creando...');

    await setDoc(doc(db, 'usuarios', user.uid), {
      uid: user.uid,
      displayName: user.displayName || email.split('@')[0],
      email: user.email,
      creadoEn: new Date(),
    });

    console.log('✅ Usuario creado exitosamente!');
  }
}

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.log('Usage: npx tsx src/scripts/fixUser.ts <email> <password>');
} else {
  fixUser(email, password).catch(console.error);
}