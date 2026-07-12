import fs from 'node:fs/promises'
import path from 'node:path'
import { renderToStaticMarkup } from 'react-dom/server'
import Page, { StructuredDataContext } from '../layouts/Page'
import Home from '../pages/Home'
import Resume from '../pages/Resume'
import loadMarkdown from './loadMarkdown'
import ContentProvider from '../content/ContentProvider'
import ConfigProvider from '../config/ConfigProvider'
import loadYaml from './loadYaml'
import { schema as configSchema } from '../config/Config'
import { JsonLdValue } from '../metadata/JsonLd'
import createProfileJsonLd from '../metadata/profileJsonLd'
import Privacy from '../pages/Privacy'

const contentDir = path.join(process.cwd(), './content')
const configFile = path.join(process.cwd(), './config.yaml')

const getOutputPath = (pagePath: string): string => path.join('dist', pagePath)

interface Route {
	readonly outputPath: string
	readonly canonicalPath: string
	readonly title: string
	readonly description: string
	readonly element: React.ReactElement
	readonly structuredData?: (context: StructuredDataContext) => JsonLdValue
}

const writePage = async (filePath: string, element: React.ReactElement) => {
	const html = `<!doctype html>${renderToStaticMarkup(element)}`
	await fs.mkdir(path.dirname(filePath), { recursive: true })
	await fs.writeFile(filePath, html, 'utf8')
}

const escapeXml = (value: string): string =>
	value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&apos;')

const createSitemap = (urls: readonly string[]): string => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `\t<url><loc>${escapeXml(url)}</loc></url>`).join('\n')}
</urlset>
`

const writeSitemap = async (urls: readonly string[]) => {
	await fs.mkdir('dist', { recursive: true })
	await fs.writeFile(path.join('dist', 'sitemap.xml'), createSitemap(urls), 'utf8')
}

const main = async () => {
	const loaded = loadMarkdown(contentDir)
	const content = await Array.fromAsync(loaded)
	const config = await loadYaml(configFile, configSchema)

	const routes: readonly Route[] = [
		{
			outputPath: config.homePage.path,
			canonicalPath: '/',
			title: config.homePage.title,
			description: config.homePage.description,
			element: <Home />,
			structuredData: context => createProfileJsonLd({ config, content, ...context }),
		},
		{
			outputPath: config.resumePage.path,
			canonicalPath: config.resumePage.path,
			title: config.resumePage.title,
			description: config.resumePage.description,
			element: <Resume />,
		},
		{
			outputPath: config.privacyPage.path,
			canonicalPath: config.privacyPage.path,
			title: config.privacyPage.title,
			description: config.privacyPage.description,
			element: <Privacy />,
		},
	]

	for (const route of routes) {
		await writePage(
			getOutputPath(route.outputPath),
			<ConfigProvider config={config}>
				<ContentProvider content={content}>
					<Page
						title={route.title}
						description={route.description}
						path={route.canonicalPath}
						structuredData={route.structuredData}
					>
						{route.element}
					</Page>
				</ContentProvider>
			</ConfigProvider>,
		)
	}

	await writeSitemap(routes.map(route => new URL(route.canonicalPath, config.siteUrl).toString()))
}

try {
	await main()
} catch (err) {
	console.error(err)
	process.exit(1)
}
