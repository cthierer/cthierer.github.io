interface ProfileCardProps {
	id?: string
	title: string
	children: React.ReactNode
}

const ProfileCard = ({ id, title, children }: ProfileCardProps) => (
	<section id={id} className="profile-card">
		<h2>{title}</h2>
		<div className="content">{children}</div>
	</section>
)

export default ProfileCard
