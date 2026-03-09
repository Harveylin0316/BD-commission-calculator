#!/usr/bin/env python3
"""Simple server that serves index.html at / so http://localhost:8080 works."""
import http.server
import os

class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/" or self.path == "":
            self.path = "/index.html"
        return http.server.SimpleHTTPRequestHandler.do_GET(self)

os.chdir(os.path.dirname(os.path.abspath(__file__)))
http.server.HTTPServer(("", 8080), Handler).serve_forever()
