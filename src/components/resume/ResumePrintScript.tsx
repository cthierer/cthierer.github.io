const ResumePrintScript = () => (
	<script
		dangerouslySetInnerHTML={{
			__html:
				"document.querySelector('[data-print-resume]')?.addEventListener('click', () => window.print());",
		}}
	/>
)

export default ResumePrintScript
