import HomeHero from '../components/HomeHero'
import SiteHeader from '../components/SiteHeader'
import CurrentFocus from '../components/CurrentFocus'
import HomeHeroCTA from '../components/HomeHeroCTA'
import ProfileAtAGlance from '../components/ProfileAtAGlance'
import ProfileSelectedEducation from '../components/ProfileSelectedEducation'
import ProfileSelectedExperience from '../components/ProfileSelectedExperience'
import SiteFooter from '../components/SiteFooter'

const Home = () => (
	<>
		<header className="container page-header">
			<SiteHeader />
		</header>
		<main className="container">
			<HomeHero
				fascinator={<CurrentFocus />}
				fascinatorBackground="/assets/aside-bg.webp"
				footer={<HomeHeroCTA />}
			/>
			<section className="home-content">
				<div className="home-content-main">
					<ProfileSelectedExperience />
				</div>
				<aside className="home-content-sidebar" aria-label="Profile details">
					<ProfileAtAGlance />
					<ProfileSelectedEducation />
				</aside>
			</section>
		</main>
		<SiteFooter />
	</>
)

export default Home
