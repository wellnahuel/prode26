import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

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
const db = getFirestore(app);

export { app, auth, db };