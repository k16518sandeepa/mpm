import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore, doc, getDoc, setDoc, updateDoc, onSnapshot,
  collection, addDoc, query
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ------------- Firebase config -------------
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

// ------------- Polls (unchanged) -------------
document.querySelectorAll(".poll.card").forEach(poll => {
  const form = poll.querySelector(".pollForm");
  const button = poll.querySelector(".voteButton");
  const resultDiv = poll.querySelector(".pollResult");
  const docName = poll.dataset.pollDoc;
  const voteKey = poll.dataset.pollKey;

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

function subscribePoll(docName, resultDiv) {
  onSnapshot(doc(db, "polls", docName), (docSnap) => {
    if (docSnap.exists()) showPollResults(docSnap.data(), resultDiv);
  });
}

function showPollResults(results, pollResultDiv) {
  pollResultDiv.innerHTML = "";
  const totalVotes = Object.values(results).reduce((a,b)=>a+b,0);
  for (let option in results) {
    const percent = totalVotes > 0 ? (results[option]/totalVotes)*100 : 0;
    const container = document.createElement("div");
    container.innerHTML = `<strong>${option} - ${results[option]} votes</strong>`;
    const bar = document.createElement("div"); bar.classList.add("result-bar");
    const fill = document.createElement("div"); fill.classList.add("result-fill");
    bar.appendChild(fill); container.appendChild(bar); pollResultDiv.appendChild(container);
    setTimeout(() => { fill.style.width = percent + "%"; }, 100);
  }
}

// ------------- Requests (fixed sorting + IMDb) -------------
const requestForm = document.getElementById("requestForm");
const requestList = document.getElementById("requestList");
const sortSelect = document.getElementById("sortRequests"); // must exist in HTML

let allRequests = []; // cache of docs

requestForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const input = document.getElementById("requestInput");
  const text = input.value.trim();
  if (!text) return;
  // store createdAt as server-side would be best; this stores a JS Date (works)
  await addDoc(collection(db, "requests"), { text, votes: 0, createdAt: new Date() });
  input.value = "";
});

// Listen to Firestore (no server-side ordering here)
const requestsQuery = query(collection(db, "requests"));
onSnapshot(requestsQuery, snapshot => {
  allRequests = [];
  snapshot.forEach(docSnap => {
    const data = docSnap.data() || {};
    // Normalize votes
    let votes = data.votes;
    if (typeof votes === "string") votes = Number(votes) || 0;
    if (votes == null || Number.isNaN(votes)) votes = 0;

    // Normalize createdAt into createdMillis
    let createdMillis = 0;
    const rawCreated = data.createdAt;
    if (rawCreated) {
      if (typeof rawCreated.toMillis === "function") {
        // Firestore Timestamp
        createdMillis = rawCreated.toMillis();
      } else if (rawCreated.seconds && rawCreated.nanoseconds !== undefined) {
        // another Timestamp-like object
        createdMillis = (rawCreated.seconds * 1000) + Math.floor((rawCreated.nanoseconds||0) / 1e6);
      } else {
        // maybe stored as Date string or JS Date
        const d = new Date(rawCreated);
        if (!isNaN(d)) createdMillis = d.getTime();
      }
    }
    allRequests.push({
      id: docSnap.id,
      text: data.text || "",
      votes,
      createdMillis,
      raw: data
    });
  });
  renderRequests(); // render after updating cache
});

