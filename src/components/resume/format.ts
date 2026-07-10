import EducationEntry from '../../content/EducationEntry'

export const formatEducationLabel = (entry: EducationEntry): string =>
	entry.degree ? `${entry.degree}, ${entry.program}` : entry.program

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
