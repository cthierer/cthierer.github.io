interface PageProps {
	title: string
	description: string
	path: string
	children: React.ReactNode
}

const siteUrl = 'https://www.christhierer.com'
const socialImage = `${siteUrl}/assets/social-image.png`

const Page = ({ title, description, path, children }: PageProps) => {
	const canonicalUrl = new URL(path, siteUrl).toString()

	return (
		<html lang="en" data-theme="light">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<meta name="description" content={description} />
				<meta property="og:type" content="website" />
				<meta property="og:title" content={title} />
				<meta property="og:description" content={description} />
				<meta property="og:url" content={canonicalUrl} />
				<meta property="og:image" content={socialImage} />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content={title} />
				<meta name="twitter:description" content={description} />
				<meta name="twitter:image" content={socialImage} />
				<title>{title}</title>
				<link rel="canonical" href={canonicalUrl} />
				<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
				<link
					rel="stylesheet"
					href="https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,600;8..60,700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
				/>
				<link rel="stylesheet" href="/assets/main.css" />
			</head>
			<body>{children}</body>
		</html>
	)
}

export default Page
