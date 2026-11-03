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
	for (const extension of ['md', 'txt'] as const) {
		const artifact = await fs.readFile(path.join(outputDir, `cover-letter.${extension}`), 'utf8')
		assert.ok(artifact.endsWith('\n'))
		assert.doesNotMatch(artifact, /\r/)
	}
	await assert.rejects(fs.access(path.join(outputDir, 'sitemap.xml')), /ENOENT/)
})

test('configured public resume emits four document formats while preserving public metadata', async t => {
	const cwd = process.cwd()
	const root = await fs.mkdtemp(path.join(cwd, 'dist', '.format-build-'))
	const bin = await fs.mkdtemp(path.join('/tmp', 'format-bin-'))
	const outputDir = path.join(root, 'output')
	const originalPath = process.env.PATH
	t.after(async () => {
		process.env.PATH = originalPath
		await Promise.all([
			fs.rm(root, { recursive: true, force: true }),
			fs.rm(bin, { recursive: true, force: true }),
		])
	})
	await fs.writeFile(
		path.join(bin, 'weasyprint'),
		`#!/usr/bin/env node\nrequire('node:fs').writeFileSync(process.argv.at(-1), 'PDF')`,
	)
	await fs.chmod(path.join(bin, 'weasyprint'), 0o755)
	process.env.PATH = `${bin}${path.delimiter}${originalPath ?? ''}`
	const configFile = path.join(root, 'config.yaml')
	await fs.writeFile(
		configFile,
		testConfig.replace(
			'description: Test resume',
			'description: Test resume\n    formats: [html, pdf, md, txt]',
		),
	)
	await buildSite({ configFile, contentDirs: [path.join(cwd, 'content')], cwd, outputDir })
	for (const extension of ['html', 'pdf', 'md', 'txt'])
		await fs.access(path.join(outputDir, `resume.${extension}`))
	assert.match(await fs.readFile(path.join(outputDir, 'resume.html'), 'utf8'), /cloud\.umami\.is/)
	assert.match(await fs.readFile(path.join(outputDir, 'resume.html'), 'utf8'), /resume-download/)
	assert.match(await fs.readFile(path.join(outputDir, 'resume.md'), 'utf8'), /^# Chris Thierer/m)
	assert.match(await fs.readFile(path.join(outputDir, 'resume.txt'), 'utf8'), /^Chris Thierer/m)
	await fs.access(path.join(outputDir, 'sitemap.xml'))
})

test('resume document formats follow the configured HTML sibling path', async t => {
	const cwd = process.cwd()
	const root = await fs.mkdtemp(path.join(cwd, 'dist', '.cv-path-'))
	t.after(() => fs.rm(root, { recursive: true, force: true }))
	const outputDir = path.join(root, 'output')
	const configFile = path.join(root, 'config.yaml')
	await fs.writeFile(
		configFile,
		testConfig
			.replace('/resume.html', '/cv.html')
			.replace(
				'description: Test resume',
				'description: Test resume\n    formats: [html, md, txt]',
			),
	)
	await buildSite({
		configFile,
		contentDirs: [path.join(cwd, 'content')],
		cwd,
		outputDir,
		pageKeys: ['resume'],
	})
	for (const name of ['cv.html', 'cv.md', 'cv.txt']) await fs.access(path.join(outputDir, name))
	for (const name of ['resume.md', 'resume.txt'])
		await assert.rejects(fs.access(path.join(outputDir, name)), /ENOENT/)
	assert.doesNotMatch(await fs.readFile(path.join(outputDir, 'cv.html'), 'utf8'), /resume-download/)
})

test('external resume downloads remain available without a configured PDF sibling', async t => {
	const cwd = process.cwd()
	const root = await fs.mkdtemp(path.join(cwd, 'dist', '.external-resume-download-'))
	t.after(() => fs.rm(root, { recursive: true, force: true }))
	const outputDir = path.join(root, 'output')
	const configFile = path.join(root, 'config.yaml')
	await fs.writeFile(
		configFile,
		testConfig
			.replace(
				'resumeDownload: /resume.pdf',
				'resumeDownload: https://files.example.test/resume.pdf',
			)
			.replace('description: Test resume', 'description: Test resume\n    formats: [html]'),
	)
	await buildSite({
		configFile,
		contentDirs: [path.join(cwd, 'content')],
		cwd,
		outputDir,
		pageKeys: ['resume'],
	})
	assert.match(
		await fs.readFile(path.join(outputDir, 'resume.html'), 'utf8'),
		/href="https:\/\/files\.example\.test\/resume\.pdf"[^>]*data-umami-event="resume-download"/,
	)
})

test('application cover letter remains optional unless explicitly required', async t => {
	const cwd = process.cwd()
	const root = await fs.mkdtemp(path.join(cwd, 'dist', '.optional-letter-'))
	t.after(() => fs.rm(root, { recursive: true, force: true }))
	const outputDir = path.join(root, 'output')
	const options = {
		analyticsEnabled: false,
		configFile: path.join(root, 'config.yaml'),
		contentDirs: [path.join(cwd, 'content')],
		coverLetterEnabled: true,
		cwd,
		outputDir,
		pageKeys: ['cover-letter'],
		privateDocument: true,
	} as const
	await fs.writeFile(options.configFile, testConfig)
	await buildSite(options)
	await assert.rejects(fs.access(path.join(outputDir, 'cover-letter.html')), /ENOENT/)
	await assert.rejects(
		buildSite({ ...options, coverLetterRequired: true }),
		/cover letter was requested/,
	)
})

test('application package emits all eight private resume and cover-letter documents', async t => {
	const cwd = process.cwd()
	const root = await fs.mkdtemp(path.join(cwd, 'variants', 'output', '.application-package-'))
	const contentDir = await fs.mkdtemp(path.join('/tmp', 'application-package-content-'))
	const bin = await fs.mkdtemp(path.join('/tmp', 'application-package-bin-'))
	const outputDir = path.join(root, 'output')
	const originalPath = process.env.PATH
	t.after(async () => {
		process.env.PATH = originalPath
		await Promise.all([
			fs.rm(root, { recursive: true, force: true }),
			fs.rm(contentDir, { recursive: true, force: true }),
			fs.rm(bin, { recursive: true, force: true }),
		])
	})
	await fs.mkdir(path.join(contentDir, 'cover-letter'))
	await fs.writeFile(
		path.join(contentDir, 'cover-letter', 'letter.md'),
		`---\ntitle: Letter\narchetype: cover-letter\npublished: true\ndate: 2026-08-12\nrecipient:\n  organization: Example\ngreeting: Hello,\n---\n\nLetter **body**.`,
	)
	await fs.writeFile(
		path.join(bin, 'weasyprint'),
		`#!/usr/bin/env node\nrequire('node:fs').writeFileSync(process.argv.at(-1), 'PDF')`,
	)
	await fs.chmod(path.join(bin, 'weasyprint'), 0o755)
	process.env.PATH = `${bin}${path.delimiter}${originalPath ?? ''}`
	const configFile = path.join(root, 'config.yaml')
	await fs.writeFile(configFile, testConfig)
	await buildSite({
		analyticsEnabled: false,
		configFile,
		contentDirs: [path.join(cwd, 'content'), contentDir],
		coverLetterEnabled: true,
		coverLetterRequired: true,
		cwd,
		outputDir,
		outputMode: 'application',
		pageKeys: ['resume', 'cover-letter'],
		privateDocument: true,
	})
	for (const name of [
		'resume.html',
		'resume.pdf',
		'resume.md',
		'resume.txt',
		'cover-letter.html',
		'cover-letter.pdf',
		'cover-letter.md',
		'cover-letter.txt',
	])
		await fs.access(path.join(outputDir, name))
	const html = await fs.readFile(path.join(outputDir, 'resume.html'), 'utf8')
	assert.doesNotMatch(html, /cloud\.umami\.is|rel="canonical"|property="og:/)
	assert.match(html, /href="\/resume\.pdf"[^>]*data-umami-event="resume-download"/)
	assert.match(await fs.readFile(path.join(outputDir, 'resume.md'), 'utf8'), /## Profile/)
	assert.match(await fs.readFile(path.join(outputDir, 'cover-letter.txt'), 'utf8'), /Letter body/)
	await assert.rejects(fs.access(path.join(outputDir, 'sitemap.xml')), /ENOENT/)
})
