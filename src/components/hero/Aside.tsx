interface AsideProps {
	title: string
	children: React.ReactNode
}

const Aside = ({ title, children }: AsideProps) => (
	<>
		<h2>{title}</h2>
		{children}
	</>
)

export default Aside
