// netlify/functions/stream.js
export const handler = async (event) => {
  try {
    const TELEGRAM_FILE_ID = event.queryStringParameters.id;
    const BOT_TOKEN = process.env.BOT_TOKEN;
    const FORWARD_TO_CHAT_ID = process.env.FORWARD_TO_CHAT_ID; // Target chat/channel ID

    if (!TELEGRAM_FILE_ID) {
      return {
        statusCode: 400,
        body: "Missing file ID"
      };
    }

    // 1. Forward the file to another chat
    const forwardRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/forwardMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: FORWARD_TO_CHAT_ID,
        from_chat_id: event.queryStringParameters.from, // Original chat ID (needed for forwarding)
        message_id: TELEGRAM_FILE_ID // Telegram message_id
      })
    });
    const forwardData = await forwardRes.json();

    if (!forwardData.ok) {
      return {
        statusCode: 500,
        body: "Failed to forward file: " + JSON.stringify(forwardData)
      };
    }

    // 2. Get the new file_id from forwarded message
    const newFileId = forwardData.result.message_id; // Actually, you'll likely need the file_id of the attachment inside forwarded message
    const fileMessage = forwardData.result;
    const fileObject = fileMessage.document || fileMessage.video || fileMessage.audio;
    if (!fileObject) {
      return {
        statusCode: 500,
        body: "No file found in forwarded message"
      };
    }
    const newFileIdActual = fileObject.file_id;

    // 3. Get file info
    const fileInfoURL = `https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${newFileIdActual}`;
    const res = await fetch(fileInfoURL);
    const fileInfo = await res.json();

    if (!fileInfo.ok) {
      return {
        statusCode: 404,
        body: "File not found or bot has no access"
      };
    }

    const filePath = fileInfo.result.file_path;
    const fileURL = `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;

    // 4. Return HTML stream
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
