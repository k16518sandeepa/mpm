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

//search
  const searchBox = document.getElementById("searchBox");
  const items = document.querySelectorAll("li");

  searchBox.addEventListener("keyup", function () {
    const query = this.value.toLowerCase();
    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (text.includes(query) && query !== "") {
        item.style.display = "block";
        // Highlight match
        const regex = new RegExp(`(${query})`, "gi");
        item.innerHTML = item.textContent.replace(regex, "<span class='highlight'>$1</span>");
      } else if (query === "") {
        item.style.display = "block";
        item.innerHTML = item.textContent; // reset
      } else {
        item.style.display = "none";
      }
    });
  });
// 🔎 RAWG API fetch
async function fetchGameDetails(title) {
  const url = `https://api.rawg.io/api/games?key=0b78dbe2acc543f291ed3bf1a6062404&search=${encodeURIComponent(title)}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.results && data.results.length > 0 ? data.results[0] : null;
}

// Apply popups
document.querySelectorAll("#gameList li").forEach(async li => {
  const popup = document.createElement("div");
  popup.classList.add("popup", "hidden");
  li.appendChild(popup);

  const game = await fetchGameDetails(li.textContent);
  if (game) {
    popup.innerHTML = `
      <img src="${game.background_image}" alt="${game.name}">
      <strong>${game.name}</strong><br>
      ⭐ ${game.metacritic || "N/A"} / 100<br>
      📅 ${game.released || "Unknown"}<br>
      <small>${game.genres.map(g => g.name).join(", ")}</small>
    `;
  } else {
    popup.innerHTML = `<em>No details found</em>`;
  }

  // Desktop hover
  li.addEventListener("mouseenter", () => {
    if (window.innerWidth > 768) popup.classList.remove("hidden");
  });
  li.addEventListener("mouseleave", () => {
    if (window.innerWidth > 768) popup.classList.add("hidden");
  });

  // Mobile tap toggle
  li.addEventListener("click", () => {
    // Close all other popups first
    document.querySelectorAll(".popup").forEach(p => p.classList.add("hidden"));
    popup.classList.toggle("hidden");
  });
});

// Close popup if clicking outside (mobile safe)
document.addEventListener("click", (e) => {
  if (!e.target.closest("#gameList li")) {
    document.querySelectorAll(".popup").forEach(p => p.classList.add("hidden"));
  }
});