import { useResumeExperience } from '../../content/resume'
import { formatDateRange } from './format'
import ResumeSection from './ResumeSection'

const ResumeExperienceSection = () => {
	const roles = useResumeExperience()

	return (
		<ResumeSection id="resume-experience" title="Experience">
			<div className="resume-timeline">
				{roles.map(({ experience, organization }) => (
					<section className="resume-role" key={experience.name}>
						<header>
							<div>
								<h3>{experience.jobTitle}</h3>
								<p>{organization.label}</p>
							</div>
							<div className="resume-role-meta">
								<p>{formatDateRange(experience.startDate, experience.endDate)}</p>
								<p>{experience.location}</p>
							</div>
						</header>
						<div className="resume-prose" dangerouslySetInnerHTML={{ __html: experience.html }} />
					</section>
				))}
			</div>
		</ResumeSection>
	)
}

export default ResumeExperienceSection
