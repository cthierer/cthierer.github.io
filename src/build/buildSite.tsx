import path from 'node:path'
import { type ReactElement } from 'react'
import ContentProvider from '../content/ContentProvider'
import type Entry from '../content/Entry'
import type Config from '../config/Config'
import ConfigProvider from '../config/ConfigProvider'
import Page from '../layouts/Page'
import createProfileJsonLd from '../metadata/profileJsonLd'
import Home from '../pages/Home'
import Privacy from '../pages/Privacy'
import Resume from '../pages/Resume'
import CoverLetter from '../pages/CoverLetter'
import type Route from './Route'
import buildCSS from './buildCSS'
import { cleanOutput } from './cleanOutput'
import { resolveMarkdownLayers } from './contentLayers'
import copyPublic from './copyPublic'
import loadMarkdown from './loadMarkdown'
import loadYaml from './loadYaml'
import writePage from './writePage'
import writePDF from './writePDF'
import writeSitemap from './writeSitemap'
import { schema as configSchema } from '../config/Config'
import {
	createCoverLetterDocument,
	createResumeDocument,
	serializeCoverLetterText,
	serializeResumeText,
	serializeCoverLetterMarkdown,
	serializeResumeMarkdown,
} from '../content/documents'
import { writeTextDocument } from './writeTextDocument'

export interface BuildSiteOptions {
	/** Enables third-party analytics in rendered HTML. Defaults to the public-site behavior. */
	readonly analyticsEnabled?: boolean
	readonly configFile: string
	readonly contentDirs: readonly string[]
	readonly cwd: string
	readonly outputDir: string
	/** Selects the cleanup boundary for a public or private-document build. */
	readonly outputMode?: 'public' | 'resume' | 'application'
	readonly pageKeys?: readonly string[]
	readonly privateDocument?: boolean
	readonly coverLetterEnabled?: boolean
	readonly coverLetterRequired?: boolean
}

const getElementForKey = (key: string): ReactElement => {
	switch (key) {
		case 'home':
			return <Home />
		case 'resume':
			return <Resume />
		case 'privacy':
			return <Privacy />
		case 'cover-letter':
			return <CoverLetter />
	}

	throw new Error(`unknown page key: "${key}"`)
}

const selectPages = (
	config: Config,
	pageKeys?: readonly string[],
	allowCoverLetter = false,
): Config => {
	if (!pageKeys) {
		return config
	}

	const selectedPageKeys = new Set<string>(pageKeys)
	const pages = config.pages.filter(page => selectedPageKeys.has(page.key))
	const specialPages = allowCoverLetter ? pageKeys.filter(key => key === 'cover-letter') : []
	if (pages.length + specialPages.length !== pageKeys.length) {
		const available = new Set<string>(pages.map(page => page.key))
		const missing = pageKeys.filter(
			key => !available.has(key) && !(allowCoverLetter && key === 'cover-letter'),
		)
		throw new Error(`Missing configured page keys: ${missing.join(', ')}`)
	}

	return { ...config, pages }
}

const applicationResumeFormats: Config['pages'][number]['formats'] = ['html', 'pdf', 'md', 'txt']

const forceApplicationResumeFormats = (config: Config): Config => ({
	...config,
	pages: config.pages.map(page =>
		page.key === 'resume' ? { ...page, formats: [...applicationResumeFormats] } : page,
	),
})

const createRoutes = (config: Config, content: Entry[]): readonly Route[] =>
	config.pages.map(
		({ key, title, path: outputPath, canonicalPath = outputPath, description, formats }) => ({
			key,
			outputPath,
			canonicalPath,
			title,
			description,
			formats,
			element: getElementForKey(key),
			structuredData:
				key === 'home'
					? context => createProfileJsonLd({ title, description, config, content, ...context })
					: undefined,
		}),
	)

export const buildSite = async ({
	analyticsEnabled = true,
	configFile,
	contentDirs,
	cwd,
	outputDir,
	outputMode,
	pageKeys,
	privateDocument = false,
	coverLetterEnabled = false,
	coverLetterRequired = false,
}: BuildSiteOptions): Promise<void> => {
	await cleanOutput({
		cwd,
		outputDir,
		outputMode,
		protectedPaths: [configFile, path.join(cwd, 'src'), path.join(cwd, 'public'), ...contentDirs],
	})

	const contentLayers = await Promise.all(
		contentDirs.map(contentDir => loadMarkdown(contentDir, path.relative(cwd, contentDir) || '.')),
	)
	const content = await resolveMarkdownLayers(contentLayers)
	const selectedConfig = selectPages(
		await loadYaml(configFile, configSchema),
		pageKeys,
		coverLetterEnabled,
	)
	const config =
		outputMode === 'application' ? forceApplicationResumeFormats(selectedConfig) : selectedConfig

	await copyPublic(path.join(cwd, 'public'), outputDir)
	await buildCSS(path.join(cwd, 'src'), outputDir)

	const routes = [...createRoutes(config, content)]
	if (coverLetterEnabled && pageKeys?.includes('cover-letter')) {
		const coverLetter = content.find(entry => entry.data.archetype === 'cover-letter')
		if (!coverLetter) {
			if (coverLetterRequired)
				throw new Error('A cover letter was requested but no published cover letter was found.')
		} else {
			routes.push({
				key: 'cover-letter',
				outputPath: '/cover-letter.html',
				canonicalPath: '/cover-letter.html',
				title: String(coverLetter.data.title),
				description: 'Cover letter',
				formats: ['html', 'pdf', 'md', 'txt'],
				element: getElementForKey('cover-letter'),
			})
		}
	}
	for (const route of routes) {
		const resumeDocument =
			route.key === 'resume' ? createResumeDocument(content, config) : undefined
		const coverLetterDocument =
			route.key === 'cover-letter' ? createCoverLetterDocument(content, config) : undefined
		await writePage(
			outputDir,
			route.outputPath,
			<ConfigProvider config={config}>
				<ContentProvider content={content}>
					<Page
						analyticsEnabled={analyticsEnabled}
						title={route.title}
						description={route.description}
						path={route.canonicalPath}
						structuredData={route.structuredData}
						privateDocument={privateDocument}
					>
						{route.element}
					</Page>
				</ContentProvider>
			</ConfigProvider>,
		)

		if (route.formats.includes('pdf')) {
			await writePDF(cwd, outputDir, route.outputPath)
		}
		const markdown = resumeDocument
			? serializeResumeMarkdown(resumeDocument)
			: coverLetterDocument
				? serializeCoverLetterMarkdown(coverLetterDocument)
				: undefined
		if (markdown && route.formats.includes('md'))
			await writeTextDocument(outputDir, route.outputPath, 'md', markdown)
		if (markdown && route.formats.includes('txt'))
			await writeTextDocument(
				outputDir,
				route.outputPath,
				'txt',
				resumeDocument
					? serializeResumeText(resumeDocument)
					: serializeCoverLetterText(coverLetterDocument!),
			)
	}

	if (!privateDocument)
		await writeSitemap(
			outputDir,
			routes.map(route => new URL(route.canonicalPath, config.siteUrl).toString()),
		)
}
