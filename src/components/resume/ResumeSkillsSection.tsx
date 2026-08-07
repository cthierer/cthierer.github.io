import { useResumeSectionTitle, useResumeSkills } from '../../content/resume'
import ResumeSection from './ResumeSection'

const ResumeSkillsSection = () => {
	const skills = useResumeSkills()
	const title = useResumeSectionTitle('skills', 'Skills')

	if (skills.length === 0) {
		return null
	}

	return (
		<ResumeSection id="resume-skills" title={title}>
			<dl className="resume-skills">
				{skills.map(group => (
					<div key={group.label}>
						<dt>{group.label}</dt>
						<dd>{group.items.join(', ')}</dd>
					</div>
				))}
			</dl>
		</ResumeSection>
	)
}

export default ResumeSkillsSection
