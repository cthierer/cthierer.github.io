import SiteTitle from './SiteTitle'
import SiteNav from './SiteNav'
import SiteLinks from './SiteLinks'

const SiteHeader = () => (
	<nav className="site-header" aria-label="Primary navigation">
		<SiteTitle />
		<SiteNav />
		<SiteLinks />
	</nav>
)

export default SiteHeader
