import { useConfigValue } from '../../config/ConfigContext'

const ResumeActions = () => {
	const resumeDownload = useConfigValue('resumeDownload')
	return (
		<nav className="resume-actions container" aria-label="Resume actions">
			<a href="/">Back</a>
			<div className="resume-action-links">
				<a href={resumeDownload}>PDF</a>
				<button type="button" data-print-resume>
					Print
				</button>
			</div>
		</nav>
	)
}

export default ResumeActions
