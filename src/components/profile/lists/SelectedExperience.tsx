import useRecentOrganizations from '../../../content/experience'
import FeaturedList from './FeaturedList'
import ExperienceCard from '../cards/ExperienceCard'
import OrganizationCard from '../cards/OrganizationCard'

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
					logo={organization.logo ? <img src={organization.logo} alt="" /> : null}
				>
					{organization.roles.map(role => (
						<ExperienceCard
							key={role.name}
							role={role.label}
							startDate={role.startDate}
							endDate={role.endDate}
							location={role.location}
							focusAreas={role.focusAreas.slice(0, 8)}
						>
							<div dangerouslySetInnerHTML={{ __html: role.html }} />
							{role.resumeHighlights.length > 0 ? (
								<ul className="experience-highlights">
									{role.resumeHighlights.map(highlight => (
										<li key={highlight}>{highlight}</li>
									))}
								</ul>
							) : null}
						</ExperienceCard>
					))}
				</OrganizationCard>
			))}
		</FeaturedList>
	)
}

export default SelectedExperience
