// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "blog-f5605.firebaseapp.com",
  projectId: "blog-f5605",
  storageBucket: "blog-f5605.appspot.com",
  messagingSenderId: "901242130749",
  appId: "1:901242130749:web:ff7121c95b6e39182a7554"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

