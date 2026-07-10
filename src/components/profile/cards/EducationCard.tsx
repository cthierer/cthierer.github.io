interface EducationCardProps {
	institution: string
	program: string
	endDate?: Date
}

const formatYear = (date: Date | undefined): string | null => {
	if (!date) {
		return null
	}

	return date.getFullYear().toString()
}

const formatInstitution = (institution: string): string => {
	const abbreviation = institution.match(/\(([^)]+)\)/)?.[1]
	if (abbreviation) {
		return abbreviation
	}

	if (institution.includes('University of California, Los Angeles')) {
		return 'UCLA'
	}

	return institution
}

const EducationCard = ({ institution, program, endDate }: EducationCardProps) => (
	<article className="education-card">
		<header>
			<p className="institution">{institution}</p>
			<p className="institution-short">{formatInstitution(institution)}</p>
			<p className="date-range">{formatYear(endDate)}</p>
		</header>
		<h3>{program}</h3>
	</article>
)

export default EducationCard
