import json
import asyncio
from telethon import TelegramClient, events
from datetime import datetime, timedelta
import os

API_ID = 7237826               # your api_id from my.telegram.org
API_HASH = "b99b48799d998f6219daa8927cb33059"      # your api_hash
BOT_TOKEN = "8464388414:AAFKaTBGc9BNp40znbNC25UD3oqFabsqWnI"
MOVIES_FILE = "movies.json"
AUTO_DELETE_TIME = 600  # 10 minutes

bot = TelegramClient('mpm_indexer', API_ID, API_HASH).start(bot_token=BOT_TOKEN)


# === Load or create movie index ===
def load_movies():
    if not os.path.exists(MOVIES_FILE):
        with open(MOVIES_FILE, "w") as f:
            json.dump({}, f)
    with open(MOVIES_FILE, "r") as f:
        return json.load(f)


def save_movies(data):
    with open(MOVIES_FILE, "w") as f:
        json.dump(data, f, indent=2)


# === /start COMMAND ===
@bot.on(events.NewMessage(pattern='/start'))
async def start_cmd(event):
    await event.reply(
        "👋 Hello! I’m MPM Smart Indexer.\n\n"
        "Just type a movie, anime, or series name — no commands needed.\n"
        "I’ll search our archive and send matching files 🎬📺"
    )
    print(f"[START] {event.sender_id} started the bot.")


# === Index New Files Sent to Archive Channel ===
@bot.on(events.NewMessage(incoming=True, func=lambda e: e.chat and e.chat.username == "mpmstorelk"))
async def index_new_file(event):
    if event.file:
        movies = load_movies()
        name = event.file.name or "Unknown"
        movies[name.lower()] = event.message.id
        save_movies(movies)
        print(f"[INDEXED] {name} added to database.")


# === User Search Messages ===
@bot.on(events.NewMessage(incoming=True))
async def search_movie(event):
    # Ignore commands
    if event.raw_text.startswith("/"):
        return

    query = event.raw_text.strip().lower()
    if not query:
        return

    print(f"[SEARCH] User: {event.sender_id} | Query: {query}")

    movies = load_movies()
    found = False

    for name, msg_id in movies.items():
        if query in name:
            try:
                print(f"[SEND] Found '{name}', sending file...")
                await bot.forward_messages(event.chat_id, msg_id, from_peer="mpmstorelk")

                # Auto-delete after 10 minutes
                await asyncio.sleep(AUTO_DELETE_TIME)
                async for msg in bot.iter_messages(event.chat_id, limit=1):
                    if msg:
                        await msg.delete()
                        print(f"[DELETE] File '{name}' auto-deleted from {event.sender_id}")
                found = True
                break
            except Exception as e:
                print(f"[ERROR] {e}")
                found = True

    if not found:
        await event.reply("❌ No results found for your query.")
        print(f"[NOT FOUND] {query}")


print("🤖 MPM Smart Indexer v2 is running... (with live console logging)")
bot.run_until_disconnected()
