import DocumentActions, { DocumentPrintScript } from '../components/document/DocumentActions'
import ResumeHeader from '../components/resume/ResumeHeader'
import { useContent } from '../content/ContentContext'
import { useConfig } from '../config/ConfigContext'
import { createCoverLetterDocument, formatCoverLetterDate } from '../content/documents'

const CoverLetter = () => {
	const document = createCoverLetterDocument(useContent(), useConfig())
	if (!document)
		throw new Error('A cover letter was requested but no published cover letter was found.')
	const { letter, profile } = document
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
						<ResumeHeader document={{ ...document, sections: [] }} />
						<p className="cover-letter-date">{formatCoverLetterDate(letter.date)}</p>
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
