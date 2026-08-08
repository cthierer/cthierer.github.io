import fs from 'node:fs/promises'
import path from 'node:path'
import { parseArgs } from 'node:util'
import type { BuildSiteOptions } from './buildSite'

const variantNamePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export const validateVariantName = (variantName: string | undefined): string => {
	if (!variantName || !variantNamePattern.test(variantName)) {
		throw new Error('Variant name must be a lowercase slug, such as "umbc-adjunct".')
	}

	return variantName
}

const resolveArgPath = (cwd: string, argPath: string): string => {
	const resolvedPath = path.resolve(cwd, argPath)
	if (resolvedPath === path.resolve(cwd)) {
		throw new Error('An option path cannot resolve to the project directory.')
	}
	return resolvedPath
}

const dedupePaths = (paths: readonly string[]): string[] => {
	const seen = new Set<string>()
	return paths.filter(candidate => {
		if (seen.has(candidate)) {
			return false
		}
		seen.add(candidate)
		return true
	})
}

const isWithin = (parent: string, candidate: string): boolean => {
	const relativePath = path.relative(parent, candidate)
	return (
		relativePath === '' ||
		(!relativePath.startsWith(`..${path.sep}`) &&
			relativePath !== '..' &&
			!path.isAbsolute(relativePath))
	)
}

const validateOutputDirForMode = (cwd: string, outputDir: string, resumePreset: boolean): void => {
	const allowedOutputRoot = resumePreset
		? path.join(cwd, 'variants', 'output')
		: path.join(cwd, 'dist')
	const validOutputDir = resumePreset
		? outputDir !== allowedOutputRoot && isWithin(allowedOutputRoot, outputDir)
		: isWithin(allowedOutputRoot, outputDir)
	if (!validOutputDir) {
		const allowedLocation = resumePreset ? 'a descendant of variants/output/' : 'dist/'
		throw new Error(`Build output must be ${allowedLocation}: ${outputDir}`)
	}
}

const directoryExists = async (directory: string): Promise<boolean> => {
	try {
		return (await fs.stat(directory)).isDirectory()
	} catch (error: unknown) {
		if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
			return false
		}
		throw error
	}
}

export interface ResolvedBuildOptions extends BuildSiteOptions {
	readonly resumePreset: boolean
}

/** Parses explicit CLI arguments and applies the public or resume-preset defaults. */
export const resolveBuildOptions = async (
	cwd: string,
	argv: readonly string[],
): Promise<ResolvedBuildOptions> => {
	const {
		values: { analytics, configFile, contentDir, outputDir, page, resume },
		positionals,
	} = parseArgs({
		args: argv,
		allowNegative: true,
		allowPositionals: true,
		options: {
			analytics: { type: 'boolean' },
			configFile: { type: 'string', short: 'c' },
			contentDir: { type: 'string', multiple: true },
			outputDir: { type: 'string', short: 'o' },
			page: { type: 'string', multiple: true },
			resume: { type: 'boolean' },
		},
	})

	const resumePreset = resume === true
	if (!resumePreset && positionals.length > 0) {
		throw new Error('npm run build does not accept positional arguments.')
	}
	if (resumePreset && positionals.length !== 1) {
		throw new Error('Usage: npm run build:resume -- <lowercase-slug> [options]')
	}

	const pageKeys = page ?? []
	const resolvedConfigFile = resolveArgPath(cwd, configFile ?? 'config.yaml')
	const explicitContentDirs = dedupePaths(
		(contentDir ?? []).map(directory => resolveArgPath(cwd, directory)),
	)
	const resolvedOutputDir = resolveArgPath(
		cwd,
		outputDir ??
			(resumePreset
				? path.join('variants', 'output', validateVariantName(positionals[0]))
				: 'dist'),
	)
	validateOutputDirForMode(cwd, resolvedOutputDir, resumePreset)

	if (!resumePreset) {
		return {
			analyticsEnabled: analytics ?? true,
			configFile: resolvedConfigFile,
			contentDirs:
				explicitContentDirs.length > 0 ? explicitContentDirs : [path.join(cwd, 'content')],
			cwd,
			outputDir: resolvedOutputDir,
			outputMode: 'public',
			pageKeys: pageKeys.length > 0 ? pageKeys : undefined,
			resumePreset: false,
		}
	}

	const variantName = validateVariantName(positionals[0])
	const baselineContentDir = path.join(cwd, 'content')
	const variantContentDir = path.join(cwd, 'variants', variantName)
	if (!(await directoryExists(variantContentDir))) {
		throw new Error(`Resume variant content directory does not exist: ${variantContentDir}`)
	}

	return {
		analyticsEnabled: analytics ?? false,
		configFile: resolvedConfigFile,
		contentDirs: dedupePaths([
			...(explicitContentDirs.includes(baselineContentDir) ? [] : [baselineContentDir]),
			...explicitContentDirs,
			...(explicitContentDirs.includes(variantContentDir) ? [] : [variantContentDir]),
		]),
		cwd,
		outputDir: resolvedOutputDir,
		outputMode: 'resume',
		pageKeys: pageKeys.length > 0 ? pageKeys : ['resume'],
		resumePreset: true,
	}
}
