import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
  getFirestore, doc, getDoc, setDoc, updateDoc, onSnapshot,
  collection, addDoc, query, orderBy
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB9fDC9MswOZn_HHyR4mUcnaT66dTpHEUU",
  authDomain: "mpm-webdb.firebaseapp.com",
  databaseURL: "https://mpm-webdb-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "mpm-webdb",
  storageBucket: "mpm-webdb.firebasestorage.app",
  messagingSenderId: "505825453901",
  appId: "1:505825453901:web:9588e60f9702192473f904"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ===== POLLS (Reusable) ===== */
document.querySelectorAll(".poll.card").forEach(poll => {
  const form = poll.querySelector(".pollForm");
  const button = poll.querySelector(".voteButton");
  const resultDiv = poll.querySelector(".pollResult");
  const docName = poll.dataset.pollDoc;
  const voteKey = poll.dataset.pollKey;

  // Check if user already voted
  if (localStorage.getItem(voteKey)) {
    form.style.display = "none";
    resultDiv.style.display = "block";
    subscribePoll(docName, resultDiv);
  }

  button.addEventListener("click", async () => {
    if (localStorage.getItem(voteKey)) return alert("You have already voted!");
    
    const selected = form.querySelector('input[type="radio"]:checked');
    if (!selected) return alert("Please select an option!");

    const choice = selected.value;
    const ref = doc(db, "polls", docName);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      const data = snap.data();
      data[choice] = (data[choice] || 0) + 1;
      await updateDoc(ref, data);
    } else {
      await setDoc(ref, { [choice]: 1 });
    }

    localStorage.setItem(voteKey, "true");

    form.style.opacity = "0";
    setTimeout(() => {
      form.style.display = "none";
      resultDiv.style.display = "block";
      resultDiv.innerHTML = `<p style="text-align:center; color:#ffa502; font-weight:bold;">✅ Thanks for your vote!</p>`;
      subscribePoll(docName, resultDiv);
    }, 500);
  });
});

// Subscribe live updates
function subscribePoll(docName, resultDiv) {
  onSnapshot(doc(db, "polls", docName), (docSnap) => {
    if (docSnap.exists()) showPollResults(docSnap.data(), resultDiv);
  });
}

// Show poll results
function showPollResults(results, pollResultDiv) {
  pollResultDiv.innerHTML = "";
  const totalVotes = Object.values(results).reduce((a,b)=>a+b,0);

  for (let option in results) {
    const percent = totalVotes > 0 ? (results[option]/totalVotes)*100 : 0;
    const container = document.createElement("div");
    container.innerHTML = `<strong>${option} - ${results[option]} votes</strong>`;

    const bar = document.createElement("div");
    bar.classList.add("result-bar");

    const fill = document.createElement("div");
    fill.classList.add("result-fill");
    bar.appendChild(fill);
    container.appendChild(bar);
    pollResultDiv.appendChild(container);

    setTimeout(() => { fill.style.width = percent + "%"; }, 100);
  }
}

/* ===== REQUESTS ===== */
const requestForm = document.getElementById("requestForm");
const requestList = document.getElementById("requestList");

requestForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const input = document.getElementById("requestInput");
  const text = input.value.trim();
  if (!text) return;

  await addDoc(collection(db, "requests"), { text, votes: 0 });
  input.value = "";
});

// Live updates for requests
const requestsQuery = query(collection(db, "requests"), orderBy("votes", "desc"));
onSnapshot(requestsQuery, snapshot => {
  requestList.innerHTML = "";
  snapshot.forEach(docSnap => {
    const req = docSnap.data();
    const li = document.createElement("li");
    li.innerHTML = `
      ${req.text}
      <span class="vote-buttons">
        <button class="upvote">👍</button>
        <button class="downvote">👎</button>
        <span>${req.votes}</span>
      </span>
    `;
    li.querySelector(".upvote").addEventListener("click", () => voteRequest(docSnap.id, 1));
    li.querySelector(".downvote").addEventListener("click", () => voteRequest(docSnap.id, -1));
    requestList.appendChild(li);
  });
});

// Request vote function
async function voteRequest(id, change) {
  const voteKey = "requestVote_" + id;
  if (localStorage.getItem(voteKey)) return alert("You already voted on this request!");
  const ref = doc(db, "requests", id);
  const snap = await getDoc(ref);
  if (snap.exists()) await updateDoc(ref, { votes: (snap.data().votes || 0) + change });
  localStorage.setItem(voteKey, "true");
}
