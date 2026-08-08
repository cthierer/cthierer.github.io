import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import type { MarkdownSource } from './contentLayers'

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === 'object' && value !== null && !Array.isArray(value)

const loadMarkdown = async (
	contentDir: string,
	sourceDirectory = contentDir,
): Promise<MarkdownSource[]> => {
	const fileNames: string[] = []
	for await (const fileName of fs.glob('**/*.md', { cwd: contentDir })) {
		fileNames.push(fileName)
	}
	fileNames.sort((fileNameA, fileNameB) => fileNameA.localeCompare(fileNameB))

	return Promise.all(
		fileNames.map(async name => {
			const filePath = path.join(contentDir, name)
			const file = await fs.readFile(filePath, 'utf8')
			const { data, content } = matter(file)
			if (!isRecord(data)) {
				throw new Error(
					`Invalid frontmatter in ${name} (from ${sourceDirectory}): expected an object.`,
				)
			}

			return { data, markdown: content, name, sourceDirectory }
		}),
	)
}

export default loadMarkdown
