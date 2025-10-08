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

// Random avatar generator
  function getRandomAvatar(username) {
    const seed = username + Math.random().toString(36).substring(2, 8);
    return `https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodeURIComponent(seed)}`;
  }

  // Handle new comment submit
  const commentForm = document.getElementById("commentForm");
  if (commentForm) {
    commentForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const username = document.getElementById("username").value.trim();
      const comment = document.getElementById("comment").value.trim();
      const articleId = window.location.pathname.split("/").pop().replace(".html", "");

      if (!username || !comment) {
        alert("Please fill out both fields.");
        return;
      }

      try {
        await addDoc(collection(db, "comments"), {
          articleId,
          username,
          comment,
          avatar: getRandomAvatar(username),
          timestamp: serverTimestamp(),
        });

        document.getElementById("username").value = "";
        document.getElementById("comment").value = "";
        alert("Comment posted successfully!");
      } catch (error) {
        console.error("Error adding comment:", error);
        alert("Failed to post comment. Check console for details.");
      }
    });
  }

  // Load comments
  async function loadComments() {
    const articleId = window.location.pathname.split("/").pop().replace(".html", "");
    const commentsSection = document.getElementById("commentsList");
    commentsSection.innerHTML = "<p>Loading comments...</p>";

    const q = query(
      collection(db, "comments"),
      where("articleId", "==", articleId),
      orderBy("timestamp", "desc")
    );

    const snapshot = await getDocs(q);
    commentsSection.innerHTML = "";

    snapshot.forEach((doc) => {
      const data = doc.data();
      const div = document.createElement("div");
      div.classList.add("comment-card");
      div.innerHTML = `
        <img src="${data.avatar}" alt="avatar">
        <div>
          <strong>${data.username}</strong><br>
          <p>${data.comment}</p>
        </div>
      `;
      commentsSection.appendChild(div);
    });

    if (snapshot.empty) {
      commentsSection.innerHTML = "<p>No comments yet. Be the first!</p>";
    }
  }

  loadComments();