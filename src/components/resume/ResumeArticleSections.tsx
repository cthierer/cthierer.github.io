import { useResumeArticleSections } from '../../content/resume'
import ResumeSection from './ResumeSection'

const getSectionId = (name: string): string =>
	`resume-article-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`.replace(/-$/, '')

const ResumeArticleSections = () => {
	const sections = useResumeArticleSections()

	if (sections.length === 0) {
		return null
	}

	return sections.map(section => (
		<ResumeSection key={section.name} id={getSectionId(section.name)} title={section.title}>
			<div className="resume-prose" dangerouslySetInnerHTML={{ __html: section.html }} />
		</ResumeSection>
	))
}

export default ResumeArticleSections
