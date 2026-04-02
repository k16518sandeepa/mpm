/**
 * =====================================================
 *   MPM AWURUDU THEME — Sinhala & Tamil New Year
 *   awurudu-theme.js  |  Version 1.0
 *   Drop one <script> tag on any page — done.
 * =====================================================
 *
 *  USAGE:
 *    <script src="/awurudu-theme.js"></script>
 *
 *  CONFIG (optional — set BEFORE the script tag):
 *    <script>
 *      window.AWURUDU_CONFIG = {
 *        year: 2025,           // Awurudu year (default 2025 → Sinhala 1947)
 *        petalCount: 35,       // falling petals (default 35)
 *        showBanner: true,     // show top banner (default true)
 *        showPopup: true,      // show greeting popup (default true)
 *        popupOnce: true,      // show popup only once per session (default true)
 *        accentColor: '#FFB300' // override accent (default gold)
 *      };
 *    </script>
 * =====================================================
 */

(function () {
  "use strict";

  /* ── CONFIG ─────────────────────────────────────── */
  const CFG = Object.assign(
    {
      year: 2025,
      petalCount: 35,
      showBanner: true,
      showPopup: true,
      popupOnce: true,
      accentColor: "#FFB300",
    },
    window.AWURUDU_CONFIG || {}
  );

  const SINHALESE_YEAR = CFG.year + 543 - 1;   // ~1947
  const SESSION_KEY = "mpm_awurudu_seen";

  /* ── PALETTE ─────────────────────────────────────── */
  const COLORS = {
    gold:    "#FFB300",
    saffron: "#FF6B00",
    crimson: "#C0392B",
    lotus:   "#E84393",
    leaf:    "#27AE60",
    sky:     "#0095C8",
    cream:   "#FFF8E7",
    dark:    "rgba(15,10,5,0.97)",
  };

  /* ── PETAL SHAPES (SVG paths) ──────────────────────
     Mix of lotus, frangipani, jasmine, betel leaf     */
  const PETAL_SVGS = [
    // Lotus petal
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 60">
      <path d="M20 58 C8 45 2 32 5 18 C8 4 20 2 20 2 C20 2 32 4 35 18 C38 32 32 45 20 58Z" fill="COLOR" opacity="0.85"/>
    </svg>`,
    // Frangipani petal
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
      <ellipse cx="25" cy="30" rx="12" ry="22" fill="COLOR" opacity="0.82" transform="rotate(-15 25 30)"/>
    </svg>`,
    // Round flower
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="16" fill="COLOR" opacity="0.75"/>
      <circle cx="20" cy="20" r="6" fill="white" opacity="0.4"/>
    </svg>`,
    // Betel leaf
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35 55">
      <path d="M17 53 C6 40 2 25 8 12 C12 3 24 3 29 12 C35 25 30 40 17 53Z" fill="COLOR" opacity="0.80"/>
      <line x1="17" y1="53" x2="17" y2="5" stroke="white" stroke-width="1" opacity="0.3"/>
    </svg>`,
    // Star / jasmine
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
      <polygon points="20,2 24,15 38,15 27,24 31,38 20,29 9,38 13,24 2,15 16,15" fill="COLOR" opacity="0.80"/>
    </svg>`,
  ];

  const PETAL_COLORS = [
    COLORS.gold, COLORS.saffron, COLORS.lotus,
    COLORS.leaf, "#FF8F00", "#FF4081", "#FFEB3B",
    "#66BB6A", "#29B6F6", "#EF5350",
  ];

  /* ── OIL LAMP SVG ───────────────────────────────── */
  const LAMP_SVG = `
    <svg class="aw-lamp" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 120" width="60" height="90">
      <!-- Flame -->
      <g class="aw-flame-group">
        <ellipse class="aw-flame-outer" cx="40" cy="28" rx="10" ry="18" fill="#FF6B00" opacity="0.9"/>
        <ellipse class="aw-flame-inner" cx="40" cy="30" rx="5" ry="11" fill="#FFEB3B" opacity="0.95"/>
        <ellipse cx="40" cy="34" rx="2.5" ry="5" fill="white" opacity="0.8"/>
      </g>
      <!-- Wick holder -->
      <rect x="36" y="44" width="8" height="4" rx="2" fill="#8D6E63"/>
      <!-- Oil cup -->
      <path d="M20 48 Q20 68 40 70 Q60 68 60 48 Q55 44 40 44 Q25 44 20 48Z" fill="#D4A017" stroke="#8D6E63" stroke-width="1.5"/>
      <!-- Stem -->
      <rect x="36" y="68" width="8" height="28" rx="4" fill="#B8860B"/>
      <!-- Base -->
      <ellipse cx="40" cy="98" rx="24" ry="8" fill="#8D6E63"/>
      <ellipse cx="40" cy="104" rx="20" ry="5" fill="#6D4C41"/>
      <!-- Decorative band on cup -->
      <path d="M22 55 Q40 58 58 55" stroke="#8D6E63" stroke-width="1.5" fill="none" opacity="0.6"/>
    </svg>`;

  /* ── KOLAM / RANGOLI pattern (SVG) ─────────────── */
  const KOLAM_SVG = `
    <svg class="aw-kolam" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="180" height="180">
      <defs>
        <radialGradient id="kg1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#FFB300" stop-opacity="0.6"/>
          <stop offset="100%" stop-color="#FF6B00" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="95" fill="none" stroke="#FFB300" stroke-width="1" opacity="0.3"/>
      <circle cx="100" cy="100" r="75" fill="none" stroke="#FF6B00" stroke-width="0.8" opacity="0.3"/>
      <circle cx="100" cy="100" r="55" fill="none" stroke="#FFB300" stroke-width="0.8" opacity="0.3"/>
      <!-- 8 petals -->
      ${Array.from({length:8}).map((_,i)=>{
        const a = i*45, r=`rotate(${a} 100 100)`;
        return `<ellipse cx="100" cy="40" rx="10" ry="28" fill="#FFB300" opacity="0.18" transform="${r}"/>`;
      }).join("")}
      <!-- 8 inner dots -->
      ${Array.from({length:8}).map((_,i)=>{
        const angle = i*45*(Math.PI/180);
        const x = 100+55*Math.sin(angle), y = 100-55*Math.cos(angle);
        return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4" fill="#FFB300" opacity="0.5"/>`;
      }).join("")}
      <!-- Center -->
      <circle cx="100" cy="100" r="14" fill="url(#kg1)" opacity="0.8"/>
      <circle cx="100" cy="100" r="6" fill="#FFB300" opacity="0.7"/>
    </svg>`;

  /* ── CSS ─────────────────────────────────────────── */
  function injectCSS() {
    const css = `
/* ═══════════════════════════════════════════════
   MPM Awurudu Theme  |  awurudu-theme.js
═══════════════════════════════════════════════ */

:root {
  --aw-gold:    ${COLORS.gold};
  --aw-saffron: ${COLORS.saffron};
  --aw-crimson: ${COLORS.crimson};
  --aw-leaf:    ${COLORS.leaf};
  --aw-dark:    ${COLORS.dark};
  --aw-cream:   ${COLORS.cream};
  --aw-accent:  ${CFG.accentColor};
}

/* ── Banner ─────────────────────────────── */
#aw-banner {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 99999;
  height: 44px;
  background: linear-gradient(90deg,
    #1a0800 0%,
    #3d1200 15%,
    #7a2800 30%,
    #C0392B 45%,
    #FFB300 55%,
    #FF6B00 65%,
    #7a2800 80%,
    #3d1200 90%,
    #1a0800 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0 2px 20px rgba(255,179,0,0.35);
  border-bottom: 1px solid rgba(255,179,0,0.4);
}

#aw-banner::before,
#aw-banner::after {
  content: '';
  position: absolute;
  top: 0; bottom: 0;
  width: 60px;
  pointer-events: none;
}
#aw-banner::before { left: 0; background: linear-gradient(90deg, #1a0800, transparent); }
#aw-banner::after  { right: 0; background: linear-gradient(-90deg, #1a0800, transparent); }

.aw-banner-track {
  display: flex;
  align-items: center;
  gap: 0;
  white-space: nowrap;
  animation: aw-scroll 30s linear infinite;
  will-change: transform;
}
.aw-banner-track:hover { animation-play-state: paused; }

@keyframes aw-scroll {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.aw-banner-item {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 0 28px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--aw-cream);
  text-shadow: 0 0 12px rgba(255,179,0,0.6);
}
.aw-banner-item.si { color: #FFD700; font-size: 14px; }
.aw-banner-item.ta { color: #FFA500; font-size: 13.5px; }
.aw-banner-item.en { color: #FFECB3; font-size: 12px; letter-spacing: 0.15em; }

.aw-banner-sep {
  display: inline-block;
  width: 6px; height: 6px;
  background: var(--aw-gold);
  border-radius: 50%;
  opacity: 0.6;
  margin: 0 4px;
}

#aw-banner-close {
  position: absolute;
  right: 10px; top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: rgba(255,220,150,0.6);
  font-size: 18px;
  cursor: pointer;
  z-index: 2;
  line-height: 1;
  padding: 4px 8px;
  transition: color 0.2s;
}
#aw-banner-close:hover { color: var(--aw-gold); }

/* ── Body offset when banner visible ─────── */
body.aw-banner-on { padding-top: 44px !important; }

/* ── Petals ──────────────────────────────── */
#aw-petal-canvas {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 99998;
  overflow: hidden;
}

.aw-petal {
  position: absolute;
  top: -80px;
  will-change: transform, opacity;
  pointer-events: none;
}

/* ── Popup ───────────────────────────────── */
#aw-popup-overlay {
  position: fixed;
  inset: 0;
  z-index: 100000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(10,5,0,0.82);
  backdrop-filter: blur(6px);
  animation: aw-fadein 0.4s ease;
}

@keyframes aw-fadein  { from { opacity:0 } to { opacity:1 } }
@keyframes aw-fadeout { from { opacity:1 } to { opacity:0 } }
@keyframes aw-rise    { from { opacity:0; transform:translateY(30px) scale(0.96) } to { opacity:1; transform:translateY(0) scale(1) } }

#aw-popup {
  position: relative;
  width: min(520px, 94vw);
  background: linear-gradient(160deg, #1c0a00 0%, #2d1000 40%, #1a0c04 100%);
  border: 1px solid rgba(255,179,0,0.35);
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 0 60px rgba(255,107,0,0.25), 0 0 120px rgba(192,57,43,0.15);
  animation: aw-rise 0.5s cubic-bezier(0.22,1,0.36,1) both;
}

/* top flame band */
#aw-popup::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, #FF6B00, #FFB300, #FF6B00, transparent);
}

.aw-popup-header {
  position: relative;
  padding: 32px 32px 0;
  text-align: center;
}

.aw-popup-lamps {
  display: flex;
  justify-content: center;
  gap: 28px;
  margin-bottom: 12px;
}

.aw-lamp { filter: drop-shadow(0 0 10px rgba(255,179,0,0.5)); }

/* Flame animation */
@keyframes aw-flicker {
  0%,100% { transform: scaleY(1)   scaleX(1)    translateY(0);   opacity:0.9; }
  25%      { transform: scaleY(1.1) scaleX(0.9)  translateY(-2px); opacity:1;   }
  50%      { transform: scaleY(0.95) scaleX(1.05) translateY(1px); opacity:0.85;}
  75%      { transform: scaleY(1.05) scaleX(0.95) translateY(-1px);opacity:0.95;}
}
.aw-flame-group { transform-origin: 40px 44px; animation: aw-flicker 1.8s ease-in-out infinite; }
.aw-flame-outer { animation: aw-flicker 1.4s ease-in-out infinite 0.2s; transform-origin: 40px 36px; }
.aw-flame-inner { animation: aw-flicker 1.1s ease-in-out infinite 0.05s; transform-origin: 40px 36px; }

.aw-popup-kolam-wrap {
  position: absolute;
  top: 0; left: 50%;
  transform: translateX(-50%);
  opacity: 0.12;
  pointer-events: none;
}

.aw-popup-year {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 13px;
  letter-spacing: 0.3em;
  color: var(--aw-gold);
  text-transform: uppercase;
  opacity: 0.8;
  margin-bottom: 8px;
}

.aw-popup-greeting-si {
  font-size: clamp(24px, 6vw, 38px);
  font-weight: 900;
  line-height: 1.1;
  background: linear-gradient(135deg, #FFD700 0%, #FF8C00 50%, #FF4500 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 6px;
  text-shadow: none;
}

.aw-popup-greeting-ta {
  font-size: clamp(18px, 4.5vw, 28px);
  font-weight: 700;
  color: #FFA040;
  margin-bottom: 20px;
  line-height: 1.3;
}

.aw-popup-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 32px 20px;
}
.aw-popup-divider-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,179,0,0.4), transparent);
}
.aw-popup-divider-dot {
  width: 7px; height: 7px;
  background: var(--aw-gold);
  border-radius: 50%;
  box-shadow: 0 0 8px var(--aw-gold);
}

