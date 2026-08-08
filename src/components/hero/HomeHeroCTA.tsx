import HeroCTA from './HeroCTA'
import { useLinks } from '../../content/links'
import Resume from '../icons/Resume'
import LinkButton from '../link/LinkButton'
import { usePage } from '../../config/ConfigContext'

const HomeHeroCTA = () => {
	const links = useLinks({ area: 'cta', category: 'social' })
	const resumePage = usePage('resume')

	return (
		<HeroCTA>
			{resumePage ? (
				<LinkButton href={resumePage.path} decorator={<Resume />}>
					Resume
				</LinkButton>
			) : null}
			{links.map(link => (
				<LinkButton
					key={link.name}
					variant="secondary"
					decorator={link.decorator}
					href={link.href}
					event={`${link.slug}-clicked`}
				>
					{link.label}
				</LinkButton>
			))}
		</HeroCTA>
	)
}

export default HomeHeroCTA
