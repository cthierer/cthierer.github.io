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
- Site URL, favicon, social image, resume download path, and generated pages: `config.yaml`. Pages are configured in the `pages` list. Each entry has a supported `key` (`home`, `resume`, or `privacy`), `title`, `description`, and output `path`; `canonicalPath` is optional and defaults to `path`. Omit a page entry to exclude that HTML page from the build. The standard `npm run build` command still expects the resume page so it can generate `dist/resume.pdf`.

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

The dev script builds the site, watches `src/**/*`, and serves `dist/` at `http://localhost:3000`.

The watch command currently watches `src/**/*`; if content-only edits do not rebuild automatically, rerun `npm run build`.

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

If `weasyprint` is missing locally, make sure the virtual environment exists and that `.venv/bin` is in `PATH` for the build command.

If the generated PDF looks wrong but the HTML resume is correct, inspect print styles in `src/pages/Resume.css` and component CSS under `src/components/resume/`.
