/* ════════════════════════════════════════════════
   MPM Free Games — Shared Script
   window.PAGE_MODE must be set before this loads:
   'active' | 'soon' | 'expired'
   ════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── State ──────────────────────────────────────
  let allGames        = [];
  let activeFilter    = 'all';
  let searchQuery     = '';
  let cdIntervals     = [];

  // ── DOM refs ───────────────────────────────────
  const grid      = document.getElementById('gameGrid');
  const searchEl  = document.getElementById('searchInput');
  const filtersEl = document.getElementById('platformFilters');
  const toastEl   = document.getElementById('toast');

  // ── Boot ───────────────────────────────────────
  document.getElementById('year').textContent = new Date().getFullYear();
  setActiveTabs();
  setupHamburger();
  setupSearch();
  loadGames();

  // ── Tab / hero sync ────────────────────────────
  function setActiveTabs() {
    const mode = window.PAGE_MODE;

    // Desktop tabs
    const ptab = document.getElementById('ptab-' + mode);
    if (ptab) ptab.classList.add('active');

    // Mobile bottom tabs
    const btab = document.getElementById('btab-' + mode);
    if (btab) btab.classList.add('active');

    // Hero subtitle
    const subs = {
      active:  'Currently available — grab them before they\'re gone',
      soon:    'Coming up — mark your calendar',
      expired: 'These deals have ended'
    };
    const heroSub = document.getElementById('heroSub');
    if (heroSub) heroSub.textContent = subs[mode] || '';
  }

  // ── Hamburger ──────────────────────────────────
  function setupHamburger() {
    const btn    = document.getElementById('hamburger');
    const drawer = document.getElementById('navDrawer');
    if (!btn) return;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = drawer.classList.toggle('open');
      btn.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
    });

    document.addEventListener('click', (e) => {
      if (!btn.contains(e.target) && !drawer.contains(e.target)) {
        drawer.classList.remove('open');
        btn.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ── Search ─────────────────────────────────────
  function setupSearch() {
    if (!searchEl) return;
    let timer;
    searchEl.addEventListener('input', (e) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        searchQuery = e.target.value.toLowerCase().trim();
        render();
      }, 200);
    });
  }

  // ── Load games.json ────────────────────────────
  function loadGames() {
    fetch('games.json')
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((data) => {
        allGames = data;
        buildFilters();
        render();
      })
      .catch(() => {
        grid.innerHTML = `
          <div class="empty-state">
            ${gamepadSVG()}
            <h3>LOAD ERROR</h3>
            <p>Could not fetch games.json — please refresh the page.</p>
          </div>`;
      });
  }

  // ── Build Platform Filters ─────────────────────
  function buildFilters() {
    const now = new Date();
    const inCat = allGames.filter((g) => isInCategory(g, now));
    const platforms = [...new Set(inCat.map((g) => g.platform.toLowerCase()))].sort();

    const names = {
      epic: 'Epic', steam: 'Steam', gog: 'GOG',
      indiegala: 'IndieGala', itch: 'Itch.io',
      stove: 'Stove', ubi: 'Ubisoft', amazon: 'Amazon', prime: 'Prime'
    };

    filtersEl.innerHTML = '<button class="filter-btn active" data-platform="all">All</button>';

    platforms.forEach((p) => {
      const btn = document.createElement('button');
      btn.className = 'filter-btn';
      btn.dataset.platform = p;
      btn.textContent = names[p] || cap(p);
      filtersEl.appendChild(btn);
    });

    filtersEl.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;
      filtersEl.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.platform;
      render();
    });
  }

  // ── Category check ─────────────────────────────
  function isInCategory(game, now) {
    const start = new Date(game.startDate);
    const end   = new Date(game.endDate);
    const mode  = window.PAGE_MODE;
    if (mode === 'active')  return now >= start && now < end;
    if (mode === 'soon')    return now < start;
    if (mode === 'expired') return now >= end;
    return false;
  }

  // ── Render ─────────────────────────────────────
  function render() {
    // Clear old intervals
    cdIntervals.forEach(clearInterval);
    cdIntervals = [];

    const now = new Date();
    grid.innerHTML = '';

    let games = allGames.filter((g) => isInCategory(g, now));

    if (activeFilter !== 'all') {
      games = games.filter((g) => g.platform.toLowerCase() === activeFilter);
    }

    if (searchQuery) {
      games = games.filter((g) =>
        g.title.toLowerCase().includes(searchQuery) ||
        g.description.toLowerCase().includes(searchQuery) ||
        g.platform.toLowerCase().includes(searchQuery)
      );
    }

    if (games.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">${gamepadSVG()}</div>
          <h3>${searchQuery ? 'NO RESULTS' : 'NOTHING HERE'}</h3>
          <p>${
            searchQuery
              ? 'No games match "' + esc(searchQuery) + '"'
              : 'No games in this section right now — check back soon!'
          }</p>
        </div>`;
      return;
    }

    games.forEach((game, i) => {
      const card = buildCard(game, now);
      card.style.animationDelay = (i * 0.05) + 's';
      card.style.animation = 'cardIn 0.38s ease both';
      grid.appendChild(card);
    });

    // Start per-second countdowns
    grid.querySelectorAll('[data-cd-end]').forEach((el) => {
      const endDate = new Date(el.dataset.cdEnd);
      tickCD(el, endDate);
      const iv = setInterval(() => tickCD(el, endDate), 1000);
      cdIntervals.push(iv);
    });
  }

  // ── Build card ─────────────────────────────────
  function buildCard(game, now) {
    const start    = new Date(game.startDate);
    const end      = new Date(game.endDate);
    const isExpired  = now >= end;
    const isUpcoming = now < start;
    const isActive   = !isExpired && !isUpcoming;
    const platLabel  = cap(game.platform);

    const card = document.createElement('div');
    card.className = 'game-card' + (isExpired ? ' is-expired' : '');

    // Countdown block (active only)
    const cdHtml = isActive ? `
      <div class="countdown-wrap" data-cd-end="${esc(game.endDate)}">
        <div class="cd-unit"><div class="cd-num" data-u="d">--</div><div class="cd-label">Days</div></div>
        <div class="cd-colon">:</div>
        <div class="cd-unit"><div class="cd-num" data-u="h">--</div><div class="cd-label">Hrs</div></div>
        <div class="cd-colon">:</div>
        <div class="cd-unit"><div class="cd-num" data-u="m">--</div><div class="cd-label">Min</div></div>
        <div class="cd-colon">:</div>
        <div class="cd-unit"><div class="cd-num" data-u="s">--</div><div class="cd-label">Sec</div></div>
      </div>` : '';

    // Date label
    let dateHtml = '';
    if (isActive) {
      dateHtml = `<div class="date-info"><span class="label-ends">Ends:</span> ${fmtIST(end)}</div>`;
    } else if (isUpcoming) {
      dateHtml = `<div class="date-info"><span class="label-starts">Starts:</span> ${fmtIST(start)}</div>`;
    } else {
      dateHtml = `<div class="date-info"><span class="label-ended">Ended:</span> ${fmtIST(end)}</div>`;
    }

    // Claim button
    const btnDisabled = isExpired || isUpcoming;
    const btnText     = isActive ? 'Claim Now →' : isUpcoming ? 'Coming Soon' : 'Expired';
    const btnHref     = btnDisabled ? '#' : esc(game.claimUrl);
    const btnTarget   = btnDisabled ? '' : 'target="_blank" rel="noopener noreferrer"';
    const btnClass    = 'claim-btn' + (btnDisabled ? ' is-disabled' : '');

    // Expired overlay
    const overlayHtml = isExpired
      ? `<div class="card-status-overlay"><span>EXPIRED</span></div>` : '';

    card.innerHTML = `
      <div class="card-img-wrap">
        <div class="badge ${esc(game.platform.toLowerCase())}">${platLabel}</div>
        <img src="${esc(game.image)}" alt="${esc(game.title)}" loading="lazy"
             onerror="this.src='https://via.placeholder.com/320x180/151515/666?text=No+Image'">
        ${overlayHtml}
        <button class="share-btn" aria-label="Share ${esc(game.title)}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
               stroke-linecap="round" stroke-linejoin="round">
            <circle cx="18" cy="5" r="3"/>
            <circle cx="6" cy="12" r="3"/>
            <circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
        </button>
      </div>
      <div class="card-body">
        <div class="card-title">${esc(game.title)}</div>
        <div class="card-desc">${esc(game.description)}</div>
        ${cdHtml}
        ${dateHtml}
        <a href="${btnHref}" class="${btnClass}" ${btnTarget}>${btnText}</a>
      </div>`;

    card.querySelector('.share-btn').addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      doShare(game);
    });

    return card;
  }

  // ── Countdown tick ─────────────────────────────
  function tickCD(el, endDate) {
    const diff = endDate - new Date();
    if (diff <= 0) {
      const parentCard = el.closest('.game-card');
      if (parentCard) {
        parentCard.classList.add('is-expired');
        const btn = parentCard.querySelector('.claim-btn');
        if (btn) {
          btn.textContent = 'Expired';
          btn.classList.add('is-disabled');
          btn.setAttribute('href', '#');
        }
        const overlay = document.createElement('div');
        overlay.className = 'card-status-overlay';
        overlay.innerHTML = '<span>EXPIRED</span>';
        const imgWrap = parentCard.querySelector('.card-img-wrap');
        if (imgWrap) imgWrap.appendChild(overlay);
      }
      el.remove();
      return;
    }
    const pad = (n) => String(n).padStart(2, '0');
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    el.querySelector('[data-u="d"]').textContent = pad(d);
    el.querySelector('[data-u="h"]').textContent = pad(h);
    el.querySelector('[data-u="m"]').textContent = pad(m);
    el.querySelector('[data-u="s"]').textContent = pad(s);
  }

  // ── Share ──────────────────────────────────────
  async function doShare(game) {
    const sd = {
      title: 'Free: ' + game.title,
      text:  '🎮 Grab "' + game.title + '" for FREE on ' + game.platform.toUpperCase() + '! Via MPM.',
      url:   game.claimUrl
    };
    try {
      if (navigator.share && navigator.canShare && navigator.canShare(sd)) {
        await navigator.share(sd);
      } else {
        await navigator.clipboard.writeText(game.claimUrl);
        showToast('🔗 Link copied to clipboard!');
      }
    } catch {
      try {
        await navigator.clipboard.writeText(game.claimUrl);
        showToast('🔗 Link copied!');
      } catch {
        showToast('Link: ' + game.claimUrl);
      }
    }
  }

  // ── Toast ──────────────────────────────────────
  function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toastEl.classList.remove('show'), 2800);
  }

  // ── Format IST date ────────────────────────────
  function fmtIST(date) {
    return date.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric', month: 'short', day: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true
    }) + ' IST';
  }

  // ── Utilities ──────────────────────────────────
  function cap(s) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
  }

  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // ── Empty State Gamepad SVG ────────────────────
  function gamepadSVG() {
    return `
      <svg width="110" height="110" viewBox="0 0 110 110" fill="none"
           xmlns="http://www.w3.org/2000/svg" style="color:currentColor;display:block;margin:0 auto 18px;">
        <rect x="9" y="33" width="92" height="48" rx="24"
              stroke="currentColor" stroke-width="2.2" fill="none"/>
        <rect x="24" y="50" width="5" height="16" rx="2.5" fill="currentColor" opacity="0.45"/>
        <rect x="18" y="56" width="17" height="5" rx="2.5" fill="currentColor" opacity="0.45"/>
        <circle cx="73" cy="52" r="3.5" fill="currentColor" opacity="0.45"/>
        <circle cx="83" cy="59" r="3.5" fill="currentColor" opacity="0.45"/>
        <circle cx="73" cy="66" r="3.5" fill="currentColor" opacity="0.45"/>
        <circle cx="63" cy="59" r="3.5" fill="currentColor" opacity="0.45"/>
        <rect x="44" y="54" width="22" height="9" rx="4.5" fill="currentColor" opacity="0.22"/>
        <path d="M9 58 Q4 75 18 82" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" opacity="0.22"/>
        <path d="M101 58 Q106 75 92 82" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" opacity="0.22"/>
      </svg>`;
  }

})();
