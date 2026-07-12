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
					logo={
						organization.logo ? (
							<img src={organization.logo} alt={`${organization.label} logo`} />
						) : null
					}
				>
					{organization.roles.map(role => {
						const body = role.homeBody

						return (
							<ExperienceCard
								key={role.name}
								role={role.label}
								startDate={role.startDate}
								endDate={role.endDate}
								location={role.location}
								focusAreas={role.focusAreas.slice(0, 8)}
							>
								<div dangerouslySetInnerHTML={{ __html: body.introHtml }} />
								{body.detailsHtml ? (
									<details className="experience-more">
										<summary>
											<span className="experience-more-label-closed">More</span>
											<span className="experience-more-label-open">Less</span>
										</summary>
										<div
											className="experience-more-content"
											dangerouslySetInnerHTML={{ __html: body.detailsHtml }}
										/>
									</details>
								) : null}
								{role.resumeHighlights.length > 0 ? (
									<ul className="experience-highlights">
										{role.resumeHighlights.map(highlight => (
											<li key={highlight}>{highlight}</li>
										))}
									</ul>
								) : null}
							</ExperienceCard>
						)
					})}
				</OrganizationCard>
			))}
		</FeaturedList>
	)
}

export default SelectedExperience
