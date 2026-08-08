import type { ResumeSkillsSection as ResumeSkillsSectionData } from '../../content/resume'
import ResumeSection from './ResumeSection'

const ResumeSkillsSection = ({ section }: { readonly section: ResumeSkillsSectionData }) => {
	const { groups: skills, title } = section

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
