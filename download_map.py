import urllib.request
print("Downloading map...")
req = urllib.request.Request(
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/World_map_blank_without_borders.svg/1000px-World_map_blank_without_borders.svg.png',
    data=None,
    headers={
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'image/png'
    }
)
with urllib.request.urlopen(req) as response, open('public/worldmap.png', 'wb') as out_file:
    data = response.read()
    out_file.write(data)
print("Saved transparent map!")
