import json, re
from pathlib import Path
from bs4 import BeautifulSoup

ROOT = Path(".")          # run from website root
OUT = ROOT / "api"
OUT.mkdir(exist_ok=True)

CATEGORY_DIRS = {
  "Anime": "Anime",
  "Movies": "Movies",
  "Games": "Games",
  "Tv Series": "TV Series",
  "Updates": "Updates"
}

def clean_text(x: str) -> str:
  return re.sub(r"\s+", " ", (x or "")).strip()

def get_meta(soup, name=None, prop=None):
  if name:
    t = soup.find("meta", attrs={"name": name})
    if t and t.get("content"): return clean_text(t["content"])
  if prop:
    t = soup.find("meta", attrs={"property": prop})
    if t and t.get("content"): return clean_text(t["content"])
  return ""

def slugify(s):
  s = s.lower().strip()
  s = re.sub(r"[^a-z0-9]+", "-", s)
  return s.strip("-") or "post"

def pick_main_content(soup):
  # try common containers
  for sel in ["article", ".article", ".post", ".content", "main", ".container"]:
    t = soup.select_one(sel)
    if t and len(t.get_text(" ", strip=True)) > 200:
      return t
  return soup.body or soup

def parse_article_html(path: Path, category: str):
  html = path.read_text(encoding="utf-8", errors="ignore")
  soup = BeautifulSoup(html, "lxml")

  title = get_meta(soup, name="title") or soup.title.get_text(strip=True) if soup.title else path.stem
  desc  = get_meta(soup, name="description")
  cover = get_meta(soup, prop="og:image")

  content_node = pick_main_content(soup)
  # remove scripts/styles
  for bad in content_node.find_all(["script","style","noscript"]):
    bad.decompose()

  content_html = str(content_node)

  return {
    "id": slugify(path.stem),
    "title": title,
    "category": category,
    "date": "",  # optional (you can fill later if needed)
    "coverUrl": cover,
    "excerpt": desc,
    "contentHtml": content_html
  }

def build_posts():
  posts = []
  for folder, cat in CATEGORY_DIRS.items():
    d = ROOT / folder
    if not d.exists(): 
      continue
    for p in d.glob("*.html"):
      # skip listing pages
      if p.name.lower() in ["anime.html","movies.html","games.html","tv series.html","updates.html"]:
        continue
      posts.append(parse_article_html(p, cat))
  posts.sort(key=lambda x: x["title"].lower())
  (OUT / "posts.json").write_text(json.dumps(posts, ensure_ascii=False, indent=2), encoding="utf-8")
  print("posts:", len(posts))

def build_downloads_index():
  idx = ROOT / "downloads" / "index.html"
  if not idx.exists():
    print("downloads index missing")
    return

  soup = BeautifulSoup(idx.read_text(encoding="utf-8", errors="ignore"), "lxml")
  cards = soup.select(".card")
  items = []
  for c in cards:
    cat = (c.get("data-category") or "").strip()
    title = clean_text(c.select_one("h3").get_text() if c.select_one("h3") else "")
    img = (c.select_one("img").get("src") if c.select_one("img") else "") or ""
    meta = clean_text(c.select_one("p").get_text() if c.select_one("p") else "")
    btn = c.select_one("button.download-btn")
    href = btn.get("data-href") if btn else ""
    if href:
      href = "https://motionpicturemafia.com/downloads/" + href.replace("\\", "/").lstrip("/")
    items.append({
      "id": slugify(title) or slugify(href),
      "type": cat,              # anime/movie/tv/asian-drama
      "title": title,
      "image": img,
      "meta": meta,
      "detailUrl": href
    })

  (OUT / "downloads_index.json").write_text(json.dumps(items, ensure_ascii=False, indent=2), encoding="utf-8")
  print("downloads:", len(items))

def build_subtitles():
  js = ROOT / "subtitle-download" / "sub.js"
  if not js.exists():
    print("sub.js missing")
    return
  text = js.read_text(encoding="utf-8", errors="ignore")

  # extract each object: { ... }
  objs = re.findall(r"\{[\s\S]*?\}", text)
  subs = []
  for o in objs:
    def grab(key):
      m = re.search(rf"{key}\s*:\s*\"([^\"]*)\"", o)
      return m.group(1).strip() if m else ""
    def grab_bool(key):
      m = re.search(rf"{key}\s*:\s*(true|false)", o)
      return (m.group(1) == "true") if m else False

    sid = grab("id")
    title = grab("title")
    plot = grab("plot")
    img = grab("img")
    has_video = grab_bool("hasVideoDownload")
    video_link = grab("videoDownloadLink")

    if not sid and not title:
      continue

    subs.append({
      "id": sid or slugify(title),
      "title": title,
      "plot": plot,
      "image": img,
      "hasVideoDownload": has_video,
      "videoDownloadLink": video_link
    })

  (OUT / "subtitles.json").write_text(json.dumps(subs, ensure_ascii=False, indent=2), encoding="utf-8")
  print("subtitles:", len(subs))

if __name__ == "__main__":
  build_posts()
  build_downloads_index()
  build_subtitles()
