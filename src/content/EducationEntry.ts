import Entry from './Entry'
import OrganizationEntry from './OrganizationEntry'

class EducationEntry implements Entry {
	constructor(
		readonly category: string,
		readonly data: Record<string, unknown>,
		readonly html: string,
		readonly name: string,
		private readonly organizationEntry?: OrganizationEntry,
	) {}

	get organization(): string {
		return this.data.organization as string
	}

	get institution(): string {
		return this.organizationEntry?.title ?? this.organization
	}

	get institutionLabel(): string {
		return this.organizationEntry?.label ?? this.institution
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

	get honors(): string[] {
		const { honors } = this.data
		if (!Array.isArray(honors)) {
			return []
		}

		return honors.filter((honor): honor is string => typeof honor === 'string')
	}

	get resumeInclude(): boolean {
		const { resumeInclude } = this.data
		if (typeof resumeInclude === 'boolean') {
			return resumeInclude
		}

		return true
	}
}

export default EducationEntry
