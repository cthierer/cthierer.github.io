import { buildSite } from './buildSite'
import { resolveBuildOptions } from './buildOptions'

export const main = async (cwd = process.cwd(), argv = process.argv.slice(2)): Promise<void> =>
	buildSite(await resolveBuildOptions(cwd, argv))

try {
	await main()
} catch (err) {
	console.error(err)
	process.exit(1)
}
