import React from 'react'

interface FeaturedGalleryProps {
	children: React.ReactNode
}

const FeaturedGallery = ({ children }: FeaturedGalleryProps) => (
	<ol className="featured-gallery">
		{React.Children.map(children, child => (
			<li>{child}</li>
		))}
	</ol>
)

export default FeaturedGallery
