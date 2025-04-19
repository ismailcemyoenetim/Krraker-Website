// Firebase Authentication Module
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";

// Firebase configuration from snippet.md
const firebaseConfig = {
  apiKey: "AIzaSyD55KdXc0PcnhIh9WgdcByS0-EVvk4pxxI",
  authDomain: "email-kraker.firebaseapp.com",
  projectId: "email-kraker",
  storageBucket: "email-kraker.firebasestorage.app",
  messagingSenderId: "887189683401",
  appId: "1:887189683401:web:15b6a238b8d24319ece118",
  measurementId: "G-TE7M225KP7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Auth state observer
export function initAuthStateObserver(callback) {
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
}

// Sign up with email and password
export async function signUpWithEmail(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return {
      success: true,
      user: userCredential.user
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// Sign in with email and password
export async function signInWithEmail(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return {
      success: true,
      user: userCredential.user
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// Sign out
export async function signOutUser() {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// Get current user
export function getCurrentUser() {
  return auth.currentUser;
} 