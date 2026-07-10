import matter from 'gray-matter'
import fs from 'node:fs/promises'
import z from 'zod'

const formatPath = (path: PropertyKey[]): string => {
	if (path.length === 0) {
		return 'frontmatter'
	}

	return path.join('.')
}

const validate = <T>(fileName: string, data: unknown, schema: z.ZodType<T>): data is T => {
	const result = schema.safeParse(data)

	if (result.success) {
		return true
	}

	const issues = result.error.issues
		.map(issue => `- ${formatPath(issue.path)}: ${issue.message}`)
		.join('\n')

	throw new Error(`Invalid data in ${fileName}:\n${issues}`)
}

const loadYaml = async <T>(fileName: string, schema: z.ZodType<T>): Promise<T> => {
	const file = await fs.readFile(fileName, { encoding: 'utf8' })
	const { data } = matter(`---\n${file}\n---\n`)

	if (!validate(fileName, data, schema)) {
		throw new Error(`Invalid YAML in ${fileName}`)
	}

	return data
}

export default loadYaml
