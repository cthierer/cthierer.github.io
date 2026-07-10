import Entry from './Entry'

class ExperienceEntry implements Entry {
	constructor(
		readonly category: string,
		readonly data: Record<string, unknown>,
		readonly html: string,
		readonly name: string,
	) {}

	get organization(): string {
		return this.data.organization as string
	}

	get startDate(): Date {
		return new Date(this.data.startDate as string)
	}

	get endDate(): Date | undefined {
		const { endDate } = this.data
		if (!endDate) {
			return undefined
		}

		return new Date(endDate as string)
	}

	get location(): string {
		return this.data.location as string
	}

	get role(): string {
		return this.data.role as string
	}

	get label(): string {
		return this.data.title as string
	}

	get jobTitle(): string {
		return this.data.jobTitle as string
	}

	get resumeInclude(): boolean {
		const { resumeInclude, type } = this.data
		if (typeof resumeInclude === 'boolean') {
			return resumeInclude
		}

		return type === 'fte'
	}
}

export default ExperienceEntry
