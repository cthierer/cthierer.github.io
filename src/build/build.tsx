import fs from 'node:fs/promises'
import path from 'node:path'
import { renderToStaticMarkup } from 'react-dom/server'
import Page from '../layouts/Page'
import Home from '../pages/Home'
import Resume from '../pages/Resume'
import loadMarkdown from './loadMarkdown'
import ContentProvider from '../content/ContentProvider'

const contentDir = path.join(process.cwd(), './content')

const homeDescription =
	'Chris Thierer is a Baltimore/DC software engineering leader focused on web services, internal platforms, live services, and healthy engineering teams.'

const resumeDescription =
	'Resume for Chris Thierer, a Baltimore/DC software engineering leader with experience across public-sector technology, web platforms, and video game live services.'

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
			<Page
				title="Chris Thierer | Software Engineering Leader"
				description={homeDescription}
				path="/"
			>
				<Home />
			</Page>
		</ContentProvider>,
	)

	await writePage(
		'dist/resume.html',
		<ContentProvider content={content}>
			<Page title="Resume | Chris Thierer" description={resumeDescription} path="/resume.html">
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
