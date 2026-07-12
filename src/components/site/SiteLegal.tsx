import { useConfigValue } from '../../config/ConfigContext'

const SiteLegal = () => {
	const siteTitle = useConfigValue('siteTitle')
	const privacyPage = useConfigValue('privacyPage')
	const year = new Date().getFullYear()
	return (
		<div className="site-legal">
			<p>
				©{year} {siteTitle}
			</p>
			<a href={privacyPage.path}>Privacy policy</a>
		</div>
	)
}

export default SiteLegal
