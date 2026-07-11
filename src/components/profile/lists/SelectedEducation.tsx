import useRecentEducation from '../../../content/education'
import EducationCard from '../cards/EducationCard'
import FeaturedList from './FeaturedList'

const SelectedEducation = () => {
	const content = useRecentEducation()
	if (content.length < 1) {
		return null
	}

	return (
		<FeaturedList variant="education">
			{content.map(entry => (
				<EducationCard
					key={entry.name}
					institution={entry.institution}
					institutionLabel={entry.institutionLabel}
					program={[entry.degree, entry.program].filter(Boolean).join(' ') || entry.label}
					endDate={entry.endDate}
				/>
			))}
		</FeaturedList>
	)
}

export default SelectedEducation
