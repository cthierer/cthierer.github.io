import { useResumeEducation } from '../../content/resume'
import { YearText } from '../DateText'
import { formatEducationLabel } from './format'
import ResumeSection from './ResumeSection'

const ResumeEducationSection = ({ title }: { readonly title: string }) => {
	const education = useResumeEducation()

	return (
		<ResumeSection id="resume-education" title={title}>
			<div className="resume-education-list">
				{education.map(entry => (
					<section className="resume-education" key={entry.name}>
						<h3 className="resume-education-degree">{formatEducationLabel(entry)}</h3>
						{entry.endDate ? (
							<p className="resume-education-year">
								<YearText date={entry.endDate} />
							</p>
						) : null}
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
