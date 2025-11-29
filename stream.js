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

    // 1. Get filePath from Telegram API
    const fileInfoURL = `https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${TELEGRAM_FILE_ID}`;
    const fileInfo = await fetch(fileInfoURL).then(r => r.json());

    if (!fileInfo.ok) {
      return {
        statusCode: 404,
        body: "File not found"
      };
    }

    const filePath = fileInfo.result.file_path;

    // 2. Telegram CDN direct link
    const fileURL = `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;

    // 3. Fetch video file and stream to browser
    const fileResponse = await fetch(fileURL);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "video/mp4",
        "Cache-Control": "public, max-age=31536000",
      },
      body: Buffer.from(await fileResponse.arrayBuffer()).toString("base64"),
      isBase64Encoded: true
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: "Server error: " + e.message
    };
  }
};
