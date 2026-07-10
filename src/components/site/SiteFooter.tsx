import { useLinks } from '../../content/links'
import Link from '../link/Link'

const SiteFooter = () => {
	const links = useLinks({ area: 'footer', category: ['social', 'contact'] })

	return (
		<footer className="container site-footer">
			<nav aria-label="Footer">
				<ul>
					{links.map(link => (
						<li key={link.name}>
							<Link href={link.href} decorator={link.decorator}>
								{link.label}
							</Link>
						</li>
					))}
				</ul>
			</nav>
		</footer>
	)
}

export default SiteFooter
