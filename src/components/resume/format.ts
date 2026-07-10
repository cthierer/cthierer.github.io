import EducationEntry from '../../content/EducationEntry'

const dateFormatter = new Intl.DateTimeFormat('en-US', {
	month: 'short',
	year: 'numeric',
	timeZone: 'UTC',
})

const yearFormatter = new Intl.DateTimeFormat('en-US', {
	year: 'numeric',
	timeZone: 'UTC',
})

export const formatDateRange = (startDate: Date, endDate?: Date): string =>
	`${dateFormatter.format(startDate)} - ${endDate ? dateFormatter.format(endDate) : 'Present'}`

export const formatEducationLabel = (entry: EducationEntry): string =>
	entry.degree ? `${entry.degree}, ${entry.program}` : entry.program

export const formatEducationYear = (entry: EducationEntry): string | null =>
	entry.endDate ? yearFormatter.format(entry.endDate) : null

export const formatResumeLinkLabel = (href: string, label: string): string => {
	if (href.startsWith('mailto:')) {
		return href.slice('mailto:'.length)
	}

	if (href.startsWith('https://www.')) {
		return href.slice('https://www.'.length).replace(/\/$/, '')
	}

	if (href.startsWith('https://')) {
		return href.slice('https://'.length).replace(/\/$/, '')
	}

	return label
}
