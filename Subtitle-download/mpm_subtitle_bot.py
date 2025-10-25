from telegram import Update
from telegram.ext import Application, CommandHandler, ContextTypes

BOT_TOKEN = "8445154646:AAEQwboeVjAH0Lpd7NXPIhlCMQA0ePaw658"

# Map subtitle codes to your uploaded file_ids (single or ZIP)
SUB_FILES = {
    "Battle_game_in_5_seconds": "BQACAgUAAxkBAAM3aPyvr6U_-Qk_p1g-Xs7kol5-sx0AAoQYAAJ6r-lXvQjrXsDESTs2BA",
    "Assassination_classroom": "BQACAgUAAxkBAAM4aPyxLVVJnQFVqyS5uOXMSMEwgb4AAokYAAJ6r-lXbWWnc9P_W9k2BA",
    "Blue_Box": "BQACAgUAAxkBAAM5aPyx5_TPt4bWpncne7o0SiIHlkgAApEYAAJ6r-lXHI_QQpE5arM2BA",
    "Bocchi_the_Rock": "BQACAgUAAxkBAAM6aPyylPK2tyWzN7mk-sW-wIJuaesAApIYAAJ6r-lXwHVdnCz78yI2BA",
    "Call_of_the_Night": "BQACAgUAAxkBAAM7aPyzohVxMAiLN4CzXk3cmCp6_LQAApYYAAJ6r-lXLUjnTFYE-jM2BA",
    "Chainsaw_Man": "BQACAgUAAxkBAAM8aPy02zyP3NK0IiNbSso-_oksaPwAApcYAAJ6r-lX2o6yLxfIZLI2BA",
    "Erased": "BQACAgUAAxkBAAM9aPy2dY9NDZE3_GMCe6n5CA539sIAAqAYAAJ6r-lX0U7Ns5Zx8a42BA",
    "Haikyuu": "BQACAgUAAxkBAAM-aPy4cNMo-oiyVPW2Thw6NZSf8_oAAqIYAAJ6r-lXu3pFXwKmWr02BA",
    "Haikyuu_Dumpster_Battle": "BQACAgUAAxkBAAM_aPy5ImJmCYHVVtbUXPMbgLkEkr4AAqUYAAJ6r-lXxekf_vGGZ4o2BA",
    "Heavenly_Delusion": "BQACAgUAAxkBAANAaPy6D74KQsPsPhlh3gyPsMHEyAMAAqcYAAJ6r-lXuT7FcIZV_m02BA",
    "Hell's_Paradise": "BQACAgUAAxkBAANBaPy6-660vZZHG_A82ep6Exu9P84AAqsYAAJ6r-lXIQ2hJp5DtpU2BA",
    "K-On": "BQACAgUAAxkBAANCaPy8Ge97O0mzs3HHzX__B5B-BZkAAq0YAAJ6r-lXBmzVrOnUo602BA",
    "Kengan_Ashura": "BQACAgUAAxkBAANDaPy-JFE9oUkuVMwO9Ph3BJSvmCcAArEYAAJ6r-lXbOJXcSMguHo2BA",
    "Kono_Suba": "BQACAgUAAxkBAANEaPzARidvHvTfc-lBBnDuf9s3SeIAArUYAAJ6r-lXnuSuwdiwSb02BA",
    "Kuroko_no_Basket": "BQACAgUAAxkBAANFaPzB5-g5AAEhmtOjFX9bgPoBrSqNAAK7GAACeq_pVx9il0ro4jk1NgQ",
    "Naruto_Classic": "BQACAgUAAxkBAANGaPzEQbRMMQ0QnqIPnlwUWj2GP7MAAscYAAJ6r-lX_TCUAAH_qPBvNgQ",
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
