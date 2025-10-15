// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// 🔥 Replace with your own config
const firebaseConfig = {
  apiKey: "AIzaSyB9fDC9MswOZn_HHyR4mUcnaT66dTpHEUU",
      authDomain: "mpm-webdb.firebaseapp.com",
      projectId: "mpm-webdb",
      storageBucket: "mpm-webdb.firebasestorage.app",
      messagingSenderId: "505825453901",
      appId: "1:505825453901:web:9588e60f9702192473f904"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🧠 Load trivia questions
async function loadQuestions() {
  const querySnapshot = await getDocs(collection(db, "triviaQuestions"));
  const questions = [];
  querySnapshot.forEach((doc) => {
    questions.push(doc.data());
  });
  console.log("Questions loaded:", questions);
  // TODO: Display them on page
}

// 🏆 Save leaderboard entry
async function saveScore(username, score) {
  await addDoc(collection(db, "leaderboard"), { username, score });
  alert("Your score has been saved!");
}

// Start loading
loadQuestions();