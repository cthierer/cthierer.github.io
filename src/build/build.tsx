import Page from '../layouts/Page'
import Home from '../pages/Home'
import Resume from '../pages/Resume'
import loadMarkdown from './loadMarkdown'
import ContentProvider from '../content/ContentProvider'
import ConfigProvider from '../config/ConfigProvider'
import loadYaml from './loadYaml'
import { getArgs } from './args'
import writePage from './writePage'
import writeSitemap from './writeSitemap'
import type Route from './Route'
import { schema as configSchema } from '../config/Config'
import createProfileJsonLd from '../metadata/profileJsonLd'
import Privacy from '../pages/Privacy'
import type Entry from '../content/Entry'

const resolveContent = (loadedContent: Entry[][]): Entry[] => {
	// later content will overwrite earlier content; otherwise, results are merged together
	const contentMap = new Map<string, Entry>()
	for (const contentSet of loadedContent) {
		for (const contentEntry of contentSet) {
			contentMap.set(contentEntry.name, contentEntry)
		}
	}

	return Array.from(contentMap.values())
}

const main = async (cwd: string, argv: string[]) => {
	const { configFile, contentDirs, outputDir } = getArgs(cwd, argv)
	const loadingContentSets = contentDirs.map(contentDir => loadMarkdown(contentDir))
	const contentSets = await Promise.all(
		loadingContentSets.map(loadingContent => Array.fromAsync(loadingContent)),
	)
	const content = resolveContent(contentSets)
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
			outputDir,
			route.outputPath,
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

	await writeSitemap(
		outputDir,
		routes.map(route => new URL(route.canonicalPath, config.siteUrl).toString()),
	)
}

try {
	await main(process.cwd(), process.argv.slice(2))
} catch (err) {
	console.error(err)
	process.exit(1)
}
