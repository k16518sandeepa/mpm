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
//img popup
document.querySelectorAll('.popup-word').forEach(word => {
  const imgUrl = word.getAttribute('data-img');
  if (imgUrl) {
    const style = document.createElement('style');
    style.innerHTML = `
      .popup-word[data-img="${imgUrl}"]::after {
        background-image: url(${imgUrl});
      }
    `;
    document.head.appendChild(style);
  }

  // For mobile: tap to toggle popup
  word.addEventListener('click', e => {
    e.stopPropagation();
    document.querySelectorAll('.popup-word.active').forEach(el => {
      if (el !== word) el.classList.remove('active');
    });
    word.classList.toggle('active');
  });
});

// Close popup when tapping outside
document.addEventListener('click', () => {
  document.querySelectorAll('.popup-word.active').forEach(el => el.classList.remove('active'));
});

// Quick navigation toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('toggle-nav');
  const quickNav = document.getElementById('quick-nav');

  // Toggle show/hide when button clicked
  toggleBtn.addEventListener('click', () => {
    quickNav.classList.toggle('active');
    toggleBtn.textContent = quickNav.classList.contains('active')
      ? '❌ Close Navigation'
      : '🔽 Show Navigation';
  });

  // Detect clicks on navigation links
  document.querySelectorAll("#quick-nav a").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      const targetId = link.getAttribute("href").replace("#", "");
      const target = document.getElementById(targetId);
      if (!target) return;

      // Smooth scroll to the target section
      target.scrollIntoView({ behavior: "smooth", block: "center" });

      // Remove old highlights first
      document.querySelectorAll(".glow-highlight").forEach(el => {
        el.classList.remove("glow-highlight");
      });

      // Wait for scroll to finish, then add glow
      setTimeout(() => {
        target.classList.add("glow-highlight");
        setTimeout(() => target.classList.remove("glow-highlight"), 2000);
      }, 600);

      // Auto-hide navigation after 1 second
      setTimeout(() => {
        quickNav.classList.remove("active");
        toggleBtn.textContent = '🔽 Show Navigation';
      }, 0000);
    });
  });

  // Hide navigation if user clicks outside of it
  document.addEventListener('click', (e) => {
    if (!quickNav.contains(e.target) && !toggleBtn.contains(e.target)) {
      quickNav.classList.remove('active');
      toggleBtn.textContent = '🔽 Show Navigation';
    }
  });

  // Hide on touch (for mobile)
  document.addEventListener('touchstart', (e) => {
    if (!quickNav.contains(e.target) && !toggleBtn.contains(e.target)) {
      quickNav.classList.remove('active');
      toggleBtn.textContent = '🔽 Show Navigation';
    }
  });
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

 // === Mobile Menu + Swipe Gestures ===
  const hamburger = document.querySelector(".hamburger");
  const mobileMenu = document.querySelector(".mobile-menu");
  const body = document.body;

  function openMenu() { mobileMenu.classList.add("active"); body.style.overflow = "hidden"; }
  function closeMenu() { mobileMenu.classList.remove("active"); body.style.overflow = ""; }

  hamburger?.addEventListener("click", () => mobileMenu.classList.toggle("active"));

  // Close when tapping outside
  document.addEventListener("click", (e) => {
    if (mobileMenu.classList.contains("active") && !mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
      closeMenu();
    }
  });

  // Touch Swipe Gestures
  let touchStartX = 0;
  document.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  document.addEventListener("touchend", (e) => {
    if (!touchStartX) return;
    let touchEndX = e.changedTouches[0].screenX;
    let diff = touchEndX - touchStartX;

    if (Math.abs(diff) > 70) {  // Minimum swipe distance
      if (diff > 0) openMenu();     // Swipe right → open
      else closeMenu();             // Swipe left → close
    }
    touchStartX = 0;
  });