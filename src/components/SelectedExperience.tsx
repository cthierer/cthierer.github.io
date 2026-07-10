import useRecentOrganizations from '../content/experience'
import FeaturedList from './FeaturedList'
import ExperienceCard from './ExperienceCard'
import OrganizationCard from './OrganizationCard'

const SelectedExperience = () => {
	const content = useRecentOrganizations({
		notBefore: new Date('2011-01-01'),
	})
	if (content.length < 1) {
		return null
	}

	return (
		<FeaturedList variant="experience">
			{content.map(organization => (
				<OrganizationCard
					key={organization.slug}
					name={organization.label}
					logo={<img src={organization.logo} alt="" />}
				>
					{organization.roles.map(role => (
						<ExperienceCard
							key={role.name}
							role={role.label}
							startDate={role.startDate}
							endDate={role.endDate}
							location={role.location}
						>
							<div dangerouslySetInnerHTML={{ __html: role.html }} />
						</ExperienceCard>
					))}
				</OrganizationCard>
			))}
		</FeaturedList>
	)
}

export default SelectedExperience
