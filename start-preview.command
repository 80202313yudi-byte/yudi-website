#!/bin/zsh
set -euo pipefail

cd "$(dirname "$0")"

if [ ! -x ".venv/bin/python" ]; then
  python3 -m venv .venv
fi

if ! .venv/bin/python -c "import livereload" >/dev/null 2>&1; then
  .venv/bin/python -m pip install -r requirements-dev.txt
fi

exec .venv/bin/python devserver.py --open
