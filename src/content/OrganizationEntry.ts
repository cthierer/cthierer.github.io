import Entry from './Entry'
import ExperienceEntry from './ExperienceEntry'

class OrganizationEntry implements Entry {
	constructor(
		readonly category: string,
		readonly data: Record<string, unknown>,
		readonly html: string,
		readonly name: string,
		readonly roles: ExperienceEntry[] = [],
	) {}

	get slug(): string {
		return this.data.slug as string
	}

	get label(): string {
		return this.data.label as string
	}

	get location(): string {
		return this.data.location as string
	}

	get logo(): string {
		return this.data.logo as string
	}

	get startDate(): Date | undefined {
		const { roles } = this
		if (roles.length < 1) {
			return
		}

		return roles[0].startDate
	}
}

export default OrganizationEntry
