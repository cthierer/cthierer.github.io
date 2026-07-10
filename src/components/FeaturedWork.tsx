import { useFeatured } from '../content/ContentContext'
import ArticleCard from './ArticleCard'
import FeaturedGallery from './FeaturedGallery'

const FeaturedWork = () => {
	const content = useFeatured('work')
	if (content.length < 1) {
		return null
	}

	return (
		<FeaturedGallery>
			{content.map(entry => (
				<ArticleCard key={entry.name} title={entry.data.title as string} icon={null}>
					<div dangerouslySetInnerHTML={{ __html: entry.html }} />
				</ArticleCard>
			))}
		</FeaturedGallery>
	)
}

export default FeaturedWork
