interface FocusAreaTagsProps {
	areas: string[]
	label: string
}

const FocusAreaTags = ({ areas, label }: FocusAreaTagsProps) => {
	if (areas.length < 1) {
		return null
	}

	return (
		<ul className="focus-area-tags" aria-label={label}>
			{areas.map(area => (
				<li key={area}>{area}</li>
			))}
		</ul>
	)
}

export default FocusAreaTags
