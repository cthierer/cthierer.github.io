import type { ResumeRole } from '../../content/documents'
import ExperienceEntry from '../../content/ExperienceEntry'
import DateRangeText from '../DateText'
import ResumeSection from './ResumeSection'

const hasResumeContent = (experience: ExperienceEntry): boolean =>
	Boolean(experience.resumeSummary || experience.resumeHighlights.length > 0)

interface ResumeExperienceSectionProps {
	readonly roles: readonly ResumeRole[]
	readonly title: string
}

const ResumeExperienceSection = ({ roles, title }: ResumeExperienceSectionProps) => {
	return (
		<ResumeSection id="resume-experience" title={title}>
			<div className="resume-timeline">
				{roles.map(({ experience, organization }) => (
					<section className="resume-role" key={experience.name}>
						<header>
							<div>
								<h3>{experience.jobTitle}</h3>
								<p>{organization.label}</p>
							</div>
							<div className="resume-role-meta">
								<p>
									<DateRangeText startDate={experience.startDate} endDate={experience.endDate} />
								</p>
								<p>{experience.location}</p>
							</div>
						</header>
						{hasResumeContent(experience) ? (
							<div className="resume-prose">
								{experience.resumeSummary ? <p>{experience.resumeSummary}</p> : null}
								{experience.resumeHighlights.length > 0 ? (
									<ul>
										{experience.resumeHighlights.map(highlight => (
											<li key={highlight}>{highlight}</li>
										))}
									</ul>
								) : null}
							</div>
						) : (
							<div className="resume-prose" dangerouslySetInnerHTML={{ __html: experience.html }} />
						)}
					</section>
				))}
			</div>
		</ResumeSection>
	)
}

export default ResumeExperienceSection
