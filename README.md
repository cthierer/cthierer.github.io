cthierer.github.io
==================

## Local PDF generation

The resume PDF build uses WeasyPrint, which is pinned in `requirements.txt`.
On Debian/Ubuntu systems, Python may reject direct system installs with an
`externally-managed-environment` error. Use a project virtual environment
instead:

```sh
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
PATH="$PWD/.venv/bin:$PATH" npm run build
```

If `python3 -m venv .venv` fails because `ensurepip` is unavailable, install the
local venv support package first:

```sh
sudo apt install python3-venv
```

The GitHub Pages workflow installs the Python dependency during CI, so the
virtual environment is only needed for local PDF builds.
