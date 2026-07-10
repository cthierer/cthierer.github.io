import { useResumeSkills } from '../../content/resume'
import ResumeSection from './ResumeSection'

const ResumeSkillsSection = () => {
	const skills = useResumeSkills()
	if (skills.length === 0) {
		return null
	}

	return (
		<ResumeSection id="resume-skills" title="Skills">
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
