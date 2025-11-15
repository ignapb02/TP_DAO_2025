#!/usr/bin/env python3
"""
Servidor simple para el frontend de Turnero Médico.
Ejecuta: python serve_frontend.py
Luego abre http://localhost:8000 en tu navegador.
"""

import http.server
import socketserver
import os
import webbrowser
from pathlib import Path


PORT = 8000
FRONTEND_DIR = Path(__file__).parent / "frontend"


class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    extensions_map = http.server.SimpleHTTPRequestHandler.extensions_map.copy()
    for ext, mime in list(extensions_map.items()):
        if mime.startswith('text/') or mime in ('application/javascript', 'application/json'):
            if 'charset' not in mime.lower():
                extensions_map[ext] = f"{mime}; charset=utf-8"

    def do_GET(self):
        if self.path in ('', '/'):
            self.path = '/index.html'
        self.directory = str(FRONTEND_DIR)
        return super().do_GET()

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        self.send_header('Expires', '0')
        return super().end_headers()

    def log_message(self, format, *args):
        print(f"[{self.log_date_time_string()}] {format % args}")


if __name__ == "__main__":
    os.chdir(str(FRONTEND_DIR.parent))
    Handler = MyHTTPRequestHandler

    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Servidor frontend ejecutándose en http://localhost:{PORT}")
        print(f"Sirviendo archivos desde: {FRONTEND_DIR}")
        print("Presiona Ctrl+C para detener el servidor")

        try:
            webbrowser.open(f'http://localhost:{PORT}')
        except Exception:
            pass

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServidor detenido.")
