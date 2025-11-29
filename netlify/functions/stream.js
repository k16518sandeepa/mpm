// netlify/functions/stream.js
export const handler = async (event) => {
  try {
    const TELEGRAM_FILE_ID = event.queryStringParameters.id;
    const BOT_TOKEN = process.env.BOT_TOKEN;

    if (!TELEGRAM_FILE_ID) {
      return {
        statusCode: 400,
        body: "Missing file ID"
      };
    }

    // 1. Get file info from Telegram
    const fileInfoURL = `https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${TELEGRAM_FILE_ID}`;
    const res = await fetch(fileInfoURL);
    const fileInfo = await res.json();

    if (!fileInfo.ok) {
      return {
        statusCode: 404,
        body: "File not found or bot has no access"
      };
    }

    const filePath = fileInfo.result.file_path;

    // 2. Telegram CDN link
    const fileURL = `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;

    // 3. Return HTML page with responsive Video.js player
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>MPM Streaming</title>
        <link href="https://vjs.zencdn.net/8.8.2/video.min.css" rel="stylesheet" />
        <style>
          body { margin:0; background:#000; display:flex; justify-content:center; align-items:center; height:100vh; }
          .video-js { width:100%; height:auto; max-height:100vh; border-radius:8px; }
        </style>
      </head>
      <body>
        <video id="my-video" class="video-js" controls autoplay muted preload="metadata">
          <source src="${fileURL}" type="video/mp4">
          <source src="${fileURL}" type="video/x-matroska">
          Your browser does not support the video tag.
        </video>
        <script src="https://vjs.zencdn.net/8.8.2/video.min.js"></script>
        <script>
          const player = videojs('my-video');
          player.ready(() => {
            console.log('Video.js player ready');
          });
        </script>
      </body>
      </html>
    `;

    return {
      statusCode: 200,
      headers: { "Content-Type": "text/html" },
      body: html
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: "Server error: " + err.message
    };
  }
};
