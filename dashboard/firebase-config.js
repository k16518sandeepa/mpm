// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB9fDC9MswOZn_HHyR4mUcnaT66dTpHEUU",
  authDomain: "mpm-webdb.firebaseapp.com",
  databaseURL: "https://mpm-webdb-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "mpm-webdb",
  storageBucket: "mpm-webdb.firebasestorage.app",
  messagingSenderId: "505825453901",
  appId: "1:505825453901:web:9588e60f9702192473f904"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firestore and Auth
export const db = getFirestore(app);
export const auth = getAuth(app);