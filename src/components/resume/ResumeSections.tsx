import {
	type ResumeProseSection,
	type ResumeSection as ResumeSectionData,
	useResumeSections,
} from '../../content/resume'
import ResumeEducationSection from './ResumeEducationSection'
import ResumeExperienceSection from './ResumeExperienceSection'
import ResumeMetrics from './ResumeMetrics'
import ResumeProfileSection from './ResumeProfileSection'
import ResumeSection from './ResumeSection'
import ResumeSkillsSection from './ResumeSkillsSection'

const getSectionId = (section: ResumeSectionData): string =>
	`resume-${section.kind}-${section.entryName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`.replace(
		/-$/,
		'',
	)

const ResumeProse = ({ section }: { readonly section: ResumeProseSection }) => (
	<ResumeSection id={getSectionId(section)} title={section.title}>
		<div className="resume-prose" dangerouslySetInnerHTML={{ __html: section.html }} />
	</ResumeSection>
)

const ResumeSections = () => {
	const sections = useResumeSections()

	return sections.map(section => {
		switch (section.kind) {
			case 'profile':
				return <ResumeProfileSection key={section.entryName} profile={section} />
			case 'metrics':
				return <ResumeMetrics key={section.entryName} section={section} />
			case 'skills':
				return <ResumeSkillsSection key={section.entryName} section={section} />
			case 'prose':
				return <ResumeProse key={section.entryName} section={section} />
			case 'experience':
				return (
					<ResumeExperienceSection
						key={section.entryName}
						limit={section.limit}
						title={section.title}
					/>
				)
			case 'education':
				return <ResumeEducationSection key={section.entryName} title={section.title} />
		}
	})
}

export default ResumeSections
