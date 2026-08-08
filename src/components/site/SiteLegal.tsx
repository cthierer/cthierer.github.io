import { useConfigValue, usePage } from '../../config/ConfigContext'

const SiteLegal = () => {
	const siteTitle = useConfigValue('siteTitle')
	const privacyPage = usePage('privacy')
	const year = new Date().getFullYear()
	return (
		<div className="site-legal">
			<p>
				©{year} {siteTitle}
			</p>
			{privacyPage ? <a href={privacyPage.path}>Privacy policy</a> : null}
		</div>
	)
}

export default SiteLegal
