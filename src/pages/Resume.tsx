import ResumeActions from '../components/resume/ResumeActions'
import ResumeHeader from '../components/resume/ResumeHeader'
import ResumePrintScript from '../components/resume/ResumePrintScript'
import ResumeSections from '../components/resume/ResumeSections'
import SiteLegal from '../components/site/SiteLegal'

const Resume = () => {
	return (
		<>
			<main className="resume-page" aria-labelledby="resume-title">
				<div className="resume-document">
					<ResumeActions />
					<article className="resume-sheet">
						<ResumeHeader />
						<ResumeSections />
					</article>
					<SiteLegal />
				</div>
			</main>
			<ResumePrintScript />
		</>
	)
}

export default Resume
