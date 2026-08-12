import { buildSite } from './buildSite'
import { resolveBuildOptions } from './buildOptions'

export const main = async (cwd = process.cwd(), argv = process.argv.slice(2)): Promise<void> => {
	const options = await resolveBuildOptions(cwd, argv)
	return buildSite({
		...options,
		coverLetterEnabled: options.applicationPreset === true,
		privateDocument: options.applicationPreset === true,
	})
}

try {
	await main()
} catch (err) {
	console.error(err)
	process.exit(1)
}
