import ResumeActions from '../components/resume/ResumeActions'
import ResumeEducationSection from '../components/resume/ResumeEducationSection'
import ResumeExperienceSection from '../components/resume/ResumeExperienceSection'
import ResumeHeader from '../components/resume/ResumeHeader'
import ResumeMetrics from '../components/resume/ResumeMetrics'
import ResumePrintScript from '../components/resume/ResumePrintScript'
import ResumeProfileSection from '../components/resume/ResumeProfileSection'
import ResumeSkillsSection from '../components/resume/ResumeSkillsSection'
import SiteLegal from '../components/site/SiteLegal'

const Resume = () => {
	return (
		<>
			<main className="resume-page" aria-labelledby="resume-title">
				<div className="resume-document">
					<ResumeActions />
					<article className="resume-sheet">
						<ResumeHeader />
						<ResumeMetrics />
						<ResumeProfileSection />
						<ResumeSkillsSection />
						<ResumeExperienceSection />
						<ResumeEducationSection />
					</article>
					<SiteLegal />
				</div>
			</main>
			<ResumePrintScript />
		</>
	)
}

export default Resume
