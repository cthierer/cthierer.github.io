import { useConfigValue } from '../config/ConfigContext'

interface PageProps {
	title: string
	description: string
	path: string
	children: React.ReactNode
}

const Page = ({ title, description, path, children }: PageProps) => {
	const renderTime = new Date().toISOString()
	const siteUrl = useConfigValue('siteUrl')
	const favIcon = useConfigValue('favIcon')
	const socialImagePath = useConfigValue('socialImage')
	const socialImage = new URL(socialImagePath, siteUrl).toString()
	const canonicalUrl = new URL(path, siteUrl).toString()

	return (
		<html lang="en" data-theme="light">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<meta name="description" content={description} />
				<meta name="last-modified" content={renderTime} />
				<meta httpEquiv="last-modified" content={renderTime} />
				<meta property="og:type" content="website" />
				<meta property="og:title" content={title} />
				<meta property="og:description" content={description} />
				<meta property="og:url" content={canonicalUrl} />
				<meta property="og:image" content={socialImage} />
				<meta property="og:updated_time" content={renderTime} />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content={title} />
				<meta name="twitter:description" content={description} />
				<meta name="twitter:image" content={socialImage} />
				<title>{title}</title>
				<link rel="canonical" href={canonicalUrl} />
				<link rel="icon" href={favIcon} type="image/svg+xml" />
				<link rel="stylesheet" href="assets/main.css" />
			</head>
			<body>{children}</body>
		</html>
	)
}

export default Page
