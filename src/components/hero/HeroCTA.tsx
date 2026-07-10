import React from 'react'

interface HeroCTA {
	children: React.ReactNode
}

const HeroCTA = ({ children }: HeroCTA) => (
	<nav className="hero-cta" aria-label="Hero actions">
		<ul>
			{React.Children.map(children, child => (
				<li>{child}</li>
			))}
		</ul>
	</nav>
)

export default HeroCTA
