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
- Resume section order, including Experience and Education: `content/resume/*.md`.
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
- `resume-section`: an ordered resume section. It requires a `kind`, `title`, and numeric `order`; supported kinds are `profile`, `metrics`, `skills`, `prose`, `experience`, and `education`.
- `experience`: work entries with organization slug, job title, role, location, type, dates, and optional resume summary/highlights.
- `degree` or `certificate`: education entries with an organization slug, program, dates, and optional degree details.
- `link`: contact or social links with `href`, `label`, `slug`, `areas`, and optional `icon` and `order`.
- `organization`: organization metadata with `slug`, `label`, `location`, and optional `logo`.

Dates should stay ISO-like, such as `2023-06-20`, so sorting remains predictable.

## Resume Behavior

The resume page is generated from shared content rather than a separate document.

- Every rendered body section is a `resume-section` entry in `content/resume/` and appears in ascending `order`. Baseline files use increments of ten, leaving room for a variant to insert a section without renumbering the baseline.
- The `profile` section feeds both the resume header and its body section. `metrics` has `metrics`, `skills` has `groups`, `prose` uses its Markdown body, `experience` may set a positive integer `limit`, and `education` has no additional payload.
- Exactly one section order may be used for each rendered section. `profile`, `metrics`, `skills`, `experience`, and `education` may appear at most once; a resume can have multiple `prose` sections.
- Section titles always come from their Markdown frontmatter. Keep the Experience and Education files even when their titles are unchanged so that all resume ordering is visible in one directory.
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

## Private Application Packages

Private role-specific application material uses the same public Markdown baseline and remains local under the ignored `variants/` directory. It is never deployed or committed. Back up that directory separately if the material must be preserved.

Build an application package (resume plus an optional cover letter) with:

```sh
PATH="$PWD/.venv/bin:$PATH" npm run build:application -- umbc-adjunct
```

This writes `resume.html`, `resume.pdf`, and, when present, `cover-letter.html` and
`cover-letter.pdf` under `variants/output/umbc-adjunct/`. Application documents are
private: analytics, sitemap, canonical/social metadata, and JSON-LD are omitted and
they include `noindex, nofollow`. Use `--page resume` or `--page cover-letter` to
narrow the build; explicitly requesting a missing cover letter fails.

Add `variants/<slug>/cover-letter/Letter.md` for a role-specific letter. Its body is
the letter text and it uses this frontmatter:

```yaml
---
title: Application cover letter
archetype: cover-letter
published: true
date: 2026-08-12
recipient:
  organization: Example Company
  name: Hiring Manager # optional
  title: Engineering Director # optional
  address: # optional
    - 123 Main Street
greeting: Dear Hiring Manager,
subject: Application for Engineering Leader # optional
closing: Sincerely, # optional; this is the default
---
```

There may be only one published cover-letter entry after content layers are resolved.
An unpublished or absent letter is skipped by the package build.

## Private Resume Variants

Build an existing variant with:

```sh
PATH="$PWD/.venv/bin:$PATH" npm run build:resume -- umbc-adjunct \
  --contentDir variants/content-sensitive
```

The resume preset infers its shared baseline and role-specific layer. Add any shared private material explicitly in its desired order:

```sh
PATH="$PWD/.venv/bin:$PATH" npm run build:resume -- umbc-adjunct \
  --contentDir variants/content-sensitive \
  --contentDir variants/umbc-adjunct
```

That command resolves the layers as `content/`, `variants/content-sensitive/`, and `variants/umbc-adjunct/`. If `content/` or `variants/<variant>/` is already specified, the preset does not add it twice; every other supplied layer retains its order. Without `--outputDir`, it writes local HTML, assets, sitemap, and the submission PDF to `variants/output/<variant>/`; the PDF is `variants/output/<variant>/resume.pdf`. A supplied `--outputDir` must remain below `variants/output/`. Analytics are disabled by default, but `--analytics` explicitly enables them.

The relative Markdown path is the overlay identity. For example, `variants/umbc-adjunct/resume/Skills.md` patches `content/resume/Skills.md`; if a baseline file is renamed, rename every matching patch. A patch can provide only changed frontmatter fields. Plain objects merge recursively, arrays and scalar values replace inherited values, and `null` removes an inherited field. A blank patch body inherits baseline Markdown; a nonblank body replaces it. Set `published: false` to suppress an inherited entry entirely.

To add a variant:

1. Create `variants/<lowercase-slug>/` and add only the files that differ from the baseline.
2. Add sensitive links, such as a phone number, under `variants/content-sensitive/` when they are appropriate for more than one private variant, and pass that directory with `--contentDir`.
3. Add a full `resume-section` file for a new section, choosing an unused order.
4. Build it with `npm run build:resume -- <lowercase-slug>` and inspect its HTML and PDF before submitting.

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

`src/build/build.tsx` resolves options before the shared build pipeline safely cleans the
selected output directory, then:

1. Loads and validates `config.yaml` and the published Markdown content.
2. Copies `public/` into the selected output directory.
3. Bundles and minifies `src/styles/main.css` into the selected output directory's `assets/` folder.
4. Renders each configured page to HTML.
5. Generates a PDF for each page configured with `pdf: true`.
6. Writes the sitemap from the configured routes.

PDF generation uses WeasyPrint and therefore requires the project virtual environment
on `PATH` locally. Pages without `pdf: true` do not produce a PDF.

The reusable build pipeline is in `src/build/buildSite.tsx`. Both commands use the same resolved options and cleanup lifecycle. Public `npm run build` defaults to `config.yaml`, `content/`, `dist/`, all configured pages, and analytics enabled; its explicit `--contentDir` values become the complete ordered layer list. `build:resume` is only a convenience preset over those same options. Cleanup accepts only `dist/` or its descendants for public builds, and strict descendants of `variants/output/` for resume builds; for example, `npm run build -- --outputDir dist/application`. It also rejects output paths that overlap source, configuration, or selected content, as well as symlinked paths.

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

Private variant source changes are not watched. Re-run `npm run build:resume -- <variant>` after editing a private resume.

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
