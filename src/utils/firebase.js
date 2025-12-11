import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDtRGDqHlWdaRIM9RdHbMH-lLKyZHpJh80",
  authDomain: "nantetu-29158.firebaseapp.com",
  projectId: "nantetu-29158",
  storageBucket: "nantetu-29158.firebasestorage.app",
  messagingSenderId: "971397700888",
  appId: "1:971397700888:web:3d3b25a0762faad23e926d"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const appId = 'nantetu-web';