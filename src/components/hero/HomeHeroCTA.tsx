import HeroCTA from './HeroCTA'
import { useLinks } from '../../content/links'
import Resume from '../icons/Resume'
import LinkButton from '../link/LinkButton'

const HomeHeroCTA = () => {
	const links = useLinks({ area: 'cta', category: 'social' })

	return (
		<HeroCTA>
			<LinkButton href="/resume.html" decorator={<Resume />}>
				Resume
			</LinkButton>
			{links.map(link => (
				<LinkButton key={link.name} variant="secondary" decorator={link.decorator} href={link.href}>
					{link.label}
				</LinkButton>
			))}
		</HeroCTA>
	)
}

export default HomeHeroCTA
