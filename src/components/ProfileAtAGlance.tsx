import { useContentEntry } from '../content/ContentContext'
import ProfileCard from './ProfileCard'

const ProfileAtAGlance = () => {
	const entry = useContentEntry('singles/At A Glance.md')
	if (!entry) {
		return null
	}

	return (
		<ProfileCard id="about" title={entry.data.title as string}>
			<div dangerouslySetInnerHTML={{ __html: entry.html }} />
		</ProfileCard>
	)
}

export default ProfileAtAGlance
