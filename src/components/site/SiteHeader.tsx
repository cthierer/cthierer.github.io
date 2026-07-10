import SiteTitle from './SiteTitle'
import SiteLinks from './SiteLinks'

const SiteHeader = () => (
	<nav className="site-header" aria-label="Primary navigation">
		<SiteTitle />
		<SiteLinks />
	</nav>
)

export default SiteHeader
