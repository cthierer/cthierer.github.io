import DateRangeText from '../../DateText'
import FocusAreaTags from '../FocusAreaTags'

interface ExperienceCardProps {
	role: string
	location: string
	startDate: Date
	endDate?: Date
	focusAreas?: string[]
	children: React.ReactNode
}

const ExperienceCard = ({
	role,
	location,
	startDate,
	endDate,
	focusAreas = [],
	children,
}: ExperienceCardProps) => (
	<div className="experience-card">
		<header>
			<h4>{role}</h4>
			<p className="date-range">
				<DateRangeText startDate={startDate} endDate={endDate} presentLabel="present" />
			</p>
			<p className="location">{location}</p>
		</header>
		<FocusAreaTags areas={focusAreas} label={`${role} focus areas`} />
		<div className="content">{children}</div>
	</div>
)

export default ExperienceCard
