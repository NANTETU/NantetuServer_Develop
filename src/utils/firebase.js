import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAevnb74WfrSZrk-JpbYPt13TxbK3cCZM0",
    authDomain: "nantetu-server.firebaseapp.com",
    projectId: "nantetu-server",
    storageBucket: "nantetu-server.firebasestorage.app",
    messagingSenderId: "425815928148",
    appId: "1:425815928148:web:e081fef325ac08e909acc1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const appId = 'nantetu-web';