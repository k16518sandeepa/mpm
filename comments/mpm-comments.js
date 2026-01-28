/* ==============================
   ✅ MPM Comments Widget (Frontend)
   Works with a simple PHP API (see backend zip)
================================= */

(() => {
  // IMPORTANT: set your backend URL here (must support CORS if on a different domain)
  const API_BASE = "https://comments.free.nf/api"; // e.g. https://mpm-comments.yourdomain.com/api

  const commentsRoot = document.getElementById("mpmComments");
  const listEl = document.getElementById("mpmCommentsList");
  const form = document.getElementById("mpmCommentForm");
  const nameEl = document.getElementById("mpmName");
  const commentEl = document.getElementById("mpmComment");
  const parentEl = document.getElementById("mpmParentId");
  const statusEl = document.getElementById("mpmFormStatus");
  const cancelReplyBtn = document.getElementById("mpmCancelReplyBtn");

  const articleLikeBtn = document.getElementById("mpmArticleLikeBtn");
  const articleLikeCountEl = document.getElementById("mpmArticleLikeCount");

  if (!commentsRoot || !listEl || !form || !articleLikeBtn) return;

  // Article id: use data-article-id if provided, otherwise path
  const articleId = (commentsRoot.dataset.articleId || "").trim() || window.location.pathname;

  // Generate a stable visitor id (no login) for likes (localStorage)
  const VISITOR_KEY = "mpm_visitor_id_v1";
  let visitorId = localStorage.getItem(VISITOR_KEY);
  if (!visitorId) {
    visitorId = (crypto?.randomUUID?.() || ("v-" + Math.random().toString(16).slice(2) + Date.now()));
    localStorage.setItem(VISITOR_KEY, visitorId);
  }

  const likeKey = (suffix) => `mpm_like_${suffix}_${articleId}`;
  const hasLikedArticle = () => localStorage.getItem(likeKey("article")) === "1";
  const setLikedArticle = (v) => localStorage.setItem(likeKey("article"), v ? "1" : "0");

  function setStatus(msg, ok = true) {
    statusEl.textContent = msg || "";
    statusEl.style.color = ok ? "" : "#ff6b81";
  }

  async function apiGet(url) {
    const res = await fetch(url, { method: "GET", credentials: "omit" });
    return res.json();
  }

  async function apiPost(url, data) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "omit"
    });
    return res.json();
  }

  function escapeHtml(str) {
    return (str || "").replace(/[&<>"']/g, (m) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    }[m]));
  }

  function formatTime(iso) {
    try {
      const d = new Date(iso);
      return d.toLocaleString(undefined, { year:"numeric", month:"short", day:"2-digit", hour:"2-digit", minute:"2-digit" });
    } catch {
      return "";
    }
  }

  function buildTree(comments) {
    const byId = new Map();
    comments.forEach(c => { c.children = []; byId.set(String(c.id), c); });

    const roots = [];
    comments.forEach(c => {
      if (c.parent_id) {
        const p = byId.get(String(c.parent_id));
        if (p) p.children.push(c);
        else roots.push(c);
      } else {
        roots.push(c);
      }
    });
    return roots;
  }

  function renderComment(c) {
    const wrapper = document.createElement("div");
    wrapper.className = "mpm-comment";
    wrapper.dataset.id = c.id;

    const likedKey = likeKey("c_" + c.id);
    const liked = localStorage.getItem(likedKey) === "1";

    wrapper.innerHTML = `
      <div class="mpm-comment-head">
        <div class="mpm-comment-name">${escapeHtml(c.name)}</div>
        <div class="mpm-comment-time">${escapeHtml(formatTime(c.created_at))}</div>
      </div>
      <div class="mpm-comment-body">${escapeHtml(c.comment)}</div>
      <div class="mpm-comment-actions">
        <button class="mpm-link-btn" type="button" data-action="reply">Reply</button>
        <button class="mpm-like-mini" type="button" data-action="like" aria-label="Like comment">
          ${liked ? "❤️" : "🤍"} <span data-like-count>${c.like_count || 0}</span>
        </button>
      </div>
    `;

    // actions
    wrapper.querySelector('[data-action="reply"]').addEventListener("click", () => {
      parentEl.value = c.id;
      cancelReplyBtn.style.display = "inline-flex";
      setStatus(`Replying to ${c.name}…`);
      commentEl.focus({ preventScroll: false });
    });

    wrapper.querySelector('[data-action="like"]').addEventListener("click", async (e) => {
      const btn = e.currentTarget;
      btn.disabled = true;

      const currentlyLiked = localStorage.getItem(likedKey) === "1";
      const action = currentlyLiked ? "unlike_comment" : "like_comment";

      try {
        const out = await apiPost(`${API_BASE}/comments.php`, {
          action,
          article_id: articleId,
          comment_id: c.id,
          visitor_id: visitorId
        });

        if (out?.ok) {
          localStorage.setItem(likedKey, currentlyLiked ? "0" : "1");
          btn.innerHTML = `${currentlyLiked ? "🤍" : "❤️"} <span data-like-count>${out.like_count ?? (c.like_count || 0)}</span>`;
        }
      } catch {}
      btn.disabled = false;
    });

    // replies
    if (c.children?.length) {
      const replies = document.createElement("div");
      replies.className = "mpm-replies";
      c.children.forEach(ch => replies.appendChild(renderComment(ch)));
      wrapper.appendChild(replies);
    }

    return wrapper;
  }

  async function loadComments() {
    listEl.innerHTML = "";
    try {
      const out = await apiGet(`${API_BASE}/comments.php?action=list&article_id=${encodeURIComponent(articleId)}`);
      if (!out?.ok) throw new Error("bad response");

      const tree = buildTree(out.comments || []);
      if (!tree.length) {
        listEl.innerHTML = `<div class="mpm-comment" style="opacity:.8;">No comments yet. Be the first!</div>`;
        return;
      }
      tree.forEach(c => listEl.appendChild(renderComment(c)));
    } catch {
      listEl.innerHTML = `<div class="mpm-comment" style="opacity:.85;">Comments failed to load. (Check API_BASE / CORS)</div>`;
    }
  }

  async function loadArticleLikes() {
    try {
      const out = await apiGet(`${API_BASE}/comments.php?action=article_likes&article_id=${encodeURIComponent(articleId)}`);
      if (out?.ok) {
        articleLikeCountEl.textContent = out.like_count ?? 0;
        if (hasLikedArticle()) articleLikeBtn.classList.add("liked");
      }
    } catch {}
  }

  // article like click
  articleLikeBtn.addEventListener("click", async () => {
    articleLikeBtn.disabled = true;
    const currentlyLiked = hasLikedArticle();
    const action = currentlyLiked ? "unlike_article" : "like_article";

    try {
      const out = await apiPost(`${API_BASE}/comments.php`, {
        action,
        article_id: articleId,
        visitor_id: visitorId
      });

      if (out?.ok) {
        setLikedArticle(!currentlyLiked);
        articleLikeCountEl.textContent = out.like_count ?? articleLikeCountEl.textContent;
        articleLikeBtn.classList.toggle("liked", !currentlyLiked);
      }
    } catch {}
    articleLikeBtn.disabled = false;
  });

  // form submit
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = (nameEl.value || "").trim();
    const comment = (commentEl.value || "").trim();
    const parent_id = (parentEl.value || "").trim() || null;

    if (!name || !comment) return;

    setStatus("Sending…");
    document.getElementById("mpmSubmitBtn").disabled = true;

    try {
      const out = await apiPost(`${API_BASE}/comments.php`, {
        action: "add",
        article_id: articleId,
        name,
        comment,
        parent_id
      });

      if (out?.ok) {
        setStatus("✅ Sent! It will appear after approval.", true);
        commentEl.value = "";
        parentEl.value = "";
        cancelReplyBtn.style.display = "none";
      } else {
        setStatus(out?.error || "❌ Failed to send.", false);
      }
    } catch {
      setStatus("❌ Failed to send. (Check API_BASE / CORS)", false);
    }

    document.getElementById("mpmSubmitBtn").disabled = false;
  });

  cancelReplyBtn.addEventListener("click", () => {
    parentEl.value = "";
    cancelReplyBtn.style.display = "none";
    setStatus("");
  });

  // init
  loadArticleLikes();
  loadComments();
})();
