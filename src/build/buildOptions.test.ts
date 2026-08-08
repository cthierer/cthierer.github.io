import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { cleanOutput } from './cleanOutput'
import { resolveBuildOptions, validateVariantName } from './buildOptions'

const temporaryRoot = process.platform === 'win32' ? os.tmpdir() : '/tmp'

test('public build uses conventional defaults and explicit content layers replace them', async () => {
	const cwd = '/workspace/site'
	const defaults = await resolveBuildOptions(cwd, [])
	assert.deepEqual(defaults, {
		analyticsEnabled: true,
		configFile: path.join(cwd, 'config.yaml'),
		contentDirs: [path.join(cwd, 'content')],
		cwd,
		outputDir: path.join(cwd, 'dist'),
		outputMode: 'public',
		pageKeys: undefined,
		resumePreset: false,
	})

	const explicit = await resolveBuildOptions(cwd, [
		'--configFile',
		'configs/application.yaml',
		'--contentDir',
		'variants/content-sensitive',
		'--contentDir',
		'variants/umbc-adjunct',
		'--outputDir',
		'dist/application',
		'--page',
		'resume',
		'--no-analytics',
	])
	assert.deepEqual(explicit, {
		analyticsEnabled: false,
		configFile: path.join(cwd, 'configs/application.yaml'),
		contentDirs: [
			path.join(cwd, 'variants/content-sensitive'),
			path.join(cwd, 'variants/umbc-adjunct'),
		],
		cwd,
		outputDir: path.join(cwd, 'dist/application'),
		outputMode: 'public',
		pageKeys: ['resume'],
		resumePreset: false,
	})
})

test('resume preset infers baseline, output, and variant layers without duplicating explicit paths', async t => {
	const cwd = await fs.mkdtemp(path.join(temporaryRoot, 'resume-options-'))
	t.after(() => fs.rm(cwd, { recursive: true, force: true }))
	await fs.mkdir(path.join(cwd, 'variants', 'umbc-adjunct'), { recursive: true })

	const options = await resolveBuildOptions(cwd, [
		'--resume',
		'umbc-adjunct',
		'--contentDir',
		'variants/content-sensitive',
		'--contentDir',
		'variants/umbc-adjunct',
	])
	assert.deepEqual(options.contentDirs, [
		path.join(cwd, 'content'),
		path.join(cwd, 'variants/content-sensitive'),
		path.join(cwd, 'variants/umbc-adjunct'),
	])
	assert.equal(options.outputDir, path.join(cwd, 'variants/output/umbc-adjunct'))
	assert.equal(options.outputMode, 'resume')
	assert.deepEqual(options.pageKeys, ['resume'])
	assert.equal(options.analyticsEnabled, false)

	const explicitBaseline = await resolveBuildOptions(cwd, [
		'--resume',
		'umbc-adjunct',
		'--contentDir',
		'content',
		'--contentDir',
		'variants/content-sensitive',
	])
	assert.deepEqual(explicitBaseline.contentDirs, [
		path.join(cwd, 'content'),
		path.join(cwd, 'variants/content-sensitive'),
		path.join(cwd, 'variants/umbc-adjunct'),
	])

	const overridden = await resolveBuildOptions(cwd, [
		'--resume',
		'umbc-adjunct',
		'--analytics',
		'--outputDir',
		'variants/output/application',
		'--page',
		'privacy',
	])
	assert.equal(overridden.analyticsEnabled, true)
	assert.equal(overridden.outputDir, path.join(cwd, 'variants/output/application'))
	assert.equal(overridden.outputMode, 'resume')
	assert.deepEqual(overridden.pageKeys, ['privacy'])
})

test('resume variants accept only lowercase slug names and require their content directory', async t => {
	assert.equal(validateVariantName('umbc-adjunct'), 'umbc-adjunct')
	assert.throws(() => validateVariantName('../outside'), /lowercase slug/)
	assert.throws(() => validateVariantName('UMBC'), /lowercase slug/)

	const cwd = await fs.mkdtemp(path.join(temporaryRoot, 'resume-options-'))
	t.after(() => fs.rm(cwd, { recursive: true, force: true }))
	await assert.rejects(resolveBuildOptions(cwd, ['--resume', 'umbc-adjunct']), /does not exist/)
})

