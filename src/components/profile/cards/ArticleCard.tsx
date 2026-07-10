interface ArticleCardProps {
	title: string
	icon: React.ReactNode
	children: React.ReactNode
}

const ArticleCard = ({ title, icon, children }: ArticleCardProps) => (
	<article className="article-card">
		<header>
			{icon}
			<h3>{title}</h3>
		</header>
		{children}
	</article>
)

export default ArticleCard
