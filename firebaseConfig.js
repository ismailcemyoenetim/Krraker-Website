// firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC5KQx0U5dl7e6hMcjhFZqPQiTPh_Qvs9s",
  authDomain: "krraker-db.firebaseapp.com",
  projectId: "krraker-db",
  storageBucket: "krraker-db.firebasestorage.app",
  messagingSenderId: "658555321674",
  appId: "1:658555321674:web:6634ab758b652e350695b3",
  measurementId: "G-58165Z0CB3"
};

// Firebase uygulamasını başlat
const app = initializeApp(firebaseConfig);

// Firestore'u başlat
const db = getFirestore(app);

// Dışa aktar
export { db };
