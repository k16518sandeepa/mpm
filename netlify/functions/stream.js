// netlify/functions/stream.js
export const handler = async (event) => {
  try {
    const FILE_ID = event.queryStringParameters.id; // Only file_id needed
    const BOT_TOKEN = process.env.BOT_TOKEN;

    if (!FILE_ID) {
      return {
        statusCode: 400,
        body: "Missing file ID"
      };
    }

    // 1. Get file info from Telegram
    const fileInfoRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${FILE_ID}`);
    const fileInfo = await fileInfoRes.json();

    if (!fileInfo.ok) {
      return {
        statusCode: 404,
        body: "File not found or bot has no access"
      };
    }

    const filePath = fileInfo.result.file_path;
    const fileURL = `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;

    // 2. Return HTML with video player
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Telegram Video Stream</title>
        <link href="https://vjs.zencdn.net/8.8.2/video.min.css" rel="stylesheet" />
        <style>
          body { margin:0; background:#000; display:flex; justify-content:center; align-items:center; height:100vh; }
          .video-js { width:90%; max-width:800px; border-radius:8px; }
        </style>
      </head>
      <body>
        <video id="my-video" class="video-js" controls autoplay muted preload="auto">
          <source src="${fileURL}" type="video/mp4">
          <source src="${fileURL}" type="video/x-matroska">
          Your browser does not support the video tag.
        </video>
        <script src="https://vjs.zencdn.net/8.8.2/video.min.js"></script>
        <script>videojs('my-video');</script>
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
