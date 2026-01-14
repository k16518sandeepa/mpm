const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  try {
    const store = getStore("download-counts");

    const idsParam = event.queryStringParameters?.ids || "";
    const ids = idsParam
      .split(",")
      .map((s) => s.trim())
      .filter((s) => /^[a-zA-Z0-9\-_]{1,120}$/.test(s))
      .slice(0, 500);

    const counts = {};
    for (const id of ids) {
      const val = await store.get(id);
      counts[id] = val ? parseInt(val, 10) : 0;
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: true, counts }),
    };
  } catch {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: false, error: "server_error" }),
    };
  }
};
