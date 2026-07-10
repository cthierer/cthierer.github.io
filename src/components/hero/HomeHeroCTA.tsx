import HeroCTA from './HeroCTA'
import Email from '../icons/Email'
import LinkedIn from '../icons/LinkedIn'
import Resume from '../icons/Resume'
import LinkButton from '../link/LinkButton'

const HomeHeroCTA = () => (
	<HeroCTA>
		<LinkButton href="#" decorator={<Resume />}>
			Resume
		</LinkButton>
		<LinkButton variant="secondary" decorator={<Email />} href="#">
			Email
		</LinkButton>
		<LinkButton variant="secondary" decorator={<LinkedIn />} href="#">
			LinkedIn
		</LinkButton>
	</HeroCTA>
)

export default HomeHeroCTA
