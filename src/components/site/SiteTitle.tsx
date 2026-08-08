import { useConfigValue, usePage } from '../../config/ConfigContext'

const SiteTitle = () => {
	const homePage = usePage('home')
	const siteTitle = useConfigValue('siteTitle')

	if (!homePage) {
		return <span className="site-title">{siteTitle}</span>
	}

	return (
		<a className="site-title" href={homePage.path} aria-label={`${siteTitle} home`}>
			{siteTitle}
		</a>
	)
}

export default SiteTitle
