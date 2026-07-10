import { useResumeLinks, useResumeProfile } from '../../content/resume'
import { formatResumeLinkLabel } from './format'

const ResumeHeader = () => {
	const profile = useResumeProfile()
	const links = useResumeLinks()

	return (
		<header className="resume-header">
			<div>
				<h1 id="resume-title">{profile.name}</h1>
				<p className="resume-headline">{profile.headline}</p>
			</div>
			<ul className="resume-contact" aria-label="Contact information">
				{links.map(link => (
					<li key={link.name}>
						<a href={link.href}>{formatResumeLinkLabel(link.href, link.label)}</a>
					</li>
				))}
			</ul>
		</header>
	)
}

export default ResumeHeader
