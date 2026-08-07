# Maintenance Notes

This document is the practical "where do I edit that?" guide for returning to the site after a quiet stretch.

## Routine Content Updates

Run this after content edits:

```sh
npm run check
PATH="$PWD/.venv/bin:$PATH" npm run build
```

Content lives in `content/` as Markdown with YAML frontmatter. The build loads `content/**/*.md`, skips files without `published: true`, validates the remaining frontmatter with `src/content/schemas/`, and converts the Markdown body to HTML.

Common updates:

- Homepage headline and intro: `content/singles/Hero.md`.
- Homepage current search/availability note: `content/singles/Current Focus.md`.
- Homepage at-a-glance details: `content/singles/At A Glance.md`.
- Resume name, headline, location, and summary: `content/resume/Profile.md`.
- Resume metrics: `content/resume/At A Glance.md`.
- Resume skills: `content/resume/Skills.md`.
- Work history: `content/experience/*.md`.
- Education: `content/education/*.md`.
- Email, website, and social links: `content/contact/*.md` and `content/social/*.md`.
- Organization names, display labels, locations, and optional logos: `content/organizations/*.md`.
- Site URL, favicon, social image, resume download path, and generated pages: `config.yaml`. Pages are configured in the `pages` list. Each entry has a supported `key` (`home`, `resume`, or `privacy`), `title`, `description`, and output `path`; `canonicalPath` is optional and defaults to `path`. Omit a page entry to exclude its HTML page. Set `pdf: true` on an HTML page entry to generate a PDF with the same basename, such as `dist/resume.pdf` from `/resume.html`.

## Frontmatter Quick Reference

Every rendered Markdown file needs:

```yaml
---
title: Human-readable title
archetype: article
published: true
---
```

The `archetype` selects the schema:

- `article`: freeform body content used for homepage singles.
- `profile`: resume profile fields, including `name`, `headline`, and `location`.
- `metrics`: resume metric cards with `metrics`.
- `skills`: resume skill groups with `groups`.
- `experience-section`: optional resume experience heading and positive integer `limit`.
- `experience`: work entries with organization slug, job title, role, location, type, dates, and optional resume summary/highlights.
- `degree` or `certificate`: education entries with an organization slug, program, dates, and optional degree details.
- `link`: contact or social links with `href`, `label`, `slug`, `areas`, and optional `icon` and `order`.
- `organization`: organization metadata with `slug`, `label`, `location`, and optional `logo`.

Dates should stay ISO-like, such as `2023-06-20`, so sorting remains predictable.

## Resume Behavior

The resume page is generated from shared content rather than a separate document.

- `content/resume/Profile.md` feeds the header/profile summary.
- `content/resume/At A Glance.md` feeds the metric strip.
- `content/resume/Skills.md` feeds skill groups.
- The `title` in each of those three files controls its resume section heading.
- Optional `article` entries in a resume content directory render as freeform sections after the profile. Their `title` controls the section heading, and an optional numeric `order` controls their sequence.
- An optional `resume/Experience.md` entry with archetype `experience-section` controls the Experience heading and can limit the newest-first list with a positive integer `limit`. Without it, every included experience entry renders.
- `content/experience/*.md` feeds resume experience when included by `src/content/ExperienceEntry.tsx`.
- `content/education/*.md` feeds resume education when included by `src/content/EducationEntry.ts`. Education entries reference `content/organizations/*.md` with `organization` slugs; organization titles are the full institution names, and organization labels are the compact homepage labels.
- Links with `areas: [resume]` in `content/contact/` or `content/social/` appear in the resume header.

Experience entries can include resume-specific copy:

```yaml
resume:
  summary: Short resume-facing role summary.
  highlights:
    - Specific accomplishment or responsibility.
```

Use `resumeInclude: false` to keep an entry off the resume while leaving it available elsewhere.

## Link Placement

Links use the `areas` frontmatter field to control where they appear:

- `header`: top site navigation contact link.
- `footer`: footer links.
- `cta`: homepage hero call-to-action links.
- `resume`: resume contact links.

The `slug` field is used for analytics event names such as `github-clicked`. Keep it lowercase with only letters, numbers, and hyphens. The `order` field controls ordering within a placement. Supported icon names depend on the local icon handling in `src/content/links.tsx` and the components under `src/components/icons/`.

## Assets

Public files live in `public/` and are copied to `dist/` during `npm run build`.

- Organization logos are referenced from `content/organizations/*.md` when available.
- `public/assets/social-image.png` is the configured social preview image.
- `public/favicon.svg` is the configured favicon.
- Local fonts are in `public/assets/fonts/` and wired through `src/styles/fonts.css`.

When replacing images, keep filenames stable if possible. If a filename changes, update the relevant Markdown or `config.yaml` reference.

## Build Pipeline

`src/build/build.tsx` owns the complete site build. A normal `npm run build` cleans
`dist/` through the `prebuild` script, then:

1. Loads and validates `config.yaml` and the published Markdown content.
2. Copies `public/` into `dist/`.
3. Bundles and minifies `src/styles/main.css` into `dist/assets/main.css`.
4. Renders each configured page to HTML.
5. Generates a PDF for each page configured with `pdf: true`.
6. Writes the sitemap from the configured routes.

PDF generation uses WeasyPrint and therefore requires the project virtual environment
on `PATH` locally. Pages without `pdf: true` do not produce a PDF.

## Dependency Updates

For occasional dependency maintenance:

```sh
npm outdated
npm update
npm run check
PATH="$PWD/.venv/bin:$PATH" npm run build
```

For major version updates, update one toolchain area at a time and verify before moving on. The highest-risk areas are React rendering, TypeScript/ESLint, Lightning CSS output, `marked` Markdown rendering, and WeasyPrint PDF generation.

Python PDF dependency updates are controlled by `requirements.txt`. After changing it, rebuild the virtual environment or reinstall:

```sh
.venv/bin/python -m pip install -r requirements.txt
```

## Local Preview

Run:

```sh
PATH="$PWD/.venv/bin:$PATH" npm run dev
```

The dev script builds the site, watches `src/**/*`, `content/**/*`, `public/**/*`, and
`config.yaml`, and serves `dist/` at `http://localhost:3000`.

## Deployment

`.github/workflows/pages.yml` deploys to GitHub Pages on pushes to `main` and manual workflow runs. The workflow:

1. Installs Node dependencies with `npm ci`.
2. Installs WeasyPrint system and Python dependencies.
3. Runs `npm run check`.
4. Runs `npm run build`.
5. Uploads `dist/` to Pages.

Do not commit `dist/` unless the deployment strategy changes.

## Troubleshooting

If frontmatter validation fails, the build error reports the Markdown filename and failing field path. Check the matching schema in `src/content/schemas/`.

If `weasyprint` is missing while generating a configured PDF, make sure the virtual environment exists and that `.venv/bin` is in `PATH` for the build command.

If the generated PDF looks wrong but the HTML resume is correct, inspect print styles in `src/pages/Resume.css` and component CSS under `src/components/resume/`.
