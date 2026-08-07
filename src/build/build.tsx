import path from 'node:path'
import { type ReactElement } from 'react'
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
import buildCSS from './buildCSS'
import copyPublic from './copyPublic'
import writePDF from './writePDF'

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

const getElementForKey = (key: string): ReactElement => {
	switch (key) {
		case 'home':
			return <Home />
		case 'resume':
			return <Resume />
		case 'privacy':
			return <Privacy />
	}

	throw new Error(`unknown page key: "${key}"`)
}

const main = async (cwd: string, argv: string[]) => {
	const { configFile, contentDirs, outputDir } = getArgs(cwd, argv)
	const loadingContentSets = contentDirs.map(contentDir => loadMarkdown(contentDir))
	const contentSets = await Promise.all(
		loadingContentSets.map(loadingContent => Array.fromAsync(loadingContent)),
	)
	const content = resolveContent(contentSets)
	const config = await loadYaml(configFile, configSchema)

	const publicDir = path.join(cwd, './public')
	await copyPublic(publicDir, outputDir)

	const sourceDir = path.join(cwd, './src')
	await buildCSS(sourceDir, outputDir)

	const routes: readonly Route[] = config.pages.map(
		({ key, title, path, canonicalPath = path, description, pdf }) => ({
			outputPath: path,
			canonicalPath,
			title,
			description,
			formats: ['html' as const, ...(pdf ? ['pdf' as const] : [])],
			element: getElementForKey(key),
			structuredData:
				key === 'home'
					? context => createProfileJsonLd({ title, description, config, content, ...context })
					: undefined,
		}),
	)

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

		if (route.formats.includes('pdf')) {
			await writePDF(cwd, outputDir, route.outputPath)
		}
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
