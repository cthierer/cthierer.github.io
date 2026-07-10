import { useContentEntry } from '../../content/ContentContext'
import Hero from './Hero'

interface HomeHeroProps {
	fascinator?: React.ReactNode
	fascinatorBackground?: string
	footer?: React.ReactNode
}

const HomeHero = ({ fascinator, fascinatorBackground, footer }: HomeHeroProps) => {
	const entry = useContentEntry('singles/Hero.md')
	if (!entry) {
		return null
	}

	return (
		<Hero
			headline={entry.data.title as string}
			fascinator={fascinator}
			fascinatorBackground={fascinatorBackground}
			footer={footer}
		>
			<div dangerouslySetInnerHTML={{ __html: entry.html }} />
		</Hero>
	)
}

export default HomeHero
