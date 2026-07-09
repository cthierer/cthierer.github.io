interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
	decorator?: React.ReactNode
	children: React.ReactNode
}

const Link = ({ decorator, children, className, ...anchorProps }: LinkProps) => (
	<a className={['link', className].filter(Boolean).join(' ')} {...anchorProps}>
		{decorator ? (
			<span className="decorator" aria-hidden="true">
				{decorator}
			</span>
		) : null}
		{children}
	</a>
)

export default Link
