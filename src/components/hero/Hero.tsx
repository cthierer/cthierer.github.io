import React from 'react'

interface HeroProps {
	headline: string
	fascinator?: React.ReactNode
	fascinatorBackground?: string
	footer?: React.ReactNode
	children: React.ReactNode
}

const Hero = ({ headline, fascinator, fascinatorBackground, footer, children }: HeroProps) => (
	<header className="hero">
		<section className="main">
			<h1>{headline}</h1>
			<div className="content">{children}</div>
			{footer ? <footer>{footer}</footer> : null}
		</section>
		{fascinator ? (
			<aside
				className={`fascinator${fascinatorBackground ? ' background' : ''}`}
				style={{
					backgroundImage: fascinatorBackground ? `url("${fascinatorBackground}")` : 'inherit',
				}}
			>
				{fascinator}
			</aside>
		) : null}
	</header>
)

export default Hero
