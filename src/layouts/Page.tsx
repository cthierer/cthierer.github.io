import { useConfigValue } from '../config/ConfigContext'
import JsonLd, { JsonLdValue } from '../metadata/JsonLd'

export interface StructuredDataContext {
	readonly canonicalUrl: string
	readonly dateModified: string
	readonly profileImage: string
}

interface PageProps {
	title: string
	description: string
	path: string
	structuredData?: (context: StructuredDataContext) => JsonLdValue
	children: React.ReactNode
}

const Page = ({ title, description, path, structuredData, children }: PageProps) => {
	const renderTime = new Date().toISOString()
	const siteUrl = useConfigValue('siteUrl')
	const favIcon = useConfigValue('favIcon')
	const socialImagePath = useConfigValue('socialImage')
	const profileImagePath = useConfigValue('profileImage')
	const umamiWebsiteId = useConfigValue('umamiWebsiteId')
	const socialImage = new URL(socialImagePath, siteUrl).toString()
	const profileImage = new URL(profileImagePath, siteUrl).toString()
	const canonicalUrl = new URL(path, siteUrl).toString()
	const jsonLd = structuredData?.({
		canonicalUrl,
		dateModified: renderTime,
		profileImage,
	})

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
				{jsonLd ? <JsonLd data={jsonLd} /> : null}
				{umamiWebsiteId ? (
					<script
						defer
						src="https://cloud.umami.is/script.js"
						data-website-id={umamiWebsiteId}
					></script>
				) : null}
			</head>
			<body>{children}</body>
		</html>
	)
}

export default Page
