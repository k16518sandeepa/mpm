// main.js – Put this file once, use in ALL pages
document.addEventListener("DOMContentLoaded", () => {
  // === Christmas Snowflakes (real symbols) ===
  const snowContainer = document.getElementById("snow");
  const symbols = ["❄", "❅", "❆", "✵", "★", "✻", "✽"];

  function createSnowflake() {
    const flake = document.createElement("div");
    flake.className = "snowflake";
    flake.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    flake.style.left = Math.random() * 100 + "vw";
    flake.style.animationDuration = Math.random() * 8 + 10 + "s";
    flake.style.fontSize = Math.random() * 15 + 12 + "px";
    flake.style.opacity = Math.random() * 0.6 + 0.4;
    snowContainer.appendChild(flake);
    setTimeout(() => flake.remove(), 20000);
  }
  setInterval(createSnowflake, 350);

  // === Theme Music Auto-Play with Fade-in ===
  const themeSong = document.getElementById("themeSong");
  if (themeSong) {
    let played = false;
    const playMusic = () => {
      if (played) return;
      themeSong.volume = 0;
      themeSong.play();
      played = true;
      let vol = 0;
      const fade = setInterval(() => {
        vol = Math.min(vol + 0.01, 0.5);
        themeSong.volume = vol;
        if (vol >= 0.5) clearInterval(fade);
      }, 100);
    };
    document.addEventListener("click", playMusic, { once: true });
    document.addEventListener("touchstart", playMusic, { once: true });
  }
});