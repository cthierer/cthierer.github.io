import type { ResumeProfile } from '../../content/resume'
import ResumeSection from './ResumeSection'

const ResumeProfileSection = ({ profile }: { readonly profile: ResumeProfile }) => (
	<ResumeSection id="resume-profile" title={profile.title}>
		<div className="resume-prose" dangerouslySetInnerHTML={{ __html: profile.html }} />
	</ResumeSection>
)

export default ResumeProfileSection
