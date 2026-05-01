import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc, getDocs, deleteDoc, query, where, doc, setDoc, getDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyDvR6r23NMrI-qqT4LhlfNVxDxIKxuwDig",
  authDomain: "prode26-e5042.firebaseapp.com",
  projectId: "prode26-e5042",
  storageBucket: "prode26-e5042.firebasestorage.app",
  messagingSenderId: "29347576316",
  appId: "1:29347576316:web:4be571e68916b8b1939a79"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
import { getFirestore } from 'firebase/firestore';
const db = getFirestore(app);

const nuevosUsuarios = [
  { email: 'carlos.test@prode26.com', password: 'CarlosTest123!', displayName: 'Carlos Test' },
  { email: 'maria.test@prode26.com', password: 'MariaTest123!', displayName: 'María Test' },
];

async function crearUsuarioYPredicciones(email: string, password: string, displayName: string) {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`👤 Creando usuario: ${displayName} (${email})`);
  console.log('='.repeat(50));

  let uid: string;

  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    uid = user.uid;
    console.log(`✅ Auth user created: ${uid}`);
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('⚠️  Usuario ya existe en Auth, buscando UID...');
      const signIn = await import('firebase/auth').then(m => m.signInWithEmailAndPassword(getAuth(), email, password));
      uid = signIn.user.uid;
      console.log(`✅ UID: ${uid}`);
    } else {
      throw error;
    }
  }

  const userDocRef = doc(db, 'usuarios', uid);
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    await setDoc(userDocRef, {
      uid,
      displayName,
      email,
      creadoEn: new Date(),
    });
    console.log('✅ Usuario creado en Firestore');
  } else {
    console.log('ℹ️  Usuario ya existe en Firestore');
  }

  const pronosticosRef = collection(db, 'pronosticos');
  const existentes = await getDocs(query(pronosticosRef, where('usuarioId', '==', uid)));
  console.log(`🗑️  Limpiando ${existentes.size} predicciones existentes...`);
  for (const docSnap of existentes.docs) {
    await deleteDoc(doc(pronosticosRef, docSnap.id));
  }

  const partidosSnap = await getDocs(collection(db, 'partidos'));
  const partidos = partidosSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  console.log(`\n🎲 Cargando ${partidos.length} predicciones aleatorias...`);

  for (const partido of partidos) {
    const golesA = Math.floor(Math.random() * 5);
    const golesB = Math.floor(Math.random() * 5);

    await addDoc(pronosticosRef, {
      usuarioId: uid,
      partidoId: partido.id,
      golesPredichoA: golesA,
      golesPredichoB: golesB,
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    });

    process.stdout.write('.');
  }

  console.log('\n');
  return { email, password, displayName, uid };
}

async function main() {
  console.log('\n🚀 INICIANDO CARGA DE USUARIOS Y PREDICCIONES DE TEST');
  console.log('='.repeat(50));

  const resultados = [];

  for (const usuario of nuevosUsuarios) {
    const resultado = await crearUsuarioYPredicciones(usuario.email, usuario.password, usuario.displayName);
    resultados.push(resultado);
  }

  console.log('\n');
  console.log('='.repeat(60));
  console.log('📊 RESUMEN');
  console.log('='.repeat(60));

  for (const r of resultados) {
    console.log(`\n👤 ${r.displayName}`);
    console.log(`   📧 Email: ${r.email}`);
    console.log(`   🔐 Password: ${r.password}`);
    console.log(`   🆔 UID: ${r.uid}`);
  }

  console.log('\n');
  console.log('='.repeat(60));
  console.log('✅ TOTAL: 2 usuarios × 72 partidos = 144 predicciones creadas');
  console.log('='.repeat(60));

  console.log('\n💡 Para usar estos usuarios:');
  console.log('   npx tsx src/scripts/cargarPrediccionesTest.ts <email> <password>\n');
}

main().catch(console.error);