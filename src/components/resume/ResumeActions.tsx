const ResumeActions = () => (
	<nav className="resume-actions container" aria-label="Resume actions">
		<a href="/">Back</a>
		<div className="resume-action-links">
			<a href="/resume.pdf">PDF</a>
			<button type="button" data-print-resume>
				Print
			</button>
		</div>
	</nav>
)

export default ResumeActions
