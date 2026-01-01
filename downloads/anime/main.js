// main.js – ONE FILE FOR ALL PAGES
document.addEventListener("DOMContentLoaded", () => {
  // === Christmas Snow ===
  const snowContainer = document.getElementById("snow");
  const symbols = ["❄", "❅", "❆", "✵", "★", "✻", "✽"];

  function createSnowflake() {
    const f = document.createElement("div");
    f.className = "snowflake";
    f.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    f.style.left = Math.random() * 100 + "vw";
    f.style.animationDuration = Math.random() * 8 + 10 + "s";
    f.style.fontSize = Math.random() * 15 + 12 + "px";
    f.style.opacity = Math.random() * 0.6 + 0.4;
    snowContainer.appendChild(f);
    setTimeout(() => f.remove(), 20000);
  }
  setInterval(createSnowflake, 350);

  // === Theme Music ===
  const themeSong = document.getElementById("themeSong");
  if (themeSong) {
    let played = false;
    const play = () => {
      if (played) return;
      themeSong.volume = 0; themeSong.play(); played = true;
      let v = 0;
      const fade = setInterval(() => {
        v = Math.min(v + 0.01, 0.5);
        themeSong.volume = v;
        if (v >= 0.5) clearInterval(fade);
      }, 100);
    };
    document.addEventListener("click", play, { once: true });
    document.addEventListener("touchstart", play, { once: true });
  }

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

  // === Stranger Things Poster Effect ===
  const poster = document.querySelector(".poster");
  if (poster) {
    poster.style.transition = "all 0.6s cubic-bezier(0.23,1,0.32,1)";
    poster.style.transform = "rotateY(-8deg) rotateX(5deg) translateZ(0)";
    poster.style.boxShadow = "0 20px 50px rgba(0,0,0,0.9), 0 0 60px rgba(255,0,0,0.5)";

    const handleMouseMove = (e) => {
      if (window.innerWidth < 768) return;
      const rect = poster.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateY = (x - centerX) / centerX * 12;
      const rotateX = (centerY - y) / centerY * 12;

      poster.style.transform = `perspective(1000px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale(1.05)`;
    };

    const resetPoster = () => {
      poster.style.transform = "rotateY(-8deg) rotateX(5deg)";
    };

    poster.addEventListener("mousemove", handleMouseMove);
    poster.addEventListener("mouseenter", () => {
      poster.style.boxShadow = "0 30px 70px rgba(0,0,0,0.95), 0 0 100px rgba(255,0,0,0.8)";
    });
    poster.addEventListener("mouseleave", resetPoster);

    // Mobile: tap to trigger red flash
    poster.addEventListener("click", () => {
      poster.style.transition = "all 0.3s";
      poster.style.boxShadow = "0 0 120px rgba(255,0,0,0.9)";
      setTimeout(() => {
        poster.style.boxShadow = "0 20px 50px rgba(0,0,0,0.9), 0 0 60px rgba(255,0,0,0.5)";
        poster.style.transition = "all 0.6s cubic-bezier(0.23,1,0.32,1)";
      }, 300);
    });
  }
});

// === Download Counter System ===
document.querySelectorAll('.download-btn[data-key]').forEach(btn => {
  const key = btn.getAttribute('data-key');
  const countSpan = btn.querySelector('.download-count');
  const originalHref = `https://t.me/mpmfilessharebot?start=${key}`;

  // Load current count
  db.ref('downloads/' + key).on('value', (snapshot) => {
    const count = snapshot.val() || 0;
    const formatted = count.toLocaleString();
    countSpan.textContent = `(${formatted} downloads)`;
  });

  // Override click to count first
  btn.addEventListener('click', (e) => {
    e.preventDefault();

    // Increment counter
    db.ref('downloads/' + key).transaction((current) => {
      return (current || 0) + 1;
    });

    // Then redirect
    window.open(originalHref, '_blank');
  });
});