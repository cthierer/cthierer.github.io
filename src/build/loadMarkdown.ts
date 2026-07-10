import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import { marked } from 'marked'
import Entry from '../content/Entry'

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

		const html = await marked.parse(content)
		const [category] = path.dirname(fileName).split('/', 2)

		yield {
			category,
			data,
			html,
			name: fileName,
		}
	}
}

export default loadMarkdown
