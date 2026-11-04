import os
import re
import urllib.request
import urllib.error
from urllib.parse import urlparse, urljoin

BASE_URL = "https://donate.kylerescuer.org"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

PAGES = [
    ("/v5/", "index.html"),
    ("/v5/", "v5/index.html"),
    ("/privacy-policy/", "privacy-policy/index.html"),
    ("/terms-and-conditions/", "terms-and-conditions/index.html"),
    ("/cookie-policy/", "cookie-policy/index.html"),
    ("/donation-policy/", "donation-policy/index.html"),
    ("/refund-policy/", "refund-policy/index.html"),
]

downloaded_urls = set()
visited_assets = set()

def fetch(url):
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return resp.read()
    except Exception as e:
        print(f"Failed to fetch {url}: {e}")
        return None

def save_file(rel_path, data):
    # remove query string if present
    clean_path = rel_path.split("?")[0]
    if clean_path.startswith("/"):
        clean_path = clean_path[1:]
    
    dir_name = os.path.dirname(clean_path)
    if dir_name:
        os.makedirs(dir_name, exist_ok=True)
    
    with open(clean_path, "wb") as f:
        f.write(data)
    print(f"Saved: {clean_path} ({len(data)} bytes)")

def extract_asset_urls(content_str):
    # Matches /_next/..., /caio/..., /susan/..., and other file extensions
    urls = set()
    # General regex for static assets
    patterns = [
        r'[\"\'\`\(=](\/(?:_next|caio|susan|[a-zA-Z0-9_\-\.]+)[a-zA-Z0-9_\-\.\/]*\.(?:webp|jpg|jpeg|png|svg|ico|gif|woff|woff2|ttf|eot|js|css)(?:\?[a-zA-Z0-9_\-\.=]*)?)',
        r'url\([\'\"]?(\/[^\)\'\"]+\.(?:woff2|woff|ttf|eot|png|jpg|jpeg|svg|webp))[\'\"]?\)',
        r'href=[\"\'](\/[^\"\']+\.css(?:\?[^\"\']*)?)[\"\']',
        r'src=[\"\'](\/[^\"\']+\.js(?:\?[^\"\']*)?)[\"\']',
    ]
    for p in patterns:
        for m in re.finditer(p, content_str):
            urls.add(m.group(1))
    return urls

def main():
    assets_queue = set()

    # 1. Download pages
    for url_path, local_save_path in PAGES:
        full_url = BASE_URL + url_path
        print(f"Downloading page: {full_url} -> {local_save_path}")
        data = fetch(full_url)
        if data:
            save_file(local_save_path, data)
            content_str = data.decode("utf-8", errors="ignore")
            assets = extract_asset_urls(content_str)
            assets_queue.update(assets)

    # 2. Known static files
    known = [
        "/favicon.ico",
        "/candid.svg",
        "/charity.png",
        "/caio/logo-kyle.webp",
        "/caio/vsl-poster-680.webp",
        "/caio/vsl-poster.webp",
        "/caio/historia/caio-1.webp",
        "/caio/historia/caio-2.webp",
        "/caio/historia/caio-3.webp",
        "/caio/historia/caio-4.webp",
        "/caio/historia/caio-5.webp",
        "/caio/historia/caio-6.webp",
        "/caio/abrigos/abrigo-dona-rose.webp",
        "/caio/abrigos/abrigo-salve-cao.webp",
        "/caio/abrigos/casa-da-mili.webp",
        "/caio/abrigos/siulsan-resgate.webp",
        "/caio/abrigos/sos-joana-darc.webp",
        "/susan/img/help-injured-dogs.webp",
        "/susan/img/help-injured-dogs-480.webp",
        "/susan/img/help-injured-dogs-750.webp",
        "/susan/img/help-injured-dogs-1100.webp",
        "/susan/img/help-injured-dogs-1400.webp",
        "/_next/static/media/6c596dfcddeca1e9-s.p.woff2",
        "/_next/static/media/6c596dfcddeca1e9-s.p.woff",
        "/_next/static/css/963a068a236c0ef1.css",
    ]
    assets_queue.update(known)

    # 3. Download all assets and recursively inspect CSS and JS
    processed = set()
    while assets_queue:
        asset_rel = assets_queue.pop()
        clean_rel = asset_rel.split("?")[0]
        if clean_rel in processed:
            continue
        processed.add(clean_rel)

        asset_url = BASE_URL + asset_rel
        print(f"Downloading asset: {asset_url}")
        data = fetch(asset_url)
        if data:
            save_file(asset_rel, data)
            if clean_rel.endswith(".css") or clean_rel.endswith(".js"):
                try:
                    text = data.decode("utf-8", errors="ignore")
                    more_assets = extract_asset_urls(text)
                    for ma in more_assets:
                        c_ma = ma.split("?")[0]
                        if c_ma not in processed:
                            assets_queue.add(ma)
                except Exception:
                    pass

    print(f"\nAll downloads completed! Processed {len(processed)} assets.")

if __name__ == "__main__":
    main()

