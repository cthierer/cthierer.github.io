import { useResumeEducation } from '../../content/resume'
import { formatEducationLabel, formatEducationYear } from './format'
import ResumeSection from './ResumeSection'

const ResumeEducationSection = () => {
	const education = useResumeEducation()

	return (
		<ResumeSection id="resume-education" title="Education">
			<div className="resume-education-list">
				{education.map(entry => (
					<section className="resume-education" key={entry.name}>
						<h3 className="resume-education-degree">{formatEducationLabel(entry)}</h3>
						<p className="resume-education-year">{formatEducationYear(entry)}</p>
						<p className="resume-education-institution">{entry.institution}</p>
						{entry.honors.length > 0 ? (
							<p className="resume-education-honors">{entry.honors.join(', ')}</p>
						) : null}
					</section>
				))}
			</div>
		</ResumeSection>
	)
}

export default ResumeEducationSection
