import { useContentEntry } from '../../content/ContentContext'
import Email from '../icons/Email'
import Link from '../link/Link'

const SiteLinks = () => {
	const email = useContentEntry('contact/Email.md')
	const emailHref = email?.data.href as string | undefined

	if (!emailHref) {
		return null
	}

	return (
		<ul className="site-links">
			<li>
				<Link href={emailHref} decorator={<Email />}>
					Email
				</Link>
			</li>
		</ul>
	)
}

export default SiteLinks
