import HeroCTA from './HeroCTA'
import { useLinks } from '../../content/links'
import Resume from '../icons/Resume'
import LinkButton from '../link/LinkButton'
import { useConfigValue } from '../../config/ConfigContext'

const HomeHeroCTA = () => {
	const links = useLinks({ area: 'cta', category: 'social' })
	const resumePage = useConfigValue('resumePage')

	return (
		<HeroCTA>
			<LinkButton href={resumePage.path} decorator={<Resume />}>
				Resume
			</LinkButton>
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
