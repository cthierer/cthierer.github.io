import ResumeActions from '../components/resume/ResumeActions'
import ResumeHeader from '../components/resume/ResumeHeader'
import ResumePrintScript from '../components/resume/ResumePrintScript'
import ResumeSections from '../components/resume/ResumeSections'
import SiteLegal from '../components/site/SiteLegal'
import { useContent } from '../content/ContentContext'
import { useConfig } from '../config/ConfigContext'
import { createResumeDocument } from '../content/documents'

const Resume = () => {
	const document = createResumeDocument(useContent(), useConfig())
	return (
		<>
			<main className="resume-page" aria-labelledby="resume-title">
				<div className="resume-document">
					<ResumeActions />
					<article className="resume-sheet">
						<ResumeHeader document={document} />
						<ResumeSections document={document} />
					</article>
					<SiteLegal />
				</div>
			</main>
			<ResumePrintScript />
		</>
	)
}

export default Resume
