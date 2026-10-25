#!/usr/bin/env python3
"""Validador de enlaces internos del sitio estatico.

Comprueba que cada href interno apunta a:
  - una ruta HTML construida (con o sin barra final), o
  - un archivo estatico existente en dist/, o
  - un fragmento (#id) que exista en el propio documento.
"""
import os
import re
import glob
import sys
from urllib.parse import urlparse, unquote

DIST = "dist"


def built_routes() -> set[str]:
    routes = set()
    for p in glob.glob(f"{DIST}/**/*.html", recursive=True):
        rel = os.path.relpath(p, DIST)
        if rel.endswith("index.html"):
            r = "/" + rel[: -len("index.html")]
        else:
            r = "/" + rel[: -len(".html")]
        routes.add(r.rstrip("/") or "/")
        routes.add(r)
    return routes


def static_files() -> set[str]:
    files = set()
    for p in glob.glob(f"{DIST}/**/*", recursive=True):
        if os.path.isfile(p):
            files.add("/" + os.path.relpath(p, DIST))
    return files


def main() -> int:
    routes = built_routes()
    statics = static_files()
    broken = []

    for p in sorted(glob.glob(f"{DIST}/**/*.html", recursive=True)):
        html = open(p, encoding="utf-8").read()
        ids = set(re.findall(r'\bid="([^"]+)"', html))

        for href in re.findall(r'href="([^"]+)"', html):
            if href.startswith(("http://", "https://", "mailto:", "tel:", "data:", "//")):
                continue

            parsed = urlparse(unquote(href))
            path = parsed.path
            frag = parsed.fragment

            if not path:
                if frag and frag not in ids:
                    broken.append((p, href, f"fragmento '#{frag}' no existe en la pagina"))
                continue

            if not path.startswith("/"):
                broken.append((p, href, "ruta relativa no soportada"))
                continue

            if path in statics:
                continue

            if path.rstrip("/") in routes or path in routes:
                continue

            broken.append((p, href, "ruta no construida"))

    print(f"Rutas HTML: {len(routes)} | Archivos estaticos: {len(statics)}")
    if broken:
        print(f"\nENLACES ROTOS: {len(broken)}")
        seen = set()
        for page, href, why in broken:
            key = (why, href)
            if key in seen:
                continue
            seen.add(key)
            print(f"  {href}  <- {why}  ({page})")
        return 1

    print("\nOK — sin enlaces internos rotos")
    return 0


if __name__ == "__main__":
    sys.exit(main())
