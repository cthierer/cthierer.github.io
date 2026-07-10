interface AsideProps {
	title: string
	children: React.ReactNode
}

const Aside = ({ title, children }: AsideProps) => (
	<aside>
		<h2>{title}</h2>
		{children}
	</aside>
)

export default Aside
