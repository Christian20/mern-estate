// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-25dce.firebaseapp.com",
  projectId: "mern-estate-25dce",
  storageBucket: "mern-estate-25dce.firebasestorage.app",
  messagingSenderId: "725770126853",
  appId: "1:725770126853:web:a17bd30e14f24f1c6afe6c"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);