interface Entry {
	readonly category: string
	readonly data: Record<string, unknown>
	readonly html: string
	readonly markdown: string
	readonly name: string
}

export default Entry
