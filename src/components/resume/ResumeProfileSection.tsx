import { useResumeProfile } from '../../content/resume'
import ResumeSection from './ResumeSection'

const ResumeProfileSection = () => {
	const profile = useResumeProfile()

	return (
		<ResumeSection id="resume-profile" title="Profile">
			<div className="resume-prose" dangerouslySetInnerHTML={{ __html: profile.html }} />
		</ResumeSection>
	)
}

export default ResumeProfileSection
