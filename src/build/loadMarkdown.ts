import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import { marked } from 'marked'
import Entry from '../content/Entry'
import { contentSchema } from '../content/schemas/content'

const formatPath = (path: PropertyKey[]): string => {
	if (path.length === 0) {
		return 'frontmatter'
	}

	return path.join('.')
}

const validateContent = (fileName: string, data: unknown): void => {
	const result = contentSchema.safeParse(data)

	if (result.success) {
		return
	}

	const issues = result.error.issues
		.map(issue => `- ${formatPath(issue.path)}: ${issue.message}`)
		.join('\n')

	throw new Error(`Invalid frontmatter in ${fileName}:\n${issues}`)
}

const loadMarkdown = async function* (cwd: string): AsyncIterable<Entry> {
	const fileNames = []
	for await (const fileName of fs.glob('**/*.md', { cwd })) {
		fileNames.push(fileName)
	}

	fileNames.sort((fileNameA, fileNameB) => fileNameA.localeCompare(fileNameB))

	for (const fileName of fileNames) {
		const filePath = path.join(cwd, fileName)
		const file = await fs.readFile(filePath, { encoding: 'utf8' })
		const { data, content } = matter(file)
		if (!data.published) {
			continue
		}

		validateContent(fileName, data)

		const html = await marked.parse(content)
		const [category] = path.dirname(fileName).split('/', 2)

		yield {
			category,
			data,
			html,
			markdown: content,
			name: fileName,
		}
	}
}

export default loadMarkdown
