#!/usr/bin/env python3
from __future__ import annotations

import argparse
from pathlib import Path

from livereload import Server

PROJECT_ROOT = Path(__file__).resolve().parent
WATCH_PATTERNS = ("*.html", "*.css", "*.js")


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Run a live-reload preview server for this portfolio."
    )
    parser.add_argument(
        "--host",
        default="127.0.0.1",
        help="Host interface to bind. Default: 127.0.0.1",
    )
    parser.add_argument(
        "--port",
        type=int,
        default=4174,
        help="HTTP port for the preview server. Default: 4174",
    )
    parser.add_argument(
        "--open",
        action="store_true",
        help="Open the preview URL in your browser after startup.",
    )
    return parser


def main() -> None:
    args = build_parser().parse_args()

    server = Server()
    for pattern in WATCH_PATTERNS:
        server.watch(str(PROJECT_ROOT / pattern))

    url = f"http://{args.host}:{args.port}/index.html"
    print(f"Live preview running at {url}")
    print("Watching *.html, *.css, and *.js for changes.")

    server.serve(
        root=str(PROJECT_ROOT),
        host=args.host,
        port=args.port,
        open_url_delay=0.2 if args.open else None,
        restart_delay=0.2,
        live_css=True,
        default_filename="index.html",
    )


if __name__ == "__main__":
    main()
