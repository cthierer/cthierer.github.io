import path from 'node:path'
import fs from 'node:fs/promises'
import { renderToStaticMarkup } from 'react-dom/server'

const writePage = async (outputDir: string, fileName: string, element: React.ReactElement) => {
	const filePath = path.join(outputDir, fileName)
	const html = `<!doctype html>${renderToStaticMarkup(element)}`
	await fs.mkdir(path.dirname(filePath), { recursive: true })
	await fs.writeFile(filePath, html, 'utf8')
}

export default writePage
