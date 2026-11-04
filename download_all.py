import os
import re
import urllib.request
import urllib.error
from urllib.parse import urlparse, urljoin
import concurrent.futures

BASE_URL = "https://donate.kylerescuer.org"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

PAGES = [
    ("/", "index.html"),
    ("/v2/", "v2/index.html"),
    ("/v3/", "v3/index.html"),
    ("/v4/", "v4/index.html"),
    ("/v5/", "v5/index.html"),
    ("/v6/", "v6/index.html"),
    ("/v7/", "v7/index.html"),
    ("/v8/", "v8/index.html"),
    ("/thank-you/", "thank-you/index.html"),
    ("/privacy-policy/", "privacy-policy/index.html"),
    ("/terms-and-conditions/", "terms-and-conditions/index.html"),
    ("/cookie-policy/", "cookie-policy/index.html"),
    ("/donation-policy/", "donation-policy/index.html"),
    ("/refund-policy/", "refund-policy/index.html"),
]

def fetch(url):
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=25) as resp:
            return resp.read()
    except Exception as e:
        print(f"Failed to fetch {url}: {e}")
        return None

def save_file(rel_path, data):
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
    urls = set()
    patterns = [
        r'[\"\'\`\(=](\/(?:_next|caio|susan|documentos|[a-zA-Z0-9_\-\.]+)[a-zA-Z0-9_\-\.\/]*\.(?:webp|jpg|jpeg|png|svg|ico|gif|woff|woff2|ttf|eot|js|css)(?:\?[a-zA-Z0-9_\-\.=]*)?)',
        r'url\([\'\"]?(\/[^\)\'\"]+\.(?:woff2|woff|ttf|eot|png|jpg|jpeg|svg|webp))[\'\"]?\)',
        r'href=[\"\'](\/[^\"\']+\.css(?:\?[^\"\']*)?)[\"\']',
        r'src=[\"\'](\/[^\"\']+\.js(?:\?[^\"\']*)?)[\"\']',
    ]
    for p in patterns:
        for m in re.finditer(p, content_str):
            urls.add(m.group(1))
    return urls

def download_asset(asset_rel):
    clean_rel = asset_rel.split("?")[0]
    local_path = clean_rel[1:] if clean_rel.startswith("/") else clean_rel
    
    # If already exists and is non-empty, skip re-download unless it's a code file to parse
    data = None
    if os.path.exists(local_path) and os.path.getsize(local_path) > 0:
        if clean_rel.endswith(".css") or clean_rel.endswith(".js"):
            with open(local_path, "rb") as f:
                data = f.read()
            return (asset_rel, data, True)
        return (asset_rel, None, True)

    full_url = BASE_URL + asset_rel
    print(f"Downloading asset: {full_url}")
    data = fetch(full_url)
    if data:
        save_file(local_path, data)
        return (asset_rel, data, False)
    return (asset_rel, None, False)

def main():
    assets_queue = set()

    print("=== Step 1: Downloading all 14 pages ===")
    for url_path, local_save_path in PAGES:
        full_url = BASE_URL + url_path
        print(f"Downloading page: {full_url} -> {local_save_path}")
        data = fetch(full_url)
        if data:
            save_file(local_save_path, data)
            content_str = data.decode("utf-8", errors="ignore")
            assets = extract_asset_urls(content_str)
            assets_queue.update(assets)

    print(f"\nDiscovered {len(assets_queue)} initial asset URLs across all pages.")

    print("\n=== Step 2: Downloading all assets and parsing CSS/JS ===")
    processed = set()
    while assets_queue:
        batch = [a for a in assets_queue if a.split("?")[0] not in processed]
        assets_queue.clear()
        if not batch:
            break

        for a in batch:
            processed.add(a.split("?")[0])

        with concurrent.futures.ThreadPoolExecutor(max_workers=8) as executor:
            results = list(executor.map(download_asset, batch))

        for asset_rel, data, from_disk in results:
            if data and (asset_rel.endswith(".css") or asset_rel.endswith(".js")):
                try:
                    text = data.decode("utf-8", errors="ignore")
                    more_assets = extract_asset_urls(text)
                    for ma in more_assets:
                        c_ma = ma.split("?")[0]
                        if c_ma not in processed:
                            assets_queue.add(ma)
                except Exception:
                    pass

    # Step 3: Also grab kylerescuer.org links page
    print("\n=== Step 3: Downloading main domain links page ===")
    main_page_data = fetch("https://kylerescuer.org/")
    if main_page_data:
        save_file("kylerescuer-links/index.html", main_page_data)

    print(f"\nAll downloads completed successfully! Total processed: {len(processed)} assets.")

if __name__ == "__main__":
    main()

