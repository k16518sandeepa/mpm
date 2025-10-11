// Timer Function
function countdown(id, expireDate) {
  let timer = setInterval(() => {
    let now = new Date().getTime();
    let distance = expireDate - now;

    if (distance < 0) {
      document.getElementById(id).innerHTML = "Expired ❌";
      clearInterval(timer);
      return;
    }

    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById(id).innerHTML =
      `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }, 1000);
}

// Set expiry dates
countdown("timer1", new Date("2025-09-10T23:59:59").getTime());
countdown("timer2", new Date("2025-09-15T23:59:59").getTime());
