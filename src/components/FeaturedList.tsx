import React from 'react'

interface FeaturedListProps {
	variant?: 'default' | 'education' | 'experience'
	children: React.ReactNode
}

const FeaturedList = ({ variant = 'default', children }: FeaturedListProps) => (
	<ol className={`featured-list ${variant}`}>
		{React.Children.map(children, child => (
			<li>{child}</li>
		))}
	</ol>
)

export default FeaturedList