// Render with robust sorting (handles many option label variants)
function renderRequests() {
  let requests = [...allRequests]; // clone

  // determine the sort mode even if the <option>'s value is a human label
  const rawVal = (sortSelect && sortSelect.value) ? String(sortSelect.value).toLowerCase() : "votes";
  const labelVal = (sortSelect && sortSelect.options && sortSelect.options[sortSelect.selectedIndex]) ? String(sortSelect.options[sortSelect.selectedIndex].text).toLowerCase() : "";
  const val = rawVal || labelVal;

  const isVotes = val.includes("vote") || val.includes("most");
  const isNewest = val.includes("new") || val.includes("recent");
  const isOldest = val.includes("old") || val.includes("earl");

  if (isVotes) {
    requests.sort((a,b) => (b.votes || 0) - (a.votes || 0));
  } else if (isNewest) {
    requests.sort((a,b) => (b.createdMillis || 0) - (a.createdMillis || 0));
  } else if (isOldest) {
    requests.sort((a,b) => (a.createdMillis || 0) - (b.createdMillis || 0));
  } else {
    // fallback: votes desc
    requests.sort((a,b) => (b.votes || 0) - (a.votes || 0));
  }

  // Build UI
  requestList.innerHTML = "";
  requests.forEach(req => {
    const li = document.createElement("li");
    li.className = "request-item";
    li.innerHTML = `
      <span class="req-text">${escapeHtml(req.text)}</span>
      <span class="vote-buttons">
        <button class="upvote">👍</button>
        <button class="downvote">👎</button>
        <span class="vote-count">${req.votes}</span>
      </span>
      <div class="imdb-popup hidden"></div>
    `;

    // Voting handlers (update Firestore and optimistic UI)
    const upBtn = li.querySelector(".upvote");
    const downBtn = li.querySelector(".downvote");
    const voteCountSpan = li.querySelector(".vote-count");

    upBtn.addEventListener("click", async (e) => {
      e.stopPropagation();
      await handleVote(req.id, 1);
    });
    downBtn.addEventListener("click", async (e) => {
      e.stopPropagation();
      await handleVote(req.id, -1);
    });

    // IMDb popup (fetch lazily on first hover / tap)
    const imdbBox = li.querySelector(".imdb-popup");
    let imdbLoaded = false;
    const loadIMDbIfNeeded = async () => {
      if (imdbLoaded) return;
      imdbLoaded = true;
      const details = await fetchIMDbDetails(req.text);
      if (details && details.Response !== "False") {
        imdbBox.innerHTML = `
          <img src="${details.Poster !== "N/A" ? details.Poster : ""}" alt="${escapeHtml(details.Title||'')}" />
          <div class="imdb-info">
            <strong>${escapeHtml(details.Title||'')} ${details.Year ? '('+escapeHtml(details.Year)+')' : ''}</strong><br>
            ⭐ ${escapeHtml(details.imdbRating||'N/A')} / 10<br>
            <small>${escapeHtml((details.Plot||'').slice(0,120))}${(details.Plot && details.Plot.length>120)?'...':''}</small><br>
            <a href="https://www.imdb.com/title/${escapeHtml(details.imdbID||'')}/" target="_blank" rel="noopener">View on IMDb</a>
          </div>
        `;
      } else {
        imdbBox.innerHTML = `<div style="padding:8px;color:#bbb">No IMDb details found</div>`;
      }
    };

    // show/hide on desktop hover + toggles on mobile click
    li.addEventListener("mouseenter", async () => {
      await loadIMDbIfNeeded();
      imdbBox.classList.remove("hidden");
    });
    li.addEventListener("mouseleave", () => imdbBox.classList.add("hidden"));
    li.addEventListener("click", async () => {
      await loadIMDbIfNeeded();
      imdbBox.classList.toggle("hidden");
    });

    requestList.appendChild(li);
  });
}

// handle vote with optimistic UI: update local cache quickly and then Firestore
async function handleVote(id, delta) {
  const voteKey = "requestVote_" + id;
  if (localStorage.getItem(voteKey)) {
    alert("You already voted on this request!");
    return;
  }

  // optimistic update in local cache
  for (let item of allRequests) {
    if (item.id === id) {
      item.votes = (Number(item.votes) || 0) + delta;
      break;
    }
  }
  renderRequests(); // re-render immediately

  // persist to Firestore
  try {
    const ref = doc(db, "requests", id);
    const snap = await getDoc(ref);
    const currentVotes = (snap.exists() && typeof snap.data().votes !== 'undefined') ? Number(snap.data().votes) : 0;
    await updateDoc(ref, { votes: currentVotes + delta });
    localStorage.setItem(voteKey, "true");
  } catch (err) {
    console.error("Failed to update vote:", err);
    alert("Vote failed. Please try again.");
    // Optionally revert optimistic update by re-fetching snapshot (onSnapshot will do that)
  }
}

// ------------- IMDb fetching -------------
async function fetchIMDbDetails(title) {
  const apiKey = "edaff8bc"; // put your OMDb key here
  const url = `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${apiKey}`;
  try {
    const res = await fetch(url);
    return await res.json();
  } catch (err) {
    console.error("OMDb fetch failed:", err);
    return { Response: "False" };
  }
}

// ------------- Sorting listener -------------
if (sortSelect) {
  sortSelect.addEventListener("change", () => {
    renderRequests();
  });
}

// Small helper to escape HTML inserted into text nodes
function escapeHtml(str){
  if (!str) return "";
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

//ads sideshow
const ads = [
  { img: "https://i.imgur.com/sUSg6GH.gif", link: "https://motionpicturemafia.com/support-us"},
  { img: "https://i.imgur.com/oa0eAKM.jpeg", link: "https://wa.me/p/32088611110753641/94766963036" },
  { img: "https://i.imgur.com/sUSg6GH.gif", link: "https://motionpicturemafia.com/support-us"},
  { img: "https://i.imgur.com/pr2H7hf.jpeg", link: "https://wa.me/p/32088611110753641/94766963036" }
];

let current = 0;
const adImg = document.querySelector('#ad-rotator img');
const adLink = document.querySelector('#ad-rotator a');

setInterval(() => {
  current = (current + 1) % ads.length;
  adImg.style.opacity = 0;
  setTimeout(() => {
    adImg.src = ads[current].img;
    adLink.href = ads[current].link;
    adImg.style.opacity = 1;
  }, 1000);
}, 5000);