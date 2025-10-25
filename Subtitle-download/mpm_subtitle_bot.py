from telegram import Update
from telegram.ext import Application, CommandHandler, ContextTypes

BOT_TOKEN = "8445154646:AAEQwboeVjAH0Lpd7NXPIhlCMQA0ePaw658"

# Map subtitle codes to your uploaded file_ids (single or ZIP)
SUB_FILES = {
    "Battle_game_in_5_seconds": "BQACAgUAAxkBAAMXaPxtGaSP4QtdSNqWotWhyTPeRX0AAgoYAAJ6r-lXEf-9qIz-How2BA",
}

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    message = update.message
    text = message.text

    # Check if /start has a parameter
    if text.startswith("/start "):
        code = text.split(" ")[1]  # Get the subtitle code
        if code in SUB_FILES:
            await context.bot.send_document(
                chat_id=update.effective_chat.id,
                document=SUB_FILES[code],
                caption=f"🎬 Subtitle: {code} — Motion Picture Mafia"
            )
        else:
            await message.reply_text("❌ Subtitle not found.")
    else:
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