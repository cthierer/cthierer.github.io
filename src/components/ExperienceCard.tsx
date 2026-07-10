interface ExperienceCardProps {
	role: string
	location: string
	startDate: Date
	endDate?: Date
	children: React.ReactNode
}

const ExperienceCard = ({ role, location, startDate, endDate, children }: ExperienceCardProps) => (
	<div className="experience-card">
		<header>
			<h4>{role}</h4>
			<p className="date-range">
				{startDate.getFullYear()} – {endDate ? endDate.getFullYear() : 'present'}
			</p>
			<p className="location">{location}</p>
		</header>
		<div className="content">{children}</div>
	</div>
)

export default ExperienceCard
