// Page transition animation
document.querySelectorAll('.tabs a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = link.getAttribute('href');
    document.body.classList.add('page-exit');
    setTimeout(() => {
      window.location.href = target;
    }, 400);
  });
});

// Countdown Timer for active giveaways
function updateCountdowns() {
  const now = new Date().getTime();
  const cards = document.querySelectorAll("[data-end]");

  cards.forEach(card => {
    const end = new Date(card.dataset.end).getTime();
    const diff = end - now;
    const display = card.querySelector(".countdown");

    if (!display) return;

    if (isNaN(end)) {
      display.textContent = "Invalid date";
      display.style.color = "#ff4655";
      return;
    }

    if (diff <= 0) {
      display.textContent = "⏰ Ended";
      display.style.color = "#ff4655";
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);

    display.textContent = `⏰ ${d}d ${h}h ${m}m ${s}s`;

    // Glow animation if less than 1h left
    if (diff < 3600000) {
      display.style.animation = "pulse 1s infinite alternate";
      display.style.color = "#ff4655";
    }
  });
}

setInterval(updateCountdowns, 1000);
updateCountdowns();

// Add glowing pulse animation style
const style = document.createElement('style');
style.textContent = `
@keyframes pulse {
  from { box-shadow: 0 0 8px #ff4655; }
  to { box-shadow: 0 0 16px #ff8c00; }
}`;
document.head.appendChild(style);
