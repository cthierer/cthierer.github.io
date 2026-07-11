import { useContent } from './ContentContext'
import ExperienceEntry from './ExperienceEntry'
import OrganizationEntry from './OrganizationEntry'

const useRecentOrganizations = ({
	limit = 2,
	notBefore,
}: {
	limit?: number
	notBefore?: Date
} = {}): OrganizationEntry[] => {
	const content = useContent()
	const experiences = content
		.filter(entry => entry.category === 'experience')
		.map(
			entry =>
				new ExperienceEntry(entry.category, entry.data, entry.html, entry.markdown, entry.name),
		)
		.filter(experience => !notBefore || experience.startDate >= notBefore)
		.sort(
			(experienceA, experienceB) =>
				experienceB.startDate.valueOf() - experienceA.startDate.valueOf(),
		)

	const findOrgs = Array.from(
		new Set(experiences.map(experience => experience.organization)),
	).slice(0, limit)

	return content
		.filter(
			entry => entry.category === 'organizations' && findOrgs.includes(entry.data.slug as string),
		)
		.map(
			entry =>
				new OrganizationEntry(
					entry.category,
					entry.data,
					entry.html,
					entry.markdown,
					entry.name,
					experiences.filter(experience => experience.organization === (entry.data.slug as string)),
				),
		)
		.sort(
			(organizationA, organizationB) =>
				(organizationB.startDate?.valueOf() ?? 0) - (organizationA.startDate?.valueOf() ?? 0),
		)
}

export default useRecentOrganizations
