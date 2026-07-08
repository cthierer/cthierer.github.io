interface PageProps {
	title: string
	children: React.ReactNode
}

const Page = ({ title, children }: PageProps) => (
	<html lang="en">
		<head>
			<meta charSet="utf-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<title>{title}</title>
			<link rel="stylesheet" href="/assets/main.css" />
		</head>
		<body>{children}</body>
	</html>
)

export default Page
