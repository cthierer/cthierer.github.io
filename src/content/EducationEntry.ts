import Entry from './Entry'

class EducationEntry implements Entry {
	constructor(
		readonly category: string,
		readonly data: Record<string, unknown>,
		readonly html: string,
		readonly name: string,
	) {}

	get institution(): string {
		return this.data.institution as string
	}

	get startDate(): Date | undefined {
		const { startDate } = this.data
		if (!startDate) {
			return undefined
		}

		return new Date(startDate as string)
	}

	get endDate(): Date | undefined {
		const { endDate } = this.data
		if (!endDate) {
			return undefined
		}

		return new Date(endDate as string)
	}

	get program(): string {
		return this.data.program as string
	}

	get degree(): string | undefined {
		return this.data.degree as string | undefined
	}

	get label(): string {
		return this.data.title as string
	}
}

export default EducationEntry
