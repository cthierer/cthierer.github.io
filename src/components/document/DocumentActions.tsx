interface DocumentActionsProps {
	readonly download: string
	readonly label: string
	readonly backHref?: string
	readonly eventPrefix?: string
}

const DocumentActions = ({ download, label, backHref, eventPrefix }: DocumentActionsProps) => (
	<nav className="document-actions container" aria-label={`${label} actions`}>
		{backHref ? <a href={backHref}>Back</a> : null}
		<div className="document-action-links">
			<a
				href={download}
				download
				type="application/pdf"
				data-umami-event={eventPrefix ? `${eventPrefix}-download` : undefined}
			>
				PDF
			</a>
			<button
				type="button"
				data-print-document
				data-umami-event={eventPrefix ? `${eventPrefix}-print` : undefined}
			>
				Print
			</button>
		</div>
	</nav>
)

export const DocumentPrintScript = () => (
	<script
		dangerouslySetInnerHTML={{
			__html:
				"document.querySelector('[data-print-document]')?.addEventListener('click', () => window.print());",
		}}
	/>
)

export default DocumentActions
