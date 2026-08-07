import { useResumeProfile, useResumeSectionTitle } from '../../content/resume'
import ResumeSection from './ResumeSection'

const ResumeProfileSection = () => {
	const profile = useResumeProfile()
	const title = useResumeSectionTitle('profile', 'Profile')

	return (
		<ResumeSection id="resume-profile" title={title}>
			<div className="resume-prose" dangerouslySetInnerHTML={{ __html: profile.html }} />
		</ResumeSection>
	)
}

export default ResumeProfileSection
