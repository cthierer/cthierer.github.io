import Link from './Link'

interface LinkButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
	decorator?: React.ReactNode
	event?: string
	variant?: 'primary' | 'secondary' | 'contrast'
	children: React.ReactNode
}

const LinkButton = ({
	decorator,
	event,
	variant = 'primary',
	children,
	className,
	...anchorProps
}: LinkButtonProps) => (
	<Link
		role="button"
		className={['link-button', variant, className].filter(Boolean).join(' ')}
		decorator={decorator}
		event={event}
		{...anchorProps}
	>
		{children}
	</Link>
)

export default LinkButton
