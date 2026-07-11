import { YearText } from '../../DateText'

interface EducationCardProps {
	institution: string
	institutionLabel: string
	program: string
	endDate?: Date
}

const EducationCard = ({ institution, institutionLabel, program, endDate }: EducationCardProps) => (
	<article className="education-card">
		<header>
			<p className="institution">{institution}</p>
			<p className="institution-short">{institutionLabel}</p>
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
