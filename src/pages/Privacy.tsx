import SiteFooter from '../components/site/SiteFooter'
import SiteHeader from '../components/site/SiteHeader'
import { useContentEntry } from '../content/ContentContext'

const Privacy = () => {
	const content = useContentEntry('Privacy.md')
	if (!content) {
		return null
	}

	return (
		<>
			<header className="container page-header">
				<SiteHeader />
			</header>
			<main className="container">
				<nav aria-label="breadcrumb">
					<ul>
						<li>
							<a href="/">Home</a>
						</li>
						<li>Privacy</li>
					</ul>
				</nav>
				<article className="privacy">
					<header>
						<h1>{content.data.title as string}</h1>
					</header>
					<div dangerouslySetInnerHTML={{ __html: content.html }} />
				</article>
			</main>
			<SiteFooter />
		</>
	)
}

export default Privacy
