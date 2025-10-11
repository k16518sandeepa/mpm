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