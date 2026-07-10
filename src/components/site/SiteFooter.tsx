import { Gamepad2 } from 'lucide-react'
import Email from '../icons/Email'
import GitHub from '../icons/GitHub'
import LinkedIn from '../icons/LinkedIn'
import Resume from '../icons/Resume'
import Link from '../link/Link'

const SiteFooter = () => (
	<footer className="container site-footer">
		<nav aria-label="Footer">
			<ul>
				<li>
					<Link href="#github" decorator={<GitHub />}>
						GitHub
					</Link>
				</li>
				<li>
					<Link href="#mobygames" decorator={<Gamepad2 aria-hidden="true" />}>
						MobyGames
					</Link>
				</li>
				<li>
					<Link href="#linkedin" decorator={<LinkedIn />}>
						LinkedIn
					</Link>
				</li>
				<li>
					<Link href="#email" decorator={<Email />}>
						Email
					</Link>
				</li>
				<li>
					<Link href="#resume" decorator={<Resume />}>
						Resume
					</Link>
				</li>
			</ul>
		</nav>
		<p className="tagline">
			Built from <a href="#markdown">Markdown</a>.
		</p>
	</footer>
)

export default SiteFooter
