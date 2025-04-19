// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);