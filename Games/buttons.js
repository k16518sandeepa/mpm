// ===== Theme Toggle =====
const themeToggle = document.getElementById('themeToggle');

if (themeToggle) {
  // Load saved theme
  const savedTheme = localStorage.getItem('theme') || 'dark';
  setTheme(savedTheme);
  themeToggle.checked = savedTheme === 'light';

  themeToggle.addEventListener('change', () => {
    const theme = themeToggle.checked ? 'light' : 'dark';
    setTheme(theme);
  });
}

function setTheme(theme) {
  if (theme === 'light') {
    document.body.classList.add('light-theme');
    document.body.classList.remove('dark-theme');
  } else {
    document.body.classList.add('dark-theme');
    document.body.classList.remove('light-theme');
  }
  localStorage.setItem('theme', theme);
}

// Back to top button
  const backToTopButton = document.querySelector(".back-to-top");
  window.onscroll = function() {
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
      backToTopButton.style.display = "block";
    } else {
      backToTopButton.style.display = "none";
    }
  };
  function topFunction() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Share Button Logic
  const mainShareBtn = document.getElementById('mainShareBtn');
  const socialBtns = document.getElementById('socialBtns');

  mainShareBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // prevent click bubbling
    socialBtns.classList.toggle('show');
  });

  // Collapse share buttons when clicking outside
  document.addEventListener('click', (e) => {
    if (!socialBtns.contains(e.target) && e.target !== mainShareBtn) {
      socialBtns.classList.remove('show');
    }
  });

  // Dynamic Share Links
  const pageUrl = encodeURIComponent(window.location.href);
  const pageTitle = encodeURIComponent(document.querySelector('.article h1').innerText);

  document.querySelector('.social-btns .whatsapp').href = `https://wa.me/?text=${pageTitle}%20${pageUrl}`;
  document.querySelector('.social-btns .facebook').href = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;

  //article publish time
function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return interval + " year" + (interval > 1 ? "s" : "") + " ago";

  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return interval + " month" + (interval > 1 ? "s" : "") + " ago";

  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return interval + " day" + (interval > 1 ? "s" : "") + " ago";

  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return interval + " hour" + (interval > 1 ? "s" : "") + " ago";

  interval = Math.floor(seconds / 60);
  if (interval >= 1) return interval + " minute" + (interval > 1 ? "s" : "") + " ago";

  return "just now";
}

// Apply to all articles
document.querySelectorAll(".article-card").forEach(card => {
  const timeEl = card.querySelector(".time");
  const date = card.dataset.time;
  if (date) timeEl.textContent = timeAgo(date);
});

  // === Helper: Generate Random Avatar ===
  function getRandomAvatar(name) {
    const seed = encodeURIComponent(name + Math.floor(Math.random() * 1000));
    return `https://api.dicebear.com/9.x/identicon/svg?seed=${seed}`;
  }

  // === Handle Comment Submission ===
  document.getElementById("postComment").addEventListener("click", async () => {
    const username = document.getElementById("username").value.trim();
    const comment = document.getElementById("comment").value.trim();
    const articleId = window.location.pathname; // current page path as article ID

    if (!username || !comment) {
      alert("Please enter your name and a comment!");
      return;
    }

    const avatar = getRandomAvatar(username);

    try {
      await db.collection("comments").add({
        articleId,
        username,
        comment,
        avatar,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });

      document.getElementById("comment").value = "";
      loadComments(); // refresh list
    } catch (err) {
      console.error("Error adding comment:", err);
      alert("Failed to post comment. Check console for details.");
    }
  });

  // === Load Comments in Real-Time ===
  function loadComments() {
    const articleId = window.location.pathname;
    db.collection("comments")
      .where("articleId", "==", articleId)
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        const commentsList = document.getElementById("commentsList");
        commentsList.innerHTML = "";
        snapshot.forEach((doc) => {
          const data = doc.data();
          const commentHTML = `
            <div style="display:flex;align-items:flex-start;margin-bottom:15px;padding:10px;border-radius:8px;background:#1e1e1e;">
              <img src="${data.avatar || getRandomAvatar(data.username)}" alt="avatar" style="width:40px;height:40px;border-radius:50%;margin-right:10px;">
              <div>
                <strong style="color:#ff0055;">${data.username}</strong><br>
                <p style="margin:5px 0;">${data.comment}</p>
                <small style="color:#aaa;">${data.timestamp ? new Date(data.timestamp.toDate()).toLocaleString() : ""}</small>
              </div>
            </div>`;
          commentsList.innerHTML += commentHTML;
        });
      });
  }

  // Initial load
  loadComments();