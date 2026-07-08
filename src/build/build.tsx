import fs from 'node:fs/promises'
import path from 'node:path'
import { renderToStaticMarkup } from 'react-dom/server'
import Page from '../layouts/Page'
import Home from '../pages/Home'

const writePage = async (filePath: string, element: React.ReactElement) => {
	const html = `<!doctype html>${renderToStaticMarkup(element)}`
	await fs.mkdir(path.dirname(filePath), { recursive: true })
	await fs.writeFile(filePath, html, 'utf8')
}

const main = async () => {
	await writePage(
		'dist/index.html',
		<Page title="Home page">
			<Home />
		</Page>,
	)
}

try {
	await main()
} catch (err) {
	console.error(err)
	process.exit(1)
}