test('build presets reject each other’s output roots while accepting their own overrides', async t => {
	const cwd = await fs.mkdtemp(path.join(temporaryRoot, 'build-output-options-'))
	t.after(() => fs.rm(cwd, { recursive: true, force: true }))
	await fs.mkdir(path.join(cwd, 'variants', 'umbc-adjunct'), { recursive: true })

	await assert.rejects(
		resolveBuildOptions(cwd, ['--outputDir', 'variants/output/public']),
		/Build output must be dist/,
	)
	await assert.rejects(
		resolveBuildOptions(cwd, ['--resume', 'umbc-adjunct', '--outputDir', 'dist/private']),
		/Build output must be a descendant of variants\/output/,
	)
	await assert.rejects(
		resolveBuildOptions(cwd, ['--resume', 'umbc-adjunct', '--outputDir', 'variants/output']),
		/Build output must be a descendant of variants\/output/,
	)

	assert.equal(
		(await resolveBuildOptions(cwd, ['--outputDir', 'dist/public'])).outputDir,
		path.join(cwd, 'dist/public'),
	)
	assert.equal(
		(
			await resolveBuildOptions(cwd, [
				'--resume',
				'umbc-adjunct',
				'--outputDir',
				'variants/output/private',
			])
		).outputDir,
		path.join(cwd, 'variants/output/private'),
	)
})

test('shared cleanup rejects symlinked, external, source, and content output paths', async t => {
	const cwd = await fs.mkdtemp(path.join(temporaryRoot, 'site-clean-'))
	const externalOutput = await fs.mkdtemp(path.join(temporaryRoot, 'site-clean-external-'))
	t.after(async () => {
		await Promise.all([
			fs.rm(cwd, { recursive: true, force: true }),
			fs.rm(externalOutput, { recursive: true, force: true }),
		])
	})

	const outputDir = path.join(cwd, 'variants', 'output', 'umbc-adjunct')
	const sentinelPath = path.join(externalOutput, 'keep.txt')
	await fs.writeFile(sentinelPath, 'do not delete')
	await fs.mkdir(path.join(cwd, 'variants'), { recursive: true })
	await fs.symlink(externalOutput, path.join(cwd, 'variants', 'output'), 'dir')

	const protectedPaths = [path.join(cwd, 'src'), path.join(cwd, 'content')]
	await assert.rejects(
		cleanOutput({ cwd, outputDir, outputMode: 'resume', protectedPaths }),
		/symbolic link/,
	)
	assert.equal(await fs.readFile(sentinelPath, 'utf8'), 'do not delete')
	await assert.rejects(
		cleanOutput({ cwd, outputDir: externalOutput, protectedPaths }),
		/inside the project directory/,
	)
	await assert.rejects(
		cleanOutput({ cwd, outputDir: path.join(cwd, 'src'), protectedPaths }),
		/overlaps protected path/,
	)
	await assert.rejects(
		cleanOutput({ cwd, outputDir: path.join(cwd, 'content', 'generated'), protectedPaths }),
		/overlaps protected path/,
	)
	await assert.rejects(
		cleanOutput({ cwd, outputDir: path.join(cwd, '.git'), protectedPaths: [] }),
		/Build output must be dist/,
	)
	await assert.rejects(
		cleanOutput({ cwd, outputDir: path.join(cwd, 'content'), protectedPaths: [] }),
		/Build output must be dist/,
	)
	await assert.rejects(
		cleanOutput({ cwd, outputDir: path.join(cwd, 'variants', 'output'), protectedPaths }),
		/Build output must be dist/,
	)
})

test('shared cleanup removes an ordinary project-contained output directory', async t => {
	const cwd = await fs.mkdtemp(path.join(temporaryRoot, 'site-clean-'))
	t.after(() => fs.rm(cwd, { recursive: true, force: true }))
	const outputDir = path.join(cwd, 'dist', 'build-output')
	await fs.mkdir(outputDir, { recursive: true })
	await fs.writeFile(path.join(outputDir, 'stale.txt'), 'stale')

	await cleanOutput({
		cwd,
		outputDir,
		protectedPaths: [path.join(cwd, 'src'), path.join(cwd, 'content')],
	})
	await assert.rejects(fs.access(outputDir), /ENOENT/)
})
