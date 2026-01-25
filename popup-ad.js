(function () {
  // ================================
  // ✅ POPUP AD SETTINGS (EDIT HERE)
  // ================================
  const AD_IMAGE = "https://motionpicturemafia.com/assets/ads/hera-player.jpg";
  const AD_LINK  = "https://play.google.com/store/apps/details?id=YOUR_APP_ID";

  // Show popup after 2.5 seconds
  const SHOW_DELAY = 2500;

  // Show once per 24 hours
  const EXPIRE_HOURS = 24;

  // ================================
  // ✅ INTERNAL (DO NOT EDIT)
  // ================================
  const STORAGE_KEY = "mpm_popup_ad_last";

  function hoursSince(ts) {
    return (Date.now() - ts) / (1000 * 60 * 60);
  }

  function shouldShowPopup() {
    try {
      const lastShown = localStorage.getItem(STORAGE_KEY);
      if (!lastShown) return true;
      const last = parseInt(lastShown, 10);
      if (Number.isNaN(last)) return true;
      return hoursSince(last) >= EXPIRE_HOURS;
    } catch (e) {
      // If localStorage blocked, still show (safer fallback)
      return true;
    }
  }

  function addStyles() {
    if (document.getElementById("mpmPopupAdStyles")) return;

    const style = document.createElement("style");
    style.id = "mpmPopupAdStyles";
    style.textContent = `
      #mpmPopupAdOverlay{
        position:fixed;
        inset:0;
        display:flex;
        justify-content:center;
        align-items:center;
        background:rgba(0,0,0,0.72);
        z-index:999999;
        padding:18px;
        animation:mpmOverlayFade .25s ease;
      }
      .mpm-popup-box{
        position:relative;
        width:min(540px, 100%);
        border-radius:18px;
        padding:14px;
        background:rgba(255,255,255,0.08);
        border:1px solid rgba(255,255,255,0.18);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        box-shadow: 0 18px 55px rgba(0,0,0,0.45);
        animation:mpmPopupPop .28s ease;
      }
      .mpm-popup-img{
        width:100%;
        height:auto;
        border-radius:14px;
        display:block;
        object-fit:cover;
      }
      .mpm-popup-close{
        position:absolute;
        top:10px;
        right:10px;
        width:38px;
        height:38px;
        border:none;
        border-radius:50%;
        font-size:22px;
        cursor:pointer;
        color:#fff;
        background:rgba(0,0,0,0.55);
        display:flex;
        align-items:center;
        justify-content:center;
        transition:.2s ease;
      }
      .mpm-popup-close:hover{
        transform:scale(1.06);
        background:rgba(255,0,0,0.65);
      }
      .mpm-popup-label{
        margin:10px 0 2px;
        text-align:center;
        font-size:13px;
        color:rgba(255,255,255,0.78);
        font-family: Arial, sans-serif;
      }
      @keyframes mpmPopupPop{
        from{ transform:scale(.96); opacity:0; }
        to{ transform:scale(1); opacity:1; }
      }
      @keyframes mpmOverlayFade{
        from{ opacity:0; }
        to{ opacity:1; }
      }
    `;
    document.head.appendChild(style);
  }

  function createPopup() {
    if (document.getElementById("mpmPopupAdOverlay")) return;

    const overlay = document.createElement("div");
    overlay.id = "mpmPopupAdOverlay";

    overlay.innerHTML = `
      <div class="mpm-popup-box" role="dialog" aria-label="Sponsored popup">
        <button class="mpm-popup-close" id="mpmPopupCloseBtn" aria-label="Close popup">×</button>

        <a href="${AD_LINK}" target="_blank" rel="noopener noreferrer">
          <img class="mpm-popup-img" src="${AD_IMAGE}" alt="Sponsored ad">
        </a>

        <div class="mpm-popup-label">Sponsored</div>
      </div>
    `;

    document.body.appendChild(overlay);

    function closePopup() {
      overlay.remove();
    }

    // Close button
    overlay.querySelector("#mpmPopupCloseBtn").addEventListener("click", closePopup);

    // Click outside
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closePopup();
    });

    // Esc key
    document.addEventListener("keydown", function escClose(e) {
      if (e.key === "Escape") {
        closePopup();
        document.removeEventListener("keydown", escClose);
      }
    });
  }

  function markShown() {
    try {
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch (e) {}
  }

  function run() {
    if (!shouldShowPopup()) return;

    setTimeout(() => {
      addStyles();
      createPopup();
      markShown();
    }, SHOW_DELAY);
  }

  // Run as soon as DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();