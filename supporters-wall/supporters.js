/* Shared renderer for the MPM Supporters Wall (public + preview) */
(function (global) {
  const DEFAULT_TIERS = [
    { id: "platinum", label: "Platinum", min: 10000, color: "#e5eefb" },
    { id: "gold", label: "Gold", min: 5000, color: "#d9b45a" },
    { id: "silver", label: "Silver", min: 2000, color: "#c3c9d4" },
    { id: "supporter", label: "Supporters", min: 0, color: "#a08c6a" }
  ];
  const PAST_COLOR = "#6f6d7a";

  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmt = (n, cur) => (cur || "LKR") + " " + Number(n || 0).toLocaleString("en-US");
  const displayName = (s) => (s.anonymous ? "Anonymous Supporter" : s.name || "Supporter");
  const initials = (s) => (s.anonymous ? "?" : (s.name || "?").trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase());

  /* ---- dates (local, date-only so 'today' follows the visitor's calendar day) ---- */
  const pad = (n) => String(n).padStart(2, "0");
  const ymd = (d) => d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  const today = () => ymd(new Date());
  function addDays(dateStr, n) {
    const d = new Date((dateStr || today()) + "T12:00:00");
    d.setDate(d.getDate() + Number(n || 0));
    return ymd(d);
  }
  function daysBetween(a, b) { // b - a in days
    return Math.round((new Date(b + "T12:00:00") - new Date(a + "T12:00:00")) / 86400000);
  }
  /* expiry: null = never expires (lifetime). Missing 'expires' falls back to date + durationDays */
  function expiryOf(s, days) {
    if (s.noExpiry) return null;
    return s.expires || addDays(s.date || today(), days || 30);
  }
  function isActive(s, days) {
    const e = expiryOf(s, days);
    return e === null || e >= today();
  }
  function tierFor(amount, tiers) {
    const sorted = [...tiers].sort((a, b) => b.min - a.min);
    return sorted.find((t) => amount >= t.min) || sorted[sorted.length - 1];
  }
  function fmtMonth(d) {
    if (!d) return "";
    const dt = new Date(d + "T12:00:00");
    return isNaN(dt) ? "" : dt.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
  }
  function fmtDay(d) {
    if (!d) return "";
    const dt = new Date(d + "T12:00:00");
    return isNaN(dt) ? "" : dt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  }

  function normalize(data) {
    data = data || {};
    return {
      title: data.title || "Our Supporters",
      subtitle: data.subtitle || "Thank you for keeping MPM alive.",
      currency: data.currency || "LKR",
      donateUrl: data.donateUrl || "",
      showTotal: data.showTotal !== false,
      durationDays: Number(data.durationDays) > 0 ? Number(data.durationDays) : 30,
      tiers: Array.isArray(data.tiers) && data.tiers.length ? data.tiers : DEFAULT_TIERS,
      supporters: Array.isArray(data.supporters) ? data.supporters : [],
      updated: data.updated || ""
    };
  }

  function render(root, rawData) {
    const data = normalize(rawData);
    const state = { q: "", tier: "all" };
    const visible = data.supporters.filter((s) => !s.hidden);
    const active = visible.filter((s) => isActive(s, data.durationDays));
    const past = visible.filter((s) => !isActive(s, data.durationDays));
    const total = visible.reduce((a, s) => a + (Number(s.amount) || 0), 0);

    root.innerHTML = `
      <header class="hero wrap">
        <div class="eyebrow">Motion Picture Mafia</div>
        <h1>${esc(data.title)}</h1>
        <p>${esc(data.subtitle)}</p>
        <div class="orn-line">◆</div>
        <div class="stats">
          <div class="stat"><b>${active.length}</b><span>Active supporters</span></div>
          ${data.showTotal ? `<div class="stat"><b>${esc(fmt(total, data.currency))}</b><span>Raised all-time</span></div>` : ""}
        </div>
        ${data.donateUrl ? `<a class="cta" href="${esc(data.donateUrl)}">Become a supporter</a>` : ""}
      </header>
      <main class="wrap">
        <div class="toolbar">
          <input type="search" id="sw-q" placeholder="Search supporters…" aria-label="Search supporters">
          <span id="sw-chips"></span>
        </div>
        <div id="sw-body"></div>
      </main>
      <footer>${data.updated ? "Updated " + esc(data.updated) + " · " : ""}With gratitude — Motion Picture Mafia</footer>`;

    const chips = root.querySelector("#sw-chips");
    const body = root.querySelector("#sw-body");

    function drawChips() {
      const opts = [{ id: "all", label: "All" }, ...data.tiers.map((t) => ({ id: t.id, label: t.label }))];
      if (past.length) opts.push({ id: "past", label: "Past" });
      chips.innerHTML = opts.map((o) => `<button class="chip ${state.tier === o.id ? "on" : ""}" data-t="${esc(o.id)}">${esc(o.label)}</button>`).join(" ");
      chips.querySelectorAll(".chip").forEach((b) => (b.onclick = () => { state.tier = b.dataset.t; drawChips(); drawBody(); }));
    }

    const matches = (s, q) => !q || (displayName(s) + " " + (s.message || "")).toLowerCase().includes(q);

    function activeCard(s, t, i) {
      const exp = expiryOf(s, data.durationDays);
      return `
        <article class="card t-${esc(t.id)} ${s.featured ? "featured" : ""}" style="--tc:${esc(t.color)};--i:${Math.min(i, 24)}">
          ${s.featured ? '<span class="badge">Featured</span>' : ""}
          <div class="top"><div class="avatar">${esc(initials(s))}</div>
            <div><div class="name">${esc(displayName(s))}</div>
            <div class="meta">${exp ? "Active until " + esc(fmtDay(exp)) : "Lifetime supporter"}</div></div></div>
          ${s.showAmount ? `<div class="amt">${esc(fmt(s.amount, data.currency))}</div>` : ""}
          ${s.message ? `<p class="msg">“${esc(s.message)}”</p>` : ""}
        </article>`;
    }

    function pastCard(s, i) {
      const exp = expiryOf(s, data.durationDays);
      return `
        <article class="card past" style="--tc:${PAST_COLOR};--i:${Math.min(i, 24)}">
          <div class="top"><div class="avatar">${esc(initials(s))}</div>
            <div><div class="name">${esc(displayName(s))}</div>
            <div class="meta">Supported until ${esc(fmtMonth(exp))}</div></div></div>
        </article>`;
    }

    function drawBody() {
      const q = state.q.toLowerCase();
      let n = 0, html = "";

      if (state.tier !== "past") {
        const groups = new Map(data.tiers.map((t) => [t.id, []]));
        active.forEach((s) => {
          if (!matches(s, q)) return;
          const t = tierFor(Number(s.amount) || 0, data.tiers);
          if (state.tier !== "all" && state.tier !== t.id) return;
          groups.get(t.id).push(s);
        });
        html += [...data.tiers].sort((a, b) => b.min - a.min).map((t) => {
          const arr = groups.get(t.id);
          if (!arr || !arr.length) return "";
          arr.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || (Number(b.amount) || 0) - (Number(a.amount) || 0));
          return `<section class="tier" style="--tc:${esc(t.color)}">
            <h2><span class="orn">◆</span>${esc(t.label)}<span class="orn">◆</span><small>${arr.length}</small></h2>
            <div class="grid">${arr.map((s) => activeCard(s, t, n++)).join("")}</div></section>`;
        }).join("");
      }

      if (state.tier === "all" || state.tier === "past") {
        const arr = past.filter((s) => matches(s, q))
          .sort((a, b) => (expiryOf(b, data.durationDays) || "").localeCompare(expiryOf(a, data.durationDays) || ""));
        if (arr.length) {
          html += `<section class="tier past-sec" style="--tc:${PAST_COLOR}">
            <h2><span class="orn">◆</span>Past Supporters<span class="orn">◆</span><small>${arr.length}</small></h2>
            <p class="past-note">Their support helped build this. Renew to return to the wall.</p>
            <div class="grid past-grid">${arr.map((s) => pastCard(s, n++)).join("")}</div></section>`;
        }
      }
      body.innerHTML = html || '<div class="empty">No supporters found.</div>';
    }

    root.querySelector("#sw-q").oninput = (e) => { state.q = e.target.value; drawBody(); };
    drawChips();
    drawBody();
  }

  global.SupportersWall = { render, normalize, tierFor, DEFAULT_TIERS, fmt, displayName, today, addDays, daysBetween, expiryOf, isActive };
})(window);
