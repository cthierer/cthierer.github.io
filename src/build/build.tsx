import fs from 'node:fs/promises'
import path from 'node:path'
import { renderToStaticMarkup } from 'react-dom/server'
import Page from '../layouts/Page'
import Home from '../pages/Home'
import loadMarkdown from '../content/loadMarkdown'
import ContentProvider from '../content/ContentProvider'

const contentDir = path.join(process.cwd(), './content')

const writePage = async (filePath: string, element: React.ReactElement) => {
	const html = `<!doctype html>${renderToStaticMarkup(element)}`
	await fs.mkdir(path.dirname(filePath), { recursive: true })
	await fs.writeFile(filePath, html, 'utf8')
}

const main = async () => {
	const loaded = loadMarkdown(contentDir)
	const content = await Array.fromAsync(loaded)

	await writePage(
		'dist/index.html',
		<ContentProvider content={content}>
			<Page title="Home page">
				<Home />
			</Page>
		</ContentProvider>,
	)
}

try {
	await main()
} catch (err) {
	console.error(err)
	process.exit(1)
}
