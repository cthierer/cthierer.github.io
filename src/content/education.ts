import { useContent } from './ContentContext'
import EducationEntry from './EducationEntry'
import OrganizationEntry from './OrganizationEntry'

const getComparableDate = (entry: EducationEntry): number =>
	(entry.endDate ?? entry.startDate ?? new Date(0)).valueOf()

const useRecentEducation = (limit: number = 4): EducationEntry[] => {
	const content = useContent()
	const organizations = new Map(
		content
			.filter(entry => entry.category === 'organizations')
			.map(entry => [
				entry.data.slug as string,
				new OrganizationEntry(entry.category, entry.data, entry.html, entry.markdown, entry.name),
			]),
	)

	return content
		.filter(entry => entry.category === 'education')
		.map(
			entry =>
				new EducationEntry(
					entry.category,
					entry.data,
					entry.html,
					entry.markdown,
					entry.name,
					organizations.get(entry.data.organization as string),
				),
		)
		.sort((entryA, entryB) => getComparableDate(entryB) - getComparableDate(entryA))
		.slice(0, limit)
}

export default useRecentEducation
