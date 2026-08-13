import fs from 'node:fs/promises'
import path from 'node:path'

const isWithin = (parent: string, candidate: string): boolean => {
	const relativePath = path.relative(parent, candidate)
	return (
		relativePath === '' ||
		(!relativePath.startsWith(`..${path.sep}`) &&
			relativePath !== '..' &&
			!path.isAbsolute(relativePath))
	)
}

const isStrictlyWithin = (parent: string, candidate: string): boolean =>
	parent !== candidate && isWithin(parent, candidate)

const lstatIfExists = async (
	target: string,
): Promise<Awaited<ReturnType<typeof fs.lstat>> | undefined> => {
	try {
		return await fs.lstat(target)
	} catch (error: unknown) {
		if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
			return undefined
		}
		throw error
	}
}

export interface CleanOutputOptions {
	readonly cwd: string
	readonly outputDir: string
	readonly outputMode?: 'public' | 'resume' | 'application'
	/** Files or directories which an output path must neither be nor contain. */
	readonly protectedPaths: readonly string[]
}

/**
 * Removes a build directory only after proving it is a real, designated build
 * directory that cannot overlap source, configuration, or selected content.
 */
export const cleanOutput = async ({
	cwd,
	outputDir,
	outputMode = 'public',
	protectedPaths,
}: CleanOutputOptions): Promise<void> => {
	const realCwd = await fs.realpath(cwd)
	const resolvedOutputDir = path.resolve(outputDir)

	if (!isStrictlyWithin(realCwd, resolvedOutputDir)) {
		throw new Error(`Build output must be inside the project directory: ${resolvedOutputDir}`)
	}
	for (const protectedPath of protectedPaths) {
		const resolvedProtectedPath = path.resolve(protectedPath)
		if (
			isWithin(resolvedProtectedPath, resolvedOutputDir) ||
			isWithin(resolvedOutputDir, resolvedProtectedPath)
		) {
			throw new Error(
				`Refusing to clean build output that overlaps protected path: ${resolvedProtectedPath}`,
			)
		}
	}

	const outputRoot =
		outputMode === 'resume' || outputMode === 'application'
			? path.join(realCwd, 'variants', 'output')
			: path.join(realCwd, 'dist')
	const validOutputDir =
		outputMode === 'resume' || outputMode === 'application'
			? isStrictlyWithin(outputRoot, resolvedOutputDir)
			: isWithin(outputRoot, resolvedOutputDir)
	if (!validOutputDir) {
		const allowedLocation =
			outputMode === 'resume' || outputMode === 'application'
				? 'a descendant of variants/output/'
				: 'dist/'
		throw new Error(`Build output must be ${allowedLocation}: ${resolvedOutputDir}`)
	}

	const relativeOutputPath = path.relative(realCwd, resolvedOutputDir)
	let currentPath = realCwd
	for (const component of relativeOutputPath.split(path.sep)) {
		currentPath = path.join(currentPath, component)
		const stats = await lstatIfExists(currentPath)
		if (stats?.isSymbolicLink()) {
			throw new Error(`Refusing to clean build output through symbolic link: ${currentPath}`)
		}
	}

	const outputStats = await lstatIfExists(resolvedOutputDir)
	if (!outputStats) {
		return
	}
	if (!outputStats.isDirectory()) {
		throw new Error(`Build output must be a directory: ${resolvedOutputDir}`)
	}

	await fs.rm(resolvedOutputDir, { recursive: true, force: true })
}
