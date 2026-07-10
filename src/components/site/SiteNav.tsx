import Link from '../link/Link'

const SiteNav = () => (
	<ul className="site-nav">
		<li>
			<Link href="#about" className="secondary">
				About
			</Link>
		</li>
		<li>
			<Link href="#experience" className="secondary">
				Experience
			</Link>
		</li>
		<li>
			<Link href="#education" className="secondary">
				Education
			</Link>
		</li>
	</ul>
)

export default SiteNav
