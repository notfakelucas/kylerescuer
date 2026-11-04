import os
import re

html_files = [
    "index.html",
    "v2/index.html",
    "v3/index.html",
    "v4/index.html",
    "v5/index.html",
    "v6/index.html",
    "v7/index.html",
    "v8/index.html"
]

converteai_patterns = [
    r'<link[^>]*href=[\"\']https?://(?:cdn|scripts|images)\.converteai\.net[\"\'][^>]*>\s*',
    r'<link[^>]*href=[\"\']https?://license\.vturb\.com[\"\'][^>]*>\s*',
    r'<link[^>]*href=[\"\']https?://(?:scripts|cdn)\.converteai\.net/[^\"\']*[\"\'][^>]*>\s*'
]

for fpath in html_files:
    if not os.path.exists(fpath):
        continue
    
    with open(fpath, "r", encoding="utf-8") as f:
        html = f.read()

    # 1. Remove external converteai links
    for pat in converteai_patterns:
        html = re.sub(pat, "", html)

    # 2. Add vsl-player.js script if not present
    script_tag = '<script src="/vsl-player.js" defer></script>'
    if script_tag not in html and 'vsl-player.js' not in html:
        # insert right before </head> or after meta tags
        if "</head>" in html:
            html = html.replace("</head>", f"{script_tag}</head>", 1)
        else:
            html = script_tag + html

    # 3. Enhance static <vturb-smartplayer> SSR markup to embed native video tag fallback
    # Match <vturb-smartplayer ...>...</vturb-smartplayer>
    def replace_vturb(match):
        full_match = match.group(0)
        # Check if already has video
        if "<video" in full_match:
            return full_match
        
        # Replace the placeholder inner img with video fallback
        video_markup = (
            '<vturb-smartplayer id="vid-6a6377b0031b3f35da8c0570" style="display:block;margin:0 auto;width:100%;border-radius:12px;overflow:hidden;">'
            '<div class="vturb-player-placeholder" style="position:relative;width:100%;padding:78.14761215629522% 0 0;z-index:0;background-color:black;border-radius:12px;overflow:hidden;">'
            '<video src="/vsl-kylerescuer.mp4" poster="/caio/vsl-poster.webp" playsinline controls preload="metadata" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:12px;"></video>'
            '</div></vturb-smartplayer>'
        )
        return video_markup

    html = re.sub(r'<vturb-smartplayer[^>]*>.*?</vturb-smartplayer>', replace_vturb, html, flags=re.DOTALL)

    with open(fpath, "w", encoding="utf-8") as f:
        f.write(html)
    
    print(f"Updated {fpath}")

print("All HTML files updated successfully!")
