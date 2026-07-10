import { YearText } from '../../DateText'

interface EducationCardProps {
	institution: string
	program: string
	endDate?: Date
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
			{endDate ? (
				<p className="date-range">
					<YearText date={endDate} />
				</p>
			) : null}
		</header>
		<h3>{program}</h3>
	</article>
)

export default EducationCard
