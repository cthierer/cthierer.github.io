import fs from 'node:fs/promises'
import path from 'node:path'

const siblingPath = (htmlPath: string, extension: 'md' | 'txt'): string => {
	if (path.extname(htmlPath) !== '.html') {
		throw new Error(
			`cannot write ${extension} sibling for ${htmlPath}: source must be an HTML path`,
		)
	}
	return htmlPath.slice(0, -'.html'.length) + `.${extension}`
}

export const writeTextDocument = async (
	outputDir: string,
	htmlPath: string,
	extension: 'md' | 'txt',
	contents: string,
): Promise<void> => {
	const outputPath = path.join(outputDir, siblingPath(htmlPath, extension))
	await fs.mkdir(path.dirname(outputPath), { recursive: true })
	await fs.writeFile(
		outputPath,
		`${contents.replace(/\r\n?/g, '\n').replace(/\n*$/, '')}\n`,
		'utf8',
	)
}
