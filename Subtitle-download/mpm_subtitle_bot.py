import json
from datetime import datetime, timedelta, timezone
from telegram import Update
from telegram.ext import Application, CommandHandler, ContextTypes

BOT_TOKEN = "8445154646:AAEQwboeVjAH0Lpd7NXPIhlCMQA0ePaw658"  
USERS_FILE = "users.json"
STATS_FILE = "stats.json"
ADMIN_IDS = [1455650122] 

# Subtitle mappings
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
    "Hells_Paradise": "BQACAgUAAxkBAAO2aP2ziwdQC7CPM2ZtLPJ0K4Bl1qgAAkgYAAKPvehXFV1pcS63-Fs2BA",
    "K-On": "BQACAgUAAxkBAANCaPy8Ge97O0mzs3HHzX__B5B-BZkAAq0YAAJ6r-lXBmzVrOnUo602BA",
    "Kengan_Ashura": "BQACAgUAAxkBAANDaPy-JFE9oUkuVMwO9Ph3BJSvmCcAArEYAAJ6r-lXbOJXcSMguHo2BA",
    "Kono_Suba": "BQACAgUAAxkBAANEaPzARidvHvTfc-lBBnDuf9s3SeIAArUYAAJ6r-lXnuSuwdiwSb02BA",
    "Kuroko_no_Basket": "BQACAgUAAxkBAANFaPzB5-g5AAEhmtOjFX9bgPoBrSqNAAK7GAACeq_pVx9il0ro4jk1NgQ",
    "Naruto_Classic": "BQACAgUAAxkBAANGaPzEQbRMMQ0QnqIPnlwUWj2GP7MAAscYAAJ6r-lX_TCUAAH_qPBvNgQ",
    "God_Eater": "BQACAgUAAxkBAAIBA2j_BsH3BFQlXs_5RlIcITWr6RsQAAL3FwACj734V5uIF5bn5Y1mNgQ",
    "Pantheon": "BQACAgUAAxkBAAIBBGj_CBP8eFYXKBiu8SHN2FUfJ_CGAAIDGAACj734V9WyOPWOoYXvNgQ",
    "Pseudo_Harem": "BQACAgUAAxkBAAIBBWj_CUKrppYSdr_FCbEKz_HK6oktAAIHGAACj734V9iAIRw1yMh6NgQ",
    "Record_of_Ragnarok": "BQACAgUAAxkBAAIBBmj_Cq7BS4gNqB7uscjq1WCPZaB6AAILGAACj734V3gzuWt09mMAATYE",
    "ReLife": "BQACAgUAAxkBAAIBB2j_C4xYUkzgIH8FCMnrZ6FDHD7PAAINGAACj734V59KMFxiAAE7fzYE",
    "Rent_a_Girlfriend": "BQACAgUAAxkBAAIBCGj_DK_dOUhFbpgMNRuimUZkueoQAAIPGAACj734V9SAR5J1yntaNgQ",
    "Sword_Art_Online": "BQACAgUAAxkBAAIBCWj_DbgoehAv8fxC-vYruyBn8jJ8AAISGAACj734V-tJO6qq6JtDNgQ",
    "Sound_Euphonium": "BQACAgUAAxkBAAIBC2j_D2l3SgdU2q5jAAF2tbSCQREKhAACFxgAAo-9-FdrF7DZx4uf9TYE",
    "Summertime_Rendering": "BQACAgUAAxkBAAIBDGj_D_AHYsE0a_Q2VL2YsVyDsTYuAAIZGAACj734V_0uG4QzUCTJNgQ",
    "Tower_of_God": "BQACAgUAAxkBAAIBDWj_EJYAAYvfmwr9w8S-7oS-8Vll3wACGxgAAo-9-Fel72BhodX5mzYE",
    "Violet_Evergarden": "BQACAgUAAxkBAAIBDmj_EZ2dEOURwJ26S19Yz3nmav3aAAIcGAACj734V08USwXER6_hNgQ",
    "Your_lie_in_April": "BQACAgUAAxkBAAIBD2j_EueQjCwhw10eIDJ8fS8_GrqvAAIvGAACj734V1PAsgfWoEwtNgQ",
}

