(function () {
  // ✅ SETTINGS (EDIT ONLY THESE 2 LINES)
  const AD_IMAGE = "/Images/ads.jpg"; // your uploaded image path
  const AD_LINK = "https://play.google.com/store/apps/details?id=YOUR_APP_ID";

  // ✅ Popup behavior settings
  const SHOW_DELAY = 2500; // 2.5 seconds
  const EXPIRE_HOURS = 24; // show once per day

  // ✅ Optional: show only on homepage (uncomment if needed)
  // if (location.pathname !== "/" && !location.pathname.includes("index")) return;

  function shouldShowPopup() {
    const lastShown = localStorage.getItem("mpm_popup_ad_last");
    if (!lastShown) return true;

    const diff = Date.now() - parseInt(lastShown, 10);
    const hoursPassed = diff / (1000 * 60 * 60);
    return hoursPassed >= EXPIRE_HOURS;
  }

  function addStyles() {
    if (document.getElementById("mpmPopupAdStyles")) return;

    const style = document.createElement("style");
    style.id = "mpmPopupAdStyles";
    style.innerHTML = `
      #mpmPopupAdOverlay{
        position:fixed;
        inset:0;
        display:flex;
        justify-content:center;
        align-items:center;
        background:rgba(0,0,0,0.70);
        z-index:99999;
        padding:20px;
        animation:mpmFade 0.25s ease;
      }
      .mpm-popup-box{
        position:relative;
        width:100%;
        max-width:520px;
        border-radius:18px;
        padding:14px;
        background:rgba(255,255,255,0.08);
        border:1px solid rgba(255,255,255,0.18);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        box-shadow: 0 18px 50px rgba(0,0,0,0.45);
        animation:mpmPop 0.30s ease;
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
        transition:0.2s ease;
        display:flex;
        align-items:center;
        justify-content:center;
      }
      .mpm-popup-close:hover{
        transform:scale(1.06);
        background:rgba(255,0,0,0.65);
      }
      .mpm-popup-label{
        margin-top:10px;
        text-align:center;
        font-size:13px;
        color:rgba(255,255,255,0.75);
        font-family: Arial, sans-serif;
      }
      @keyframes mpmPop{
        from{ transform:scale(0.95); opacity:0; }
        to{ transform:scale(1); opacity:1; }
      }
      @keyframes mpmFade{
        from{ opacity:0; }
        to{ opacity:1; }
      }
    `;
    document.head.appendChild(style);
  }

  function createPopup() {
    // prevent duplicate popup
    if (document.getElementById("mpmPopupAdOverlay")) return;

    const overlay = document.createElement("div");
    overlay.id = "mpmPopupAdOverlay";

    overlay.innerHTML = `
      <div class="mpm-popup-box" role="dialog" aria-label="Sponsored Ad Popup">
        <button class="mpm-popup-close" id="mpmPopupCloseBtn" aria-label="Close popup">×</button>

        <a href="${AD_LINK}" target="_blank" rel="noopener">
          <img src="${AD_IMAGE}" alt="Sponsored Ad" class="mpm-popup-img">
        </a>

        <p class="mpm-popup-label">Sponsored</p>
      </div>
    `;

    document.body.appendChild(overlay);

    function closePopup() {
      overlay.remove();
    }

    // close button
    document.getElementById("mpmPopupCloseBtn").addEventListener("click", closePopup);

    // close when clicking outside
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closePopup();
    });

    // close by ESC key
    document.addEventListener("keydown", function escClose(e) {
      if (e.key === "Escape") {
        closePopup();
        document.removeEventListener("keydown", escClose);
      }
    });
  }

  window.addEventListener("load", () => {
    if (!shouldShowPopup()) return;

    setTimeout(() => {
      addStyles();
      createPopup();
      localStorage.setItem("mpm_popup_ad_last", Date.now());
    }, SHOW_DELAY);
  });
})();
