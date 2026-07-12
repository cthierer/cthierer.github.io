import { useConfigValue } from '../../config/ConfigContext'
import Link from '../link/Link'

const ResumeActions = () => {
	const resumeDownload = useConfigValue('resumeDownload')
	return (
		<nav className="resume-actions container" aria-label="Resume actions">
			<a href="/">Back</a>
			<div className="resume-action-links">
				<Link href={resumeDownload} download type="application/pdf" event="resume-download">
					PDF
				</Link>
				<button type="button" data-print-resume data-umami-event="resume-print">
					Print
				</button>
			</div>
		</nav>
	)
}

export default ResumeActions