# --- Helper Functions ---
def load_json(file, default):
    try:
        with open(file, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        return default

def save_json(file, data):
    with open(file, "w") as f:
        json.dump(data, f, indent=2)

# Sri Lanka timezone
SL_TIME = timezone(timedelta(hours=5, minutes=30))

# --- Commands ---
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handles /start and logs user info"""
    user = update.effective_user
    user_id = user.id
    users = load_json(USERS_FILE, {})

    if str(user_id) not in users:
        users[str(user_id)] = {
            "username": user.username or "Unknown",
            "join_date": datetime.now(SL_TIME).strftime("%Y-%m-%d %H:%M:%S"),
        }
        save_json(USERS_FILE, users)
        print(f"✅ New user added: {user.username or user_id}")

    text = update.message.text
    if text.startswith("/start "):
        code = text.split(" ")[1]
        if code in SUB_FILES:
            await context.bot.send_document(
                chat_id=update.effective_chat.id,
                document=SUB_FILES[code],
                caption=f"🎬 Subtitle: {code} — Motion Picture Mafia"
            )
        else:
            await update.message.reply_text("❌ Subtitle not found.")
    else:
        await update.message.reply_text(
            "👋 Welcome to MPM Subtitles Bot!\n\n"
            "Use /help to learn how to download Sinhala subtitles."
        )

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "📌 How to download Sinhala anime subtitles:\n\n"
        "1. Go to https://motionpicturemafia.com/subtitle-download/\n"
        "2. Find your anime.\n"
        "3. Click 'Download via Telegram'.\n"
        "4. Subtitles will be delivered here! 🎉"
    )

async def broadcast(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = update.effective_user.id
    if user_id not in ADMIN_IDS:
        await update.message.reply_text("🚫 You are not authorized.")
        return

    users = load_json(USERS_FILE, {})
    success, failed = 0, 0

    if update.message.reply_to_message:
        msg = update.message.reply_to_message
        caption = msg.caption or ""
        for uid in users.keys():
            try:
                if msg.photo:
                    await context.bot.send_photo(uid, msg.photo[-1].file_id, caption=caption)
                elif msg.video:
                    await context.bot.send_video(uid, msg.video.file_id, caption=caption)
                elif msg.document:
                    await context.bot.send_document(uid, msg.document.file_id, caption=caption)
                else:
                    await context.bot.send_message(uid, caption)
                success += 1
            except Exception:
                failed += 1
    else:
        if not context.args:
            await update.message.reply_text("Usage: /broadcast <message> or reply to media.")
            return
        text = " ".join(context.args)
        for uid in users.keys():
            try:
                await context.bot.send_message(uid, text)
                success += 1
            except Exception:
                failed += 1

    save_json(STATS_FILE, {"sent": success, "failed": failed, "total": len(users)})
    await update.message.reply_text(f"📢 Sent: {success} | ❌ Failed: {failed}")

async def stats(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if update.effective_user.id not in ADMIN_IDS:
        await update.message.reply_text("🚫 You are not authorized.")
        return

    users = load_json(USERS_FILE, {})
    stats = load_json(STATS_FILE, {"sent": 0, "failed": 0})
    await update.message.reply_text(
        f"📊 MPM Bot Stats\n\n"
        f"👥 Total Users: {len(users)}\n"
        f"✅ Last Sent: {stats.get('sent')}\n"
        f"❌ Failed: {stats.get('failed')}"
    )

async def users_list(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Show all users in a table format (admin only)"""
    if update.effective_user.id not in ADMIN_IDS:
        await update.message.reply_text("🚫 You are not authorized.")
        return

    users = load_json(USERS_FILE, {})
    if not users:
        await update.message.reply_text("No users found yet.")
        return

    header = "📋 *Registered Users:*\n\n"
    table = "🧑 Username | 📅 Join Date\n"
    table += "———————————————\n"

    for uid, info in users.items():
        uname = info["username"]
        date = info["join_date"]
        table += f"@{uname} | {date}\n"

    await update.message.reply_text(header + f"```\n{table}\n```", parse_mode="Markdown")

# --- Main ---
def main():
    app = Application.builder().token(BOT_TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("help", help_command))
    app.add_handler(CommandHandler("broadcast", broadcast))
    app.add_handler(CommandHandler("stats", stats))
    app.add_handler(CommandHandler("users", users_list))
    print("🤖 MPM Subtitles Bot is running...")
    app.run_polling()

if __name__ == "__main__":
    main()
