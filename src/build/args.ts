import path from 'node:path'
import { parseArgs } from 'node:util'

interface Args {
	configFile: string
	contentDirs: string[]
	outputDir: string
}

const resolveArgPath = (cwd: string, argPath: string) => {
	const resolvedPath = path.resolve(cwd, argPath)

	if (cwd === resolvedPath) {
		throw new Error('invalid argPath: cannot resolve to current working directory')
	}

	return resolvedPath
}

export const getArgs = (cwd: string, argv: string[]): Args => {
	const {
		values: { configFile: configFileParam, contentDir: contentDirParam, outputDir: outputDirParam },
	} = parseArgs({
		args: argv,
		options: {
			configFile: {
				type: 'string' as const,
				short: 'c',
				default: './config.yaml',
			},
			contentDir: {
				type: 'string' as const,
				multiple: true,
				default: ['./content'],
			},
			outputDir: {
				type: 'string' as const,
				short: 'o',
				default: './dist',
			},
		},
		allowPositionals: false,
	})

	if (!configFileParam) {
		throw new Error('missing required argument: configFile')
	}
	const configFile = resolveArgPath(cwd, configFileParam)

	if (!Array.isArray(contentDirParam) || contentDirParam.filter(Boolean).length < 1) {
		throw new Error('missing required argument: contentDir')
	}
	const contentDirs = contentDirParam.map((contentDir: string) => resolveArgPath(cwd, contentDir))

	if (!outputDirParam) {
		throw new Error('missing required argument: outputDir')
	}
	const outputDir = resolveArgPath(cwd, outputDirParam)

	return { configFile, contentDirs, outputDir }
}
