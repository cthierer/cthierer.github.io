import React from 'react'

interface OrganizationCardProps {
	name: string
	logo: React.ReactNode
	children: React.ReactNode
}

const OrganizationCard = ({ name, logo, children }: OrganizationCardProps) => (
	<div className="organization-card">
		<article>
			<header>
				<div className="logo">{logo}</div>
				<h3>{name}</h3>
			</header>
			{React.Children.map(children, child => (
				<section>{child}</section>
			))}
		</article>
	</div>
)

export default OrganizationCard
