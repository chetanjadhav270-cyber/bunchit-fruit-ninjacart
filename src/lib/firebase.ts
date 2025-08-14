// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyD5DZ7KbAMFPMtMRk8A8ZP4xZflWWOyasw",
  authDomain: "bunchit-fun-game.firebaseapp.com",
  projectId: "bunchit-fun-game",
  storageBucket: "bunchit-fun-game.firebasestorage.app",
  messagingSenderId: "930958263272",
  appId: "1:930958263272:web:a70a74b39836fdfc995a5d",
  measurementId: "G-RMMHEYR0S3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);