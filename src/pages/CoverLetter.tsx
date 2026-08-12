import DocumentActions, { DocumentPrintScript } from '../components/document/DocumentActions'
import ResumeHeader from '../components/resume/ResumeHeader'
import { useCoverLetter } from '../content/coverLetter'
import { useResumeProfile } from '../content/resume'

const formatDate = (value: Date | string) => {
	const date =
		value instanceof Date ? value : new Date(value.length === 10 ? `${value}T00:00:00Z` : value)
	return new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeZone: 'UTC' }).format(date)
}

const CoverLetter = () => {
	const letter = useCoverLetter()
	const profile = useResumeProfile()
	if (!letter)
		throw new Error('A cover letter was requested but no published cover letter was found.')
	return (
		<>
			<main className="cover-letter-page" aria-labelledby="resume-title">
				<div className="cover-letter-document">
					<DocumentActions
						download="cover-letter.pdf"
						label="Cover letter"
						eventPrefix="cover-letter"
					/>
					<article className="cover-letter-sheet">
						<ResumeHeader />
						<p className="cover-letter-date">{formatDate(letter.date)}</p>
						<address className="cover-letter-recipient">
							{letter.recipient.name ? <div>{letter.recipient.name}</div> : null}
							{letter.recipient.title ? <div>{letter.recipient.title}</div> : null}
							<div>{letter.recipient.organization}</div>
							{letter.recipient.address?.map((line, index) => (
								<div key={`${index}-${line}`}>{line}</div>
							))}
						</address>
						{letter.subject ? <p className="cover-letter-subject">{letter.subject}</p> : null}
						<p>{letter.greeting}</p>
						<div className="cover-letter-body" dangerouslySetInnerHTML={{ __html: letter.html }} />
						<p className="cover-letter-closing">
							{letter.closing}
							<br />
							<span>{letter.sender?.name ?? profile.name}</span>
						</p>
					</article>
				</div>
			</main>
			<DocumentPrintScript />
		</>
	)
}
export default CoverLetter
