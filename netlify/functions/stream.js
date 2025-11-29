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

    // 1. Get file path from Telegram API
    const fileInfoURL = `https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${TELEGRAM_FILE_ID}`;
    const fileInfoResponse = await fetch(fileInfoURL);
    const fileInfo = await fileInfoResponse.json();

    if (!fileInfo.ok) {
      return {
        statusCode: 404,
        body: "File not found"
      };
    }

    const filePath = fileInfo.result.file_path;

    // 2. Telegram CDN direct link
    const fileURL = `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;

    // 3. Redirect browser to CDN URL
    return {
      statusCode: 302,
      headers: {
        Location: fileURL
      },
      body: ""
    };

  } catch (e) {
    return {
      statusCode: 500,
      body: "Server error: " + e.message
    };
  }
};
