import path from 'node:path'
import { marked } from 'marked'
import type Entry from '../content/Entry'
import { validateResumeSections } from '../content/validateResumeSections'
import { contentSchema } from '../content/schemas/content'

export interface MarkdownSource {
	readonly data: Record<string, unknown>
	readonly markdown: string
	readonly name: string
	readonly sourceDirectory: string
}

interface ResolvedMarkdownSource extends MarkdownSource {
	readonly sourceDirectories: readonly string[]
}

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
	if (typeof value !== 'object' || value === null || Array.isArray(value)) {
		return false
	}

	const prototype = Object.getPrototypeOf(value)
	return prototype === Object.prototype || prototype === null
}

const formatPath = (issuePath: PropertyKey[]): string =>
	issuePath.length === 0 ? 'frontmatter' : issuePath.join('.')

export const mergeFrontmatter = (
	base: Record<string, unknown>,
	patch: Record<string, unknown>,
): Record<string, unknown> => {
	const merged = { ...base }

	for (const [key, value] of Object.entries(patch)) {
		if (value === null) {
			delete merged[key]
			continue
		}

		const previous = merged[key]
		merged[key] =
			isPlainObject(previous) && isPlainObject(value) ? mergeFrontmatter(previous, value) : value
	}

	return merged
}

const validateContent = (
	name: string,
	sourceDirectories: readonly string[],
	data: Record<string, unknown>,
): void => {
	const result = contentSchema.safeParse(data)

	if (result.success) {
		return
	}

	const issues = result.error.issues
		.map(issue => `- ${formatPath(issue.path)}: ${issue.message}`)
		.join('\n')
	const sources = sourceDirectories.join(', ')

	throw new Error(`Invalid resolved frontmatter in ${name} (from ${sources}):\n${issues}`)
}

export const resolveMarkdownLayers = async (
	layers: readonly (readonly MarkdownSource[])[],
): Promise<Entry[]> => {
	const resolved = new Map<string, ResolvedMarkdownSource>()

	for (const layer of layers) {
		for (const source of layer) {
			if (source.data.published === false) {
				resolved.delete(source.name)
				continue
			}

			const existing = resolved.get(source.name)
			if (!existing) {
				resolved.set(source.name, {
					...source,
					sourceDirectories: [source.sourceDirectory],
				})
				continue
			}

			resolved.set(source.name, {
				...source,
				data: mergeFrontmatter(existing.data, source.data),
				markdown: source.markdown.trim() ? source.markdown : existing.markdown,
				sourceDirectories: [...existing.sourceDirectories, source.sourceDirectory],
			})
		}
	}

	const content: Entry[] = []
	for (const source of resolved.values()) {
		if (source.data.published !== true) {
			continue
		}

		validateContent(source.name, source.sourceDirectories, source.data)
		const [category] = path.dirname(source.name).split(path.sep, 2)
		content.push({
			category,
			data: source.data,
			html: await marked.parse(source.markdown),
			markdown: source.markdown,
			name: source.name,
		})
	}

	validateResumeSections(content)
	return content
}
