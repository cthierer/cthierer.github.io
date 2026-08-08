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
		})
		const html = await fs.readFile(path.join(outputDir, 'resume.html'), 'utf8')
		await assert.rejects(fs.access(path.join(outputDir, 'stale.txt')), /ENOENT/)

		if (analyticsEnabled) {
			assert.match(html, /https:\/\/cloud\.umami\.is\/script\.js/)
		} else {
			assert.doesNotMatch(html, /cloud\.umami\.is/)
		}
	}
})
