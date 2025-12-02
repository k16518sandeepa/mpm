from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import StreamingResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from telethon import TelegramClient
import asyncio

# Telegram API credentials
api_id = 7237826            # Replace with your API ID
api_hash = 'b99b48799d998f6219daa8927cb33059'  # Replace with your API hash
client = TelegramClient('session', api_id, api_hash)

app = FastAPI()
CHUNK_SIZE = 1024 * 1024  # 1 MB chunks

# Static and templates
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# Sample playlist: replace with your Telegram channel and message IDs
VIDEOS = [
    {"title": "Video 1", "channel": "@YourChannel", "msg_id": 123},
    {"title": "Video 2", "channel": "@YourChannel", "msg_id": 124},
]

# Frontend route
@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request, "videos": VIDEOS})

# Streaming function
async def stream_telegram_file(channel_username: str, message_id: int, start: int, end: int):
    await client.start()
    message = await client.get_messages(channel_username, ids=message_id)
    
    if not message or not message[0].media:
        raise HTTPException(status_code=404, detail="Video not found")

    document = message[0].media.document
    total_size = document.size
    end = min(end, total_size - 1)
    bytes_remaining = end - start + 1
    offset = start

    while bytes_remaining > 0:
        read_size = min(CHUNK_SIZE, bytes_remaining)
        chunk = await client.download_media(
            message[0], file=bytes, thumb=-1,
            progress_callback=None, part_size_kb=1024,
            offset=offset, limit=read_size
        )
        yield chunk
        bytes_remaining -= len(chunk)
        offset += len(chunk)

# Streaming route
@app.get("/stream")
async def stream_video(request: Request, channel: str, msg_id: int):
    await client.start()
    message = await client.get_messages(channel, ids=msg_id)
    if not message or not message[0].media:
        raise HTTPException(status_code=404, detail="Video not found")
    
    document = message[0].media.document
    file_size = document.size

    # Range header
    range_header = request.headers.get('range', None)
    start = 0
    end = file_size - 1

    if range_header:
        range_val = range_header.replace('bytes=', '')
        if '-' in range_val:
            start_str, end_str = range_val.split('-')
            start = int(start_str)
            if end_str:
                end = int(end_str)

    if start >= file_size:
        raise HTTPException(status_code=416, detail="Requested Range Not Satisfiable")

    headers = {
        'Content-Range': f'bytes {start}-{end}/{file_size}',
        'Accept-Ranges': 'bytes',
        'Content-Length': str(end - start + 1),
        'Content-Type': 'video/mp4'
    }

    return StreamingResponse(stream_telegram_file(channel, msg_id, start, end), status_code=206, headers=headers)
