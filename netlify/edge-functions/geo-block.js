export default async (request, context) => {
  const country = context.geo?.country?.code || "XX";

  if (country !== "LK") {
    return new Response(
      `<!doctype html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>MPM Access Restricted</title>
        <style>
          body { font-family: system-ui; text-align: center; padding: 60px; background:#0b0b0b; color:#fff; }
          h1 { color:#ff3d00; }
        </style>
      </head>
      <body>
        <h1>Access Restricted 🇱🇰</h1>
        <p>Downloads & Subtitles are available only in Sri Lanka.</p>
        <p>Please disable VPN or proxy and try again.</p>
      </body>
      </html>`,
      { status: 403, headers: { "content-type": "text/html; charset=utf-8" } }
    );
  }

  return context.next();
};
