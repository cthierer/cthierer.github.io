import { useContent } from './ContentContext'

export interface CoverLetter {
	readonly title: string
	readonly date: Date | string
	readonly recipient: {
		readonly organization: string
		readonly name?: string
		readonly title?: string
		readonly address?: readonly string[]
	}
	readonly sender?: {
		readonly name?: string
	}
	readonly greeting: string
	readonly subject?: string
	readonly closing: string
	readonly html: string
}

export const getCoverLetter = (content: ReturnType<typeof useContent>): CoverLetter | undefined => {
	const letters = content.filter(entry => entry.data.archetype === 'cover-letter')
	if (letters.length > 1) {
		throw new Error(
			`Only one published cover letter is allowed; found: ${letters.map(letter => letter.name).join(', ')}`,
		)
	}
	const entry = letters[0]
	if (!entry) return undefined
	if (!entry.markdown.trim()) {
		throw new Error(`Published cover letter must have a Markdown body: ${entry.name}`)
	}
	const data = entry.data as CoverLetter & Record<string, unknown>
	return { ...data, closing: data.closing ?? 'Sincerely,', html: entry.html }
}

export const useCoverLetter = (): CoverLetter | undefined => getCoverLetter(useContent())
