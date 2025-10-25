import asyncio
from telegram import Update
from telegram.ext import Application, CommandHandler, ContextTypes

# Your bot token
import os
BOT_TOKEN = os.environ.get("BOT_TOKEN")  # safer than hardcoding

# Map subtitle codes to Telegram file_ids (single files or ZIPs)
SUB_FILES = {
    "Battle_game_in_5_seconds_Ep1": "BQACAgUAAxkBAAMDaPxa7J3gTcHBR42yGGSzcNrf50QAAu8XAAJ6r-lXF7b8-4VJ_0k2BA",
    "Battle_game_in_5_seconds_Ep2": "BQACAgUAAxkBAAMMaPxnM8VNfKV5N3MdMW5EmgvUelQAAxgAAnqv6Vei2E_9wMTKzjYE",
    "onepiece_01": "BQACAgQAAxkBAAICgWYt8uMh6kgF5YGVYQ7fDEwZKoxgAAKCAgACr6LJUzKkO-9x5EsDMwQ",
    "Onepiece_pack": "BQACAgUAAxkBAAO4aPxqQabc123xyzZIPFileID"  # example ZIP
}

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    message = update.message
    text = message.text

    # Check if /start has a parameter (from website link)
    if text.startswith("/start ") and len(text.split()) > 1:
        code = text.split()[1]
        if code in SUB_FILES:
            await context.bot.send_document(
                chat_id=update.effective_chat.id,
                document=SUB_FILES[code],
                caption=f"🎬 Subtitle: {code} — Motion Picture Mafia"
            )
        else:
            await message.reply_text("❌ Subtitle not found.")
    else:
        # Normal /start without parameters
        await message.reply_text(
            "👋 Welcome to MPM Subtitle Bot!\n"
            "Click the download button on our website to get subtitles."
        )

def main():
    app = Application.builder().token(BOT_TOKEN).build()
    app.add_handler(CommandHandler("start", start))

    print("🤖 MPM Subtitle Bot is running...")
    app.run_polling()

if __name__ == "__main__":
    main()
