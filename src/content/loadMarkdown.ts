import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import { marked } from 'marked'
import Entry from './Entry'

const loadMarkdown = async function* (cwd: string): AsyncIterable<Entry> {
	for await (const fileName of fs.glob('**/*.md', { cwd })) {
		const filePath = path.join(cwd, fileName)
		const file = await fs.readFile(filePath, { encoding: 'utf8' })
		const { data, content } = matter(file)
		if (!data.published) {
			continue
		}

		const html = await marked.parse(content)

		yield {
			data,
			html,
			name: fileName,
		}
	}
}

export default loadMarkdown