.aw-popup-body {
  padding: 0 32px 28px;
  text-align: center;
}

.aw-popup-en {
  font-size: 15px;
  color: rgba(255,240,200,0.85);
  line-height: 1.6;
  margin-bottom: 20px;
}

.aw-popup-badges {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}
.aw-badge {
  padding: 5px 14px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.aw-badge-si {
  background: rgba(192,57,43,0.25);
  border: 1px solid rgba(192,57,43,0.5);
  color: #FF8A80;
}
.aw-badge-ta {
  background: rgba(255,107,0,0.2);
  border: 1px solid rgba(255,107,0,0.45);
  color: #FFAB40;
}
.aw-badge-year {
  background: rgba(255,179,0,0.15);
  border: 1px solid rgba(255,179,0,0.4);
  color: var(--aw-gold);
}

#aw-popup-btn {
  display: inline-block;
  padding: 13px 40px;
  background: linear-gradient(135deg, #C0392B, #FF6B00, #FFB300);
  background-size: 200% 100%;
  background-position: 100% 0;
  border: none;
  border-radius: 30px;
  color: #fff;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background-position 0.4s ease, transform 0.15s, box-shadow 0.3s;
  box-shadow: 0 4px 20px rgba(255,107,0,0.35);
}
#aw-popup-btn:hover {
  background-position: 0 0;
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(255,107,0,0.5);
}
#aw-popup-btn:active { transform: translateY(0); }

