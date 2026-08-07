# cthierer.github.io

My personal profile and resume site.

This repository builds my small static website for `www.christhierer.com`, including a profile homepage, an HTML resume, and a generated PDF resume. I want it to stay low-maintenance: content lives in Markdown, rendering is handled by a small React server-rendered build script, and GitHub Pages publishes the generated `dist/` artifact.

## Table of Contents

- [Background](#background)
- [Install](#install)
- [Usage](#usage)
- [Content Maintenance](#content-maintenance)
- [Architecture](#architecture)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Maintainer](#maintainer)
- [Contributing](#contributing)
- [License](#license)

## Background

This is my personal web presence for engineering leadership job search, resume presentation, and small freelance credibility. It is built with React server rendering, TypeScript, Pico CSS, Lightning CSS, Markdown frontmatter, Zod validation, and WeasyPrint for the resume PDF.

The repository name matches the GitHub Pages convention. My production domain is configured in `config.yaml`.

## Install

Use Node.js 26 or newer and Python 3.13 or compatible local Python tooling for PDF generation.

```sh
npm ci
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
```

If `python3 -m venv .venv` fails because `ensurepip` is unavailable on Debian/Ubuntu, install local venv support first:

```sh
sudo apt install python3-venv
```

## Usage

Start a local rebuilding server:

```sh
PATH="$PWD/.venv/bin:$PATH" npm run dev
```

Build the site. The TypeScript build script renders HTML, bundles CSS, copies public
assets, writes the sitemap, and generates PDFs for pages configured with `pdf: true`:

```sh
PATH="$PWD/.venv/bin:$PATH" npm run build
```

Run the maintenance checks:

```sh
npm run check
```

Format the repository:

```sh
npm run format
```

The generated site is written to `dist/`. Treat `dist/` as build output, not source.

## Content Maintenance

Most routine updates I expect to make happen in `content/`:

- `content/singles/` controls homepage hero, current focus, and at-a-glance copy.
- `content/resume/` controls resume profile, metrics, and skills.
- `content/experience/` controls work history for both the homepage and resume.
- `content/education/` controls education entries.
- `content/contact/` and `content/social/` control header, footer, CTA, and resume links.
- `content/organizations/` stores organization labels, locations, slugs, and logos used by experience entries.

Markdown frontmatter is validated during `npm run build`. Set `published: true` for entries that should render. See [docs/maintenance.md](docs/maintenance.md) for the practical update checklist and frontmatter notes.

## Architecture

- `src/build/build.tsx` orchestrates the complete build: it loads configuration and Markdown content, copies public assets, bundles CSS, renders React pages to static HTML, generates configured PDFs, and writes `dist/sitemap.xml`.
- `config.yaml` controls generated pages through its `pages` list. Add `pdf: true` to an HTML page entry to generate a PDF alongside it; for example, `/resume.html` produces `/resume.pdf`.
- `src/styles/main.css` is bundled and minified by Lightning CSS.
- `src/pages/` contains page-level composition for the homepage and resume.
- `src/components/` contains reusable page, profile, hero, link, site, and resume components.
- `src/content/schemas/` contains the Zod schemas for Markdown frontmatter.
- `public/` contains static assets copied into `dist/`.

## Deployment

GitHub Pages deployment is handled by `.github/workflows/pages.yml` on pushes to `main` and manual `workflow_dispatch` runs. The workflow installs Node and Python dependencies, runs `npm run check`, builds my site, and uploads `dist/` to Pages.

## Troubleshooting

If a configured page has `pdf: true`, the build requires WeasyPrint. If `weasyprint`
is not found locally, make sure the virtual environment is installed and prepended to
`PATH` when building:

```sh
PATH="$PWD/.venv/bin:$PATH" npm run build
```

In some sandboxed environments, `tsx` may need approval because it opens an IPC pipe under `/tmp`.

## Maintainer

I maintain this site. You can reach me at [hello@christhierer.com](mailto:hello@christhierer.com).

## Contributing

This is my personal website, so I am not expecting unsolicited pull requests. If you are helping me maintain the site, open an issue or coordinate with me directly before changing positioning, resume content, analytics, dependencies, or deployment behavior.

Before merging meaningful changes, run:

```sh
npm run check
PATH="$PWD/.venv/bin:$PATH" npm run build
```

## License

UNLICENSED, copyright Chris Thierer.
