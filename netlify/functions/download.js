const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  try {
    if (event.httpMethod === "OPTIONS") return { statusCode: 204 };

    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ok: false, error: "method_not_allowed" }),
      };
    }

    const store = getStore("download-counts");

    // Parse x-www-form-urlencoded: item_id=boruto
    const body = event.body || "";
    const m = body.match(/(?:^|&)item_id=([^&]+)/);
    const itemId = m ? decodeURIComponent(m[1]) : "";

    if (!/^[a-zA-Z0-9\-_]{1,120}$/.test(itemId)) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ok: false, error: "bad_id" }),
      };
    }

    const current = await store.get(itemId);
    const next = (current ? parseInt(current, 10) : 0) + 1;

    await store.set(itemId, String(next));

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: true, count: next }),
    };
  } catch {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: false, error: "server_error" }),
    };
  }
};
