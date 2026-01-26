// main.js – ONE FILE FOR ALL PAGES
document.addEventListener("DOMContentLoaded", () => {
  // === Christmas Snow ===
  const snowContainer = document.getElementById("snow");
  //const symbols = ["❄", "❅", "❆", "✵", "★", "✻", "✽"];

  if (snowContainer) {
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
  }

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
  // === Download Tabs (Telegram / Direct) ===
  const tabsWrap = document.querySelector(".download-tabs");
  if (tabsWrap) {
    const tabButtons = Array.from(tabsWrap.querySelectorAll(".tab-btn[data-tab]"));
    const panels = Array.from(tabsWrap.querySelectorAll(".tab-panel[data-panel]"));
    // Auto-hide Direct tab if no direct links are set
    const directBtn = tabButtons.find((b) => b.dataset.tab === "direct");
    const directPanel = panels.find((p) => p.dataset.panel === "direct");
    if (directBtn && directPanel) {
      const directLinks = Array.from(directPanel.querySelectorAll("a.direct-link[href]"));
      const hasDirect = directLinks.some((a) => {
        const href = (a.getAttribute("href") || "").trim();
        return href && href !== "#" && !href.toLowerCase().startsWith("javascript:");
      });

      if (!hasDirect) {
        // Hide Direct option completely
        directBtn.style.display = "none";
        directPanel.style.display = "none";

        // If user previously selected direct, force telegram and clean storage
        const savedTab = localStorage.getItem("mpm_download_tab");
        if (savedTab === "direct") localStorage.removeItem("mpm_download_tab");
      }
    }

    // If only one tab visible, hide the tab header for a cleaner UI
    const tabsHeader = tabsWrap.querySelector(".tab-buttons");
    const visibleButtons = tabButtons.filter((b) => b.style.display !== "none");
    if (tabsHeader && visibleButtons.length <= 1) {
      tabsHeader.style.display = "none";
    }


    const activateTab = (name, save = true) => {
      tabButtons.forEach((btn) => {
        const isActive = btn.dataset.tab === name;
        btn.classList.toggle("active", isActive);
        btn.setAttribute("aria-selected", isActive ? "true" : "false");
      });

      panels.forEach((panel) => {
        panel.classList.toggle("active", panel.dataset.panel === name);
      });

      if (save) localStorage.setItem("mpm_download_tab", name);
    };

    // Restore last selected tab
    const saved = localStorage.getItem("mpm_download_tab");
    if (saved && ["telegram", "direct"].includes(saved)) activateTab(saved, false);

    tabButtons.forEach((btn) => {
      btn.addEventListener("click", () => activateTab(btn.dataset.tab));
    });

    // Mobile swipe between tabs (optional nice touch)
    let startX = 0;
    tabsWrap.addEventListener("touchstart", (e) => {
      startX = e.changedTouches[0].screenX;
    }, { passive: true });

    tabsWrap.addEventListener("touchend", (e) => {
      if (!startX) return;
      const endX = e.changedTouches[0].screenX;
      const diff = endX - startX;

      if (Math.abs(diff) > 70) {
        const current = tabButtons.find((b) => b.classList.contains("active"))?.dataset.tab || "telegram";
        const next = diff < 0 ? "direct" : "telegram"; // swipe left -> direct, right -> telegram
        if (current !== next) activateTab(next);
      }
      startX = 0;
    }, { passive: true });
  }

});