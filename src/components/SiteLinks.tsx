import Email from './icons/Email'
import Link from './Link'

const SiteLinks = () => (
	<ul className="site-links">
		<li>
			<Link href="#" decorator={<Email />}>
				Email
			</Link>
		</li>
	</ul>
)

export default SiteLinks
