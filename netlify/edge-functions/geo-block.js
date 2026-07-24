export default async (request, context) => {
  const country = context.geo?.country?.code || "XX";

  // Only allow visitors from Sri Lanka (LK)
  const allowedCountries = ["LK"];

  if (!allowedCountries.includes(country)) {
    return new Response(
      `<!doctype html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>MPM Access Restricted</title>
        <style>
          body { 
            font-family: system-ui, -apple-system, sans-serif; 
            text-align: center; 
            padding: 60px 20px; 
            background: #0b0b0b; 
            color: #fff; 
          }
          h1 { color: #ff3d00; }
          p { color: #ccc; line-height: 1.5; }
        </style>
      </head>
      <body>
        <h1>Access Restricted 🇱🇰</h1>
        <p>Access Denied: This page is not available in your region.</p>
        <p>Please disable VPN or proxy and try again.</p>
      </body>
      </html>`,
      { 
        status: 403, 
        headers: { "content-type": "text/html; charset=utf-8" } 
      }
    );
  }

  return context.next();
};