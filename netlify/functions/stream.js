// netlify/functions/stream.js
export const handler = async (event) => {
  try {
    const MESSAGE_ID = event.queryStringParameters.id; // message_id from bot PM
    const BOT_TOKEN = process.env.BOT_TOKEN;

    if (!MESSAGE_ID) {
      return {
        statusCode: 400,
        body: "Missing message ID"
      };
    }

    // 1. Get the message info using getUpdates is tricky, better use getChat for PM
    // If you already have the chat_id (your bot PM chat), set it here:
    const CHAT_ID = process.env.BOT_PM_CHAT_ID; // your bot's PM chat ID

    // Use getChatMessage via Telegram API (getMessage is not public, we assume you store forwarded messages)
    // Instead, we can pass file_id directly if you have it from getUpdates
    // For simplicity, let's accept file_id as a query param too if needed:
    const FILE_ID = event.queryStringParameters.file_id;
    if (!FILE_ID) {
      return {
        statusCode: 400,
        body: "Missing file ID. You can pass ?file_id=<file_id>"
      };
    }

    // 2. Get file info from Telegram
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

    // 3. Return HTML with video/audio player
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Telegram File Stream</title>
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
