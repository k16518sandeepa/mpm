(function () {
  'use strict';

  /* ============== CONFIG============== */
  var CONFIG = {
    hoursBetweenPopups: 24,              // hours before popup can show again
    delayBeforeShowMs: 1500,             // wait a moment after page load before showing
    storageKey: 'mpm_donate_popup_last_shown',

    image: 'Images/donation.png',         // path or URL to an image (optional — leave '' to hide)
    heading: "Help Keep MPMFLIX Alive",
    message: "We don't run ads. MPMFLIX is funded entirely by people like you. " +
              "If you enjoy the site, a small donation helps cover server and " +
              "hosting costs so we can keep it running smoothly for everyone.",
    donateText: "Donate",
    donateUrl: "https://motionpicturemafia.com/support-us",                      // <-- put your donation link here
    dismissText: "Maybe Later"
  };
  /* =================================================== */

  function shouldShow() {
    try {
      var last = localStorage.getItem(CONFIG.storageKey);
      if (!last) return true;
      var elapsedHrs = (Date.now() - parseInt(last, 10)) / 36e5;
      return elapsedHrs >= CONFIG.hoursBetweenPopups;
    } catch (e) {
      return true; // if storage blocked, just show it
    }
  }

  function markShown() {
    try { localStorage.setItem(CONFIG.storageKey, Date.now().toString()); }
    catch (e) {}
  }

  function buildPopup() {
    var style = document.createElement('style');
    style.textContent = ''
      + '#mpm-donate-overlay{position:fixed;inset:0;z-index:99999;display:flex;'
      + 'align-items:center;justify-content:center;padding:20px;'
      + 'background:rgba(0,0,0,.72);backdrop-filter:blur(3px);'
      + 'opacity:0;transition:opacity .25s ease;font-family:"DM Sans",sans-serif;}'
      + '#mpm-donate-overlay.mpm-show{opacity:1;}'
      + '#mpm-donate-card{background:#141414;border:1px solid #2a2a2a;border-radius:8px;'
      + 'max-width:400px;width:100%;overflow:hidden;position:relative;'
      + 'box-shadow:0 20px 60px rgba(0,0,0,.6);'
      + 'transform:translateY(16px) scale(.97);transition:transform .25s ease;}'
      + '#mpm-donate-overlay.mpm-show #mpm-donate-card{transform:translateY(0) scale(1);}'
      + '#mpm-donate-close{position:absolute;top:10px;right:10px;width:30px;height:30px;'
      + 'border-radius:50%;border:none;background:rgba(0,0,0,.5);color:#f2f0ea;'
      + 'font-size:18px;line-height:1;cursor:pointer;display:flex;align-items:center;'
      + 'justify-content:center;z-index:2;transition:background .15s;}'
      + '#mpm-donate-close:hover{background:#e50000;}'
      + '#mpm-donate-img{width:100%;height:160px;object-fit:cover;display:block;'
      + 'background:#1b1b1b;}'
      + '#mpm-donate-body{padding:22px 24px 24px;}'
      + '#mpm-donate-body h3{font-family:"Bebas Neue",sans-serif;font-size:26px;'
      + 'letter-spacing:.5px;color:#f2f0ea;margin-bottom:10px;}'
      + '#mpm-donate-body p{font-size:14px;line-height:1.55;color:#a8a29a;margin-bottom:20px;}'
      + '#mpm-donate-actions{display:flex;gap:10px;flex-wrap:wrap;}'
      + '#mpm-donate-actions a, #mpm-donate-actions button{flex:1;min-width:120px;'
      + 'padding:11px 16px;border-radius:4px;font-size:14px;font-weight:700;'
      + 'text-align:center;cursor:pointer;border:1px solid transparent;'
      + 'transition:opacity .15s, background .15s;}'
      + '#mpm-donate-give{background:#e50000;color:#fff;}'
      + '#mpm-donate-give:hover{opacity:.88;}'
      + '#mpm-donate-skip{background:transparent;color:#a8a29a;border-color:#2a2a2a;}'
      + '#mpm-donate-skip:hover{color:#f2f0ea;border-color:#a8a29a;}'
      + '@media(max-width:420px){#mpm-donate-img{height:130px;}}';
    document.head.appendChild(style);

    var overlay = document.createElement('div');
    overlay.id = 'mpm-donate-overlay';

    var imgHtml = CONFIG.image
      ? '<img id="mpm-donate-img" src="' + CONFIG.image + '" alt="">'
      : '';

    overlay.innerHTML =
      '<div id="mpm-donate-card" role="dialog" aria-modal="true" aria-labelledby="mpm-donate-heading">'
        + '<button id="mpm-donate-close" aria-label="Close">&times;</button>'
        + imgHtml
        + '<div id="mpm-donate-body">'
          + '<h3 id="mpm-donate-heading">' + CONFIG.heading + '</h3>'
          + '<p>' + CONFIG.message + '</p>'
          + '<div id="mpm-donate-actions">'
            + '<a id="mpm-donate-give" href="' + CONFIG.donateUrl + '" target="_blank" rel="noopener">' + CONFIG.donateText + '</a>'
            + '<button id="mpm-donate-skip" type="button">' + CONFIG.dismissText + '</button>'
          + '</div>'
        + '</div>'
      + '</div>';

    document.body.appendChild(overlay);

    function close() {
      overlay.classList.remove('mpm-show');
      markShown();
      setTimeout(function () { overlay.remove(); }, 250);
    }

    overlay.querySelector('#mpm-donate-close').addEventListener('click', close);
    overlay.querySelector('#mpm-donate-skip').addEventListener('click', close);
    overlay.querySelector('#mpm-donate-give').addEventListener('click', close);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close();
    });
    document.addEventListener('keydown', function esc(e) {
      if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); }
    });

    requestAnimationFrame(function () {
      overlay.classList.add('mpm-show');
    });
  }

  function init() {
    if (!shouldShow()) return;
    setTimeout(buildPopup, CONFIG.delayBeforeShowMs);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();