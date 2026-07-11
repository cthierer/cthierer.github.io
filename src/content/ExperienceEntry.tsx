import Entry from './Entry'

interface ResumeContent {
	readonly summary?: unknown
	readonly highlights?: unknown
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === 'object' && value !== null

const isString = (value: unknown): value is string => typeof value === 'string'

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

	get focusAreas(): string[] {
		const { focusAreas } = this.data
		if (!Array.isArray(focusAreas)) {
			return []
		}

		return focusAreas.filter(isString)
	}

	get resumeInclude(): boolean {
		const { resumeInclude, type } = this.data
		if (typeof resumeInclude === 'boolean') {
			return resumeInclude
		}

		return type === 'fte'
	}

	get resumeSummary(): string | undefined {
		const resume = this.data.resume as ResumeContent | undefined
		if (!isRecord(resume) || !isString(resume.summary)) {
			return undefined
		}

		return resume.summary
	}

	get resumeHighlights(): string[] {
		const resume = this.data.resume as ResumeContent | undefined
		if (!isRecord(resume) || !Array.isArray(resume.highlights)) {
			return []
		}

		return resume.highlights.filter(isString)
	}
}

export default ExperienceEntry
