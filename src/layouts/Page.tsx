interface PageProps {
	title: string
	children: React.ReactNode
}

const Page = ({ title, children }: PageProps) => (
	<html lang="en" data-theme="light">
		<head>
			<meta charSet="utf-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<title>{title}</title>
			<link
				rel="stylesheet"
				href="https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,600;8..60,700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
			/>
			<link rel="stylesheet" href="/assets/main.css" />
		</head>
		<body>{children}</body>
	</html>
)

export default Page
