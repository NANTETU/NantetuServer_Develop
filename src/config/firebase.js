import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export const firebaseConfig = {
    apiKey: "AIzaSyDtRGDqHlWdaRIM9RdHbMH-lLKyZHpJh80",
    authDomain: "nantetu-29158.firebasestorage.app",
    projectId: "nantetu-29158",
    storageBucket: "nantetu-29158.firebasestorage.app",
    messagingSenderId: "971397700888",
    appId: "1:971397700888:web:3d3b25a0762faad23e926d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db, firebaseConfig };
