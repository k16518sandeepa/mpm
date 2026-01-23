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

const navToggle = document.getElementById("navToggle");
  const navDrawer = document.getElementById("navDrawer");
  const navBackdrop = document.getElementById("navBackdrop");
  const navClose = document.getElementById("navClose");

  function openNav() {
    document.body.classList.add("nav-open");
    navToggle.setAttribute("aria-expanded", "true");
    navDrawer.setAttribute("aria-hidden", "false");
  }

  function closeNav() {
    document.body.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
    navDrawer.setAttribute("aria-hidden", "true");
  }

  navToggle.addEventListener("click", () => {
    if (document.body.classList.contains("nav-open")) closeNav();
    else openNav();
  });

  navClose.addEventListener("click", closeNav);
  navBackdrop.addEventListener("click", closeNav);

  // Close when clicking a link
  navDrawer.addEventListener("click", (e) => {
    if (e.target.tagName === "A") closeNav();
  });

  // Close on ESC key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
  });