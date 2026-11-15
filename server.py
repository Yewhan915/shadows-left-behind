from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import os, webbrowser
os.chdir(Path(__file__).resolve().parent)
class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, max-age=0")
        super().end_headers()

port = 8765
try:
    server = ThreadingHTTPServer(("127.0.0.1", port), NoCacheHandler)
except OSError:
    server = ThreadingHTTPServer(("127.0.0.1", 0), NoCacheHandler)
url = f"http://127.0.0.1:{server.server_port}/?v=20261111-final-12-photo-hover"
print(f"Shadows Left Behind: {url} — keep this window open. Ctrl+C to stop.", flush=True)
webbrowser.open(url)
try:
    server.serve_forever()
except KeyboardInterrupt:
    server.server_close()
