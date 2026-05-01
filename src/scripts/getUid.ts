import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDvR6r23NMrI-qqT4LhlfNVxDxIKxuwDig",
  authDomain: "prode26-e5042.firebaseapp.com",
  projectId: "prode26-e5042",
  storageBucket: "prode26-e5042.firebasestorage.app",
  messagingSenderId: "29347576316",
  appId: "1:29347576316:web:4be571e68916b8b1939a79"
};

async function getUid() {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  const { user } = await signInWithEmailAndPassword(auth, 'test@email.com', '123456');
  console.log('Tu UID:', user.uid);
  console.log('Copia este UID y ponelo en ADMIN_UID en src/lib/admin.ts');
}

getUid().catch(console.error);