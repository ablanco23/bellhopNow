import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC38l6oCREg30PQFPYt5Olv0cO9Ov2yayE",
  authDomain: "bellhopnow.firebaseapp.com",
  projectId: "bellhopnow",
  storageBucket: "bellhopnow.firebasestorage.app",
  messagingSenderId: "911386241378",
  appId: "1:911386241378:web:1c28db49848ccd0f23643b"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;