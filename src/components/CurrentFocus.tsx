import { useContentEntry } from '../content/ContentContext'
import Aside from './Aside'

const CurrentFocus = () => {
	const entry = useContentEntry('singles/Current Focus.md')
	if (!entry) {
		return null
	}

	return (
		<Aside title={entry.data.title as string}>
			<div dangerouslySetInnerHTML={{ __html: entry.html }} />
		</Aside>
	)
}

export default CurrentFocus
