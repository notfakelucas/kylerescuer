import os

chunk_files = [
    "_next/static/chunks/6175-a2c6176f2569d077.js",
    "_next/static/chunks/app/v6/page-1d44cf4dd89c238b.js",
    "_next/static/chunks/app/v7/page-26ad621568e4e4ad.js",
    "_next/static/chunks/app/v8/page-441d6a8f4fe167b0.js"
]

converteai_script = "https://scripts.converteai.net/25b0cdcd-2b93-4910-aa45-91b9a6275957/players/6a6377b0031b3f35da8c0570/v4/player.js"
converteai_smart = "https://scripts.converteai.net/lib/js/smartplayer-wc/v4/smartplayer.js"
converteai_stream = "https://cdn.converteai.net/25b0cdcd-2b93-4910-aa45-91b9a6275957/6a6377a592c3629c8fbb3a85/main.m3u8"

for cpath in chunk_files:
    if not os.path.exists(cpath):
        continue
    with open(cpath, "r", encoding="utf-8") as f:
        content = f.read()

    content = content.replace(converteai_script, "/vsl-player.js")
    content = content.replace(converteai_smart, "/vsl-player.js")
    content = content.replace(converteai_stream, "/vsl-kylerescuer.mp4")
    content = content.replace("https://scripts.converteai.net", "")
    content = content.replace("https://cdn.converteai.net", "")

    with open(cpath, "w", encoding="utf-8") as f:
        f.write(content)
    
    print(f"Patched {cpath}")

print("All chunks patched successfully!")

