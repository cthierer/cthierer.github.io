import { useLinks } from '../../content/links'
import Link from '../link/Link'

const SiteLinks = () => {
	const links = useLinks({ area: 'header', category: 'contact' })

	if (links.length === 0) {
		return null
	}

	return (
		<ul className="site-links">
			{links.map(link => (
				<li key={link.name}>
					<Link href={link.href} decorator={link.decorator}>
						{link.label}
					</Link>
				</li>
			))}
		</ul>
	)
}

export default SiteLinks
