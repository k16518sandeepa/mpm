// Simple trivia question list
const questions = [
  {
    question: "Which anime features the character Goku?",
    options: ["One Piece", "Naruto", "Dragon Ball", "Bleach"],
    answer: 2
  },
  {
    question: "In Naruto, what is the name of Naruto's father?",
    options: ["Jiraiya", "Sasuke", "Minato", "Itachi"],
    answer: 2
  },
  {
    question: "Which game is developed by FromSoftware?",
    options: ["Elden Ring", "Fortnite", "GTA V", "Overwatch"],
    answer: 0
  }
];

let currentQuestion = 0;
let score = 0;
const container = document.getElementById("trivia-container");

function loadQuestion() {
  if (currentQuestion >= questions.length) {
    showResult();
    return;
  }

  const q = questions[currentQuestion];
  container.innerHTML = 
    <div class="question-card">
      <h3>${q.question}</h3>
      ${q.options.map((opt, i) => <button onclick="checkAnswer(${i})">${opt}</button>).join("")}
    </div>
  ;
}

async function checkAnswer(selected) {
  const q = questions[currentQuestion];
  if (selected === q.answer) {
    score++;
  }
  currentQuestion++;
  loadQuestion();
}

async function showResult() {
  container.innerHTML = 
    <div class="question-card">
      <h2>Your Score: ${score}/${questions.length}</h2>
      <input type="text" id="playerName" placeholder="Enter your name" style="padding:10px;border-radius:5px;">
      <button onclick="saveScore()">Save Score</button>
    </div>
  ;
}

async function saveScore() {
  const name = document.getElementById("playerName").value || "Anonymous";
  if (!window.db) return alert("Database not ready!");

  const { addDoc, collection } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
  await addDoc(collection(window.db, "trivia_leaderboard"), {
    name,
    score,
    date: new Date()
  });

  loadLeaderboard();
}

async function loadLeaderboard() {
  const { getDocs, collection, query, orderBy, limit } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
  const q = query(collection(window.db, "trivia_leaderboard"), orderBy("score", "desc"), limit(10));
  const snap = await getDocs(q);
  const list = document.getElementById("leaderboard-list");
  list.innerHTML = "";
  snap.forEach(doc => {
    const data = doc.data();
    list.innerHTML += <li>${data.name}: ${data.score}</li>;
  });
}

window.onload = () => {
  loadQuestion();
  loadLeaderboard();
};