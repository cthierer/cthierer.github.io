import Link from './Link'

interface LinkButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
	decorator?: React.ReactNode
	variant?: 'primary' | 'secondary' | 'contrast'
	children: React.ReactNode
}

const LinkButton = ({
	decorator,
	variant = 'primary',
	children,
	className,
	...anchorProps
}: LinkButtonProps) => (
	<Link
		role="button"
		className={['link-button', variant, className].filter(Boolean).join(' ')}
		decorator={decorator}
		{...anchorProps}
	>
		{children}
	</Link>
)

export default LinkButton
