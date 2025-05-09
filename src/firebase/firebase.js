import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore, query, where } from 'firebase/firestore'; // Add query and where here

const firebaseConfig = {
  apiKey: "AIzaSyAS-xvjza2TpR1dhjCJ20bkifWd_5D5RiY",
  authDomain: "password-manager-60525.firebaseapp.com",
  projectId: "password-manager-60525",
  storageBucket: "password-manager-60525.firebasestorage.app",
  messagingSenderId: "894300736834",
  appId: "1:894300736834:web:1cef97d32ec36c9aa78cdb",
  measurementId: "G-PDN6067ZJV"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); // Get auth instance from the initialized app
console.log(auth);
const db = getFirestore(app); 

export { auth, db, app, query, where }; // Export query and where
