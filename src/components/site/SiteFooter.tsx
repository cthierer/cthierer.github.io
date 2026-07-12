import { useLinks } from '../../content/links'
import Link from '../link/Link'
import SiteLegal from './SiteLegal'

const SiteFooter = () => {
	const links = useLinks({ area: 'footer', category: ['social', 'contact'] })

	return (
		<footer className="container site-footer">
			<nav aria-label="Footer">
				<ul>
					{links.map(link => (
						<li key={link.name}>
							<Link href={link.href} decorator={link.decorator} event={`${link.slug}-clicked`}>
								{link.label}
							</Link>
						</li>
					))}
				</ul>
			</nav>
			<div className="tagline">
				<SiteLegal />
			</div>
		</footer>
	)
}

export default SiteFooter
