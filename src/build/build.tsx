import fs from 'node:fs/promises'
import path from 'node:path'
import { renderToStaticMarkup } from 'react-dom/server'
import Page from '../layouts/Page'
import Home from '../pages/Home'
import Resume from '../pages/Resume'
import loadMarkdown from './loadMarkdown'
import ContentProvider from '../content/ContentProvider'
import ConfigProvider from '../config/ConfigProvider'
import loadYaml from './loadYaml'
import { schema as configSchema } from '../config/Config'

const contentDir = path.join(process.cwd(), './content')
const configFile = path.join(process.cwd(), './config.yaml')

const getOutputPath = (pagePath: string): string => path.join('dist', pagePath)

const writePage = async (filePath: string, element: React.ReactElement) => {
	const html = `<!doctype html>${renderToStaticMarkup(element)}`
	await fs.mkdir(path.dirname(filePath), { recursive: true })
	await fs.writeFile(filePath, html, 'utf8')
}

const main = async () => {
	const loaded = loadMarkdown(contentDir)
	const content = await Array.fromAsync(loaded)
	const config = await loadYaml(configFile, configSchema)

	await writePage(
		getOutputPath(config.homePage.path),
		<ConfigProvider config={config}>
			<ContentProvider content={content}>
				<Page title={config.homePage.title} description={config.homePage.description} path="/">
					<Home />
				</Page>
			</ContentProvider>
		</ConfigProvider>,
	)

	await writePage(
		getOutputPath(config.resumePage.path),
		<ConfigProvider config={config}>
			<ContentProvider content={content}>
				<Page
					title={config.resumePage.title}
					description={config.resumePage.description}
					path={config.resumePage.path}
				>
					<Resume />
				</Page>
			</ContentProvider>
		</ConfigProvider>,
	)
}

try {
	await main()
} catch (err) {
	console.error(err)
	process.exit(1)
}
