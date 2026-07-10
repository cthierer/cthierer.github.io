interface ResumeSectionProps {
	readonly id: string
	readonly title: string
	readonly children: React.ReactNode
}

const ResumeSection = ({ id, title, children }: ResumeSectionProps) => (
	<section className="resume-section" aria-labelledby={id}>
		<h2 id={id}>{title}</h2>
		{children}
	</section>
)

export default ResumeSection
