import type { ResumeDocument } from '../../content/documents'
import { formatResumeLinkLabel } from './format'

const ResumeHeader = ({ document }: { readonly document: ResumeDocument }) => {
	const { profile, links } = document

	return (
		<header className="resume-header">
			<div>
				<h1 id="resume-title">{profile.name}</h1>
				<p className="resume-headline">{profile.headline}</p>
			</div>
			<address className="resume-contact" aria-label="Contact information">
				<ul>
					{links.map(link => (
						<li key={link.name}>
							<a href={link.href}>{formatResumeLinkLabel(link.href, link.label)}</a>
						</li>
					))}
				</ul>
			</address>
		</header>
	)
}

export default ResumeHeader
