import { useConfigValue } from '../../config/ConfigContext'

const SiteTitle = () => {
	const siteTitle = useConfigValue('siteTitle')
	return (
		<a className="site-title" href="/" aria-label={`${siteTitle} home`}>
			{siteTitle}
		</a>
	)
}

export default SiteTitle
