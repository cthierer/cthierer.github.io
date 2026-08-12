import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'
import { buildSite } from './buildSite'

const testConfig = `siteUrl: https://example.test
siteTitle: Test Site
favIcon: favicon.svg
profileImage: /assets/profile-image.webp
socialImage: /assets/social-image.png
resumeDownload: /resume.pdf
umamiWebsiteId: public-analytics-id
pages:
  - key: resume
    title: Resume
    path: /resume.html
    description: Test resume
`

test('private build output excludes Umami while public builds retain it', async t => {
	const cwd = process.cwd()
	await fs.mkdir(path.join(cwd, 'dist'), { recursive: true })
	const outputRoot = await fs.mkdtemp(path.join(cwd, 'dist', '.site-build-'))
	t.after(() => fs.rm(outputRoot, { recursive: true, force: true }))
	const configFile = path.join(outputRoot, 'config.yaml')
	await fs.writeFile(configFile, testConfig)

	for (const [outputName, analyticsEnabled] of [
		['private', false],
		['public', true],
	] as const) {
		const outputDir = path.join(outputRoot, outputName)
		await fs.mkdir(outputDir, { recursive: true })
		await fs.writeFile(path.join(outputDir, 'stale.txt'), 'remove me')
		await buildSite({
			analyticsEnabled,
			configFile,
			contentDirs: [path.join(cwd, 'content')],
			cwd,
			outputDir,
			pageKeys: ['resume'],
			privateDocument: !analyticsEnabled,
		})
		const html = await fs.readFile(path.join(outputDir, 'resume.html'), 'utf8')
		await assert.rejects(fs.access(path.join(outputDir, 'stale.txt')), /ENOENT/)

		if (analyticsEnabled) {
			assert.match(html, /https:\/\/cloud\.umami\.is\/script\.js/)
		} else {
			assert.doesNotMatch(html, /cloud\.umami\.is/)
			assert.match(html, /noindex, nofollow/)
			assert.doesNotMatch(html, /rel="canonical"|property="og:|name="twitter:/)
			await assert.rejects(fs.access(path.join(outputDir, 'sitemap.xml')), /ENOENT/)
		}
	}
})

test('private cover-letter builds write HTML and PDF without public metadata', async t => {
	const cwd = process.cwd()
	const temporaryRoot = process.platform === 'win32' ? path.join(cwd, 'dist') : '/tmp'
	const contentDir = await fs.mkdtemp(path.join(temporaryRoot, 'cover-letter-content-'))
	const binDir = await fs.mkdtemp(path.join(temporaryRoot, 'cover-letter-bin-'))
	const outputRoot = await fs.mkdtemp(path.join(cwd, 'dist', '.cover-letter-build-'))
	const outputDir = path.join(outputRoot, 'output')
	const configFile = path.join(outputRoot, 'config.yaml')
	const originalPath = process.env.PATH
	t.after(async () => {
		process.env.PATH = originalPath
		await Promise.all([
			fs.rm(contentDir, { recursive: true, force: true }),
			fs.rm(binDir, { recursive: true, force: true }),
			fs.rm(outputRoot, { recursive: true, force: true }),
		])
	})
	await fs.mkdir(path.join(contentDir, 'cover-letter'), { recursive: true })
	await fs.writeFile(
		path.join(contentDir, 'cover-letter', 'Letter.md'),
		`---
title: Example application
archetype: cover-letter
published: true
date: 2026-08-12
recipient:
  organization: Example Company
greeting: Dear team,
---

Thank you for considering my **application**.
`,
	)
	const fakeWeasyPrint = path.join(binDir, 'weasyprint')
	await fs.writeFile(
		fakeWeasyPrint,
		`#!/usr/bin/env node
require('node:fs').writeFileSync(process.argv.at(-1), 'test PDF')
`,
	)
	await fs.chmod(fakeWeasyPrint, 0o755)
	process.env.PATH = `${binDir}${path.delimiter}${originalPath ?? ''}`
	await fs.writeFile(configFile, testConfig)

	await buildSite({
		analyticsEnabled: false,
		configFile,
		contentDirs: [path.join(cwd, 'content'), contentDir],
		coverLetterEnabled: true,
		coverLetterRequired: true,
		cwd,
		outputDir,
		pageKeys: ['cover-letter'],
		privateDocument: true,
	})

	const html = await fs.readFile(path.join(outputDir, 'cover-letter.html'), 'utf8')
	assert.match(html, /<title>Example application<\/title>/)
	assert.match(html, /August 12, 2026/)
	assert.match(html, /Thank you for considering my <strong>application<\/strong>/)
	assert.match(html, /Sincerely,[\s\S]*Chris Thierer/)
	assert.match(html, /data-umami-event="cover-letter-download"/)
	assert.match(html, /noindex, nofollow/)
	assert.doesNotMatch(html, /rel="canonical"|property="og:|name="twitter:|cloud\.umami\.is/)
	assert.equal(await fs.readFile(path.join(outputDir, 'cover-letter.pdf'), 'utf8'), 'test PDF')
	await assert.rejects(fs.access(path.join(outputDir, 'sitemap.xml')), /ENOENT/)
})