#aw-popup-close {
  position: absolute;
  top: 14px; right: 16px;
  background: none;
  border: 1px solid rgba(255,179,0,0.25);
  border-radius: 50%;
  width: 28px; height: 28px;
  display: flex; align-items: center; justify-content: center;
  color: rgba(255,200,100,0.6);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}
#aw-popup-close:hover {
  border-color: var(--aw-gold);
  color: var(--aw-gold);
  background: rgba(255,179,0,0.08);
}

/* decorative corner ornaments */
.aw-corner {
  position: absolute;
  width: 48px; height: 48px;
  opacity: 0.35;
}
.aw-corner svg { width: 100%; height: 100%; }
.aw-corner-tl { top: 10px; left: 10px; }
.aw-corner-tr { top: 10px; right: 10px; transform: scaleX(-1); }

/* ── Subtle page sparkle dots ─────────────── */
.aw-sparkle {
  position: fixed;
  pointer-events: none;
  z-index: 99997;
  border-radius: 50%;
  animation: aw-sparkle-anim var(--dur, 3s) ease-in-out infinite var(--delay, 0s);
}
@keyframes aw-sparkle-anim {
  0%,100% { opacity:0; transform: scale(0.5); }
  50%      { opacity: var(--op, 0.6); transform: scale(1); }
}
    `;
    const style = document.createElement("style");
    style.id = "aw-styles";
    style.textContent = css;
    document.head.appendChild(style);
  }

  /* ── BANNER ──────────────────────────────────────── */
  function buildBanner() {
    if (!CFG.showBanner) return;

    const items = [
      { cls: "si", text: "සුභ අලුත් අවුරුද්දක් වේවා!" },
      { cls: "ta", text: "இனிய தமிழ் புத்தாண்டு நல்வாழ்த்துக்கள்!" },
      { cls: "en", text: `HAPPY SINHALA & TAMIL NEW YEAR ${CFG.year}` },
      { cls: "si", text: `සිංහල නව වසර ${SINHALESE_YEAR}` },
      { cls: "ta", text: "வாழ்க வளமுடன்!" },
      { cls: "en", text: "🌸  AVURUDU GREETINGS FROM MPM  🌸" },
    ];

    const makeItems = () =>
      items
        .map(
          (it) =>
            `<span class="aw-banner-item ${it.cls}">${it.text}</span><span class="aw-banner-sep"></span>`
        )
        .join("");

    const banner = document.createElement("div");
    banner.id = "aw-banner";
    banner.innerHTML = `
      <div class="aw-banner-track">
        ${makeItems()}${makeItems()}
      </div>
      <button id="aw-banner-close" aria-label="Close Awurudu banner">✕</button>
    `;
    document.body.prepend(banner);
    document.body.classList.add("aw-banner-on");

    document.getElementById("aw-banner-close").addEventListener("click", () => {
      banner.style.transition = "opacity 0.3s, transform 0.3s";
      banner.style.opacity = "0";
      banner.style.transform = "translateY(-100%)";
      setTimeout(() => {
        banner.remove();
        document.body.classList.remove("aw-banner-on");
      }, 320);
    });
  }

  /* ── FALLING PETALS ──────────────────────────────── */
  function buildPetals() {
    const canvas = document.createElement("div");
    canvas.id = "aw-petal-canvas";
    document.body.appendChild(canvas);

    const vw = () => window.innerWidth;
    const vh = () => window.innerHeight;

    function createPetal() {
      const template = PETAL_SVGS[Math.floor(Math.random() * PETAL_SVGS.length)];
      const color = PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];
      const svg = template.replace(/COLOR/g, color);

      const size = 18 + Math.random() * 28;
      const el = document.createElement("div");
      el.className = "aw-petal";
      el.innerHTML = svg;
      el.querySelector("svg").style.cssText = `width:${size}px;height:auto`;

      const startX = Math.random() * (vw() + 100) - 50;
      const duration = 6000 + Math.random() * 9000;
      const delay = Math.random() * 12000;
      const swayAmount = 60 + Math.random() * 100;
      const rotateStart = Math.random() * 360;
      const rotateDelta = (Math.random() - 0.5) * 540;

      el.style.left = startX + "px";
      el.style.opacity = "0";
      canvas.appendChild(el);

      let start = null;

      function animate(ts) {
        if (!start) start = ts + delay;
        const elapsed = ts - start;
        if (elapsed < 0) { requestAnimationFrame(animate); return; }

        const progress = (elapsed % (duration + delay)) / duration;
        if (progress > 1) {
          el.style.opacity = "0";
          setTimeout(() => {
            el.style.left = (Math.random() * (vw() + 100) - 50) + "px";
            start = null;
          }, 200);
          requestAnimationFrame(animate);
          return;
        }

        const y = progress * (vh() + 100) - 80;
        const sway = Math.sin(progress * Math.PI * 3) * swayAmount;
        const rotate = rotateStart + rotateDelta * progress;
        const opacity = progress < 0.08
          ? progress / 0.08
          : progress > 0.88
          ? (1 - progress) / 0.12
          : 0.7 + Math.random() * 0.3 * 0;

        el.style.opacity = opacity.toFixed(2);
        el.style.transform = `translate(${sway.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${rotate.toFixed(1)}deg)`;

        requestAnimationFrame(animate);
      }

      requestAnimationFrame(animate);
    }

    for (let i = 0; i < CFG.petalCount; i++) {
      setTimeout(() => createPetal(), i * 340 + Math.random() * 400);
    }
  }

  /* ── SPARKLE DOTS ─────────────────────────────────── */
  function buildSparkles() {
    const sparkleColors = [COLORS.gold, COLORS.saffron, "#FFF0A0", COLORS.lotus];
    for (let i = 0; i < 18; i++) {
      const s = document.createElement("div");
      s.className = "aw-sparkle";
      const size = 2 + Math.random() * 4;
      s.style.cssText = `
        width:${size}px; height:${size}px;
        background:${sparkleColors[i % sparkleColors.length]};
        left:${Math.random() * 100}vw;
        top:${Math.random() * 100}vh;
        --dur:${2 + Math.random() * 4}s;
        --delay:${Math.random() * 5}s;
        --op:${0.3 + Math.random() * 0.4};
        box-shadow:0 0 ${size * 2}px ${sparkleColors[i % sparkleColors.length]};
      `;
      document.body.appendChild(s);
    }
  }

  /* ── CORNER ORNAMENT SVG ─────────────────────────── */
  const CORNER_SVG = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60">
      <path d="M5 55 Q5 5 55 5" stroke="#FFB300" stroke-width="2" fill="none"/>
      <circle cx="5" cy="55" r="4" fill="#FF6B00"/>
      <circle cx="55" cy="5"  r="4" fill="#FF6B00"/>
      <circle cx="5"  cy="5"  r="3" fill="#FFB300" opacity="0.5"/>
      <path d="M5 40 Q18 18 40 5" stroke="#FFB300" stroke-width="1" fill="none" opacity="0.5"/>
      <path d="M5 28 Q18 12 28 5" stroke="#FFB300" stroke-width="0.8" fill="none" opacity="0.3"/>
    </svg>`;

  /* ── POPUP ───────────────────────────────────────── */
  function buildPopup() {
    if (!CFG.showPopup) return;
    if (CFG.popupOnce && sessionStorage.getItem(SESSION_KEY)) return;

    const overlay = document.createElement("div");
    overlay.id = "aw-popup-overlay";
    overlay.innerHTML = `
      <div id="aw-popup">
        <button id="aw-popup-close" aria-label="Close">✕</button>

        <div class="aw-corner aw-corner-tl">${CORNER_SVG}</div>
        <div class="aw-corner aw-corner-tr">${CORNER_SVG}</div>

        <div class="aw-popup-kolam-wrap">${KOLAM_SVG}</div>

        <div class="aw-popup-header">
          <div class="aw-popup-lamps">
            ${LAMP_SVG}${LAMP_SVG}
          </div>
          <div class="aw-popup-year">
            Sinhala Year ${SINHALESE_YEAR} &nbsp;·&nbsp; April ${CFG.year}
          </div>
          <div class="aw-popup-greeting-si">සුභ අලුත් අවුරුද්දක් වේවා!</div>
          <div class="aw-popup-greeting-ta">இனிய தமிழ் புத்தாண்டு நல்வாழ்த்துக்கள்!</div>
        </div>

        <div class="aw-popup-divider">
          <div class="aw-popup-divider-line"></div>
          <div class="aw-popup-divider-dot"></div>
          <div class="aw-popup-divider-line"></div>
        </div>

        <div class="aw-popup-body">
          <p class="aw-popup-en">
            May this Sinhala &amp; Tamil New Year bring you joy,<br>
            prosperity, and all the blessings of the season.<br>
            <strong style="color:var(--aw-gold)">— Motion Picture Mafia Studio</strong>
          </p>

          <div class="aw-popup-badges">
            <span class="aw-badge aw-badge-si">සිංහල ජාතික නව වසර</span>
            <span class="aw-badge aw-badge-ta">தமிழ் புத்தாண்டு</span>
            <span class="aw-badge aw-badge-year">Awurudu ${CFG.year}</span>
          </div>

          <button id="aw-popup-btn">🌸 &nbsp;Subha Awuruddak!</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    const close = () => {
      overlay.style.animation = "aw-fadeout 0.3s ease forwards";
      setTimeout(() => overlay.remove(), 310);
      if (CFG.popupOnce) sessionStorage.setItem(SESSION_KEY, "1");
    };

    document.getElementById("aw-popup-close").addEventListener("click", close);
    document.getElementById("aw-popup-btn").addEventListener("click", close);
    overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
  }

  /* ── INIT ─────────────────────────────────────────── */
  function init() {
    injectCSS();
    buildBanner();
    buildPetals();
    buildSparkles();

    // Delay popup slightly for a nicer entry
    setTimeout(buildPopup, 600);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Public API to programmatically re-show popup
  window.AwuruduTheme = {
    showGreeting: () => { sessionStorage.removeItem(SESSION_KEY); buildPopup(); },
    hidePetals: () => { const c = document.getElementById("aw-petal-canvas"); if(c) c.remove(); },
    hideBanner: () => { document.getElementById("aw-banner-close")?.click(); },
  };

})();
