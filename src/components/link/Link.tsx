interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
	decorator?: React.ReactNode
	event?: string
	children: React.ReactNode
}

const Link = ({ decorator, event, children, className, ...anchorProps }: LinkProps) => (
	<a
		data-umami-event={event}
		className={['link', className].filter(Boolean).join(' ')}
		{...anchorProps}
	>
		{decorator ? (
			<span className="decorator" aria-hidden="true">
				{decorator}
			</span>
		) : null}
		{children}
	</a>
)

export default Link
