import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  increment
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

import { app } from "../firebase-config.js";

const auth = getAuth(app);
const db = getFirestore(app);

// Elements
const loginSection = document.getElementById("loginSection");
const dashboardSection = document.getElementById("dashboardSection");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const publishBtn = document.getElementById("publishBtn");
const articlesList = document.getElementById("articlesList");

// Login
loginBtn.addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    alert("❌ Login failed: " + err.message);
  }
});

logoutBtn.addEventListener("click", () => signOut(auth));

onAuthStateChanged(auth, (user) => {
  if (user) {
    loginSection.classList.add("hidden");
    dashboardSection.classList.remove("hidden");
    logoutBtn.classList.remove("hidden");
    loadArticles();
  } else {
    loginSection.classList.remove("hidden");
    dashboardSection.classList.add("hidden");
    logoutBtn.classList.add("hidden");
  }
});

// Add Article
publishBtn.addEventListener("click", async () => {
  const title = document.getElementById("articleTitle").value.trim();
  const content = document.getElementById("articleContent").value.trim();
  const image = document.getElementById("articleImage").value.trim();

  if (!title || !content) {
    alert("⚠️ Please fill title and content");
    return;
  }

  try {
    await addDoc(collection(db, "articles"), {
      title,
      content,
      image,
      views: 0,
      date: new Date().toISOString()
    });
    alert("✅ Article published!");
    loadArticles();
  } catch (err) {
    alert("❌ Error: " + err.message);
  }
});

// Load Articles
async function loadArticles() {
  articlesList.innerHTML = "⏳ Loading...";
  const snapshot = await getDocs(collection(db, "articles"));
  let html = "";
  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    html += 
      <div class="article-item">
        <strong>${data.title}</strong><br>
        Views: ${data.views || 0}<br>
        <small>${new Date(data.date).toLocaleString()}</small>
      </div>
    ;
  });
  articlesList.innerHTML = html || "No articles yet.";
}