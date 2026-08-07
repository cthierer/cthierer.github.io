import fs from 'node:fs/promises'
import path from 'node:path'
import browserslist from 'browserslist'
import { browserslistToTargets, bundleAsync } from 'lightningcss'

const buildCSS = async (sourceDir: string, outputDir: string) => {
	const outputPath = path.join(outputDir, './assets/main.css')
	const { code } = await bundleAsync({
		filename: path.join(sourceDir, './styles/main.css'),
		minify: true,
		targets: browserslistToTargets(browserslist('>= 0.25%')),
	})

	await fs.mkdir(path.dirname(outputPath), { recursive: true })
	await fs.writeFile(outputPath, code)
}

export default buildCSS
