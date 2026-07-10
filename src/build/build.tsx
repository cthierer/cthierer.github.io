import fs from 'node:fs/promises'
import path from 'node:path'
import { renderToStaticMarkup } from 'react-dom/server'
import Page from '../layouts/Page'
import Home from '../pages/Home'
import Resume from '../pages/Resume'
import loadMarkdown from './loadMarkdown'
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
			<Page title="Chris Thierer | Software Engineering Leader">
				<Home />
			</Page>
		</ContentProvider>,
	)

	await writePage(
		'dist/resume.html',
		<ContentProvider content={content}>
			<Page title="Resume | Chris Thierer">
				<Resume />
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
