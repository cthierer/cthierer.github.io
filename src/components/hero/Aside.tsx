interface AsideProps {
	title: string
	children: React.ReactNode
}

const Aside = ({ title, children }: AsideProps) => (
	<article>
		<h2>{title}</h2>
		{children}
	</article>
)

export default Aside
