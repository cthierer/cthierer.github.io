import HomeHero from '../components/hero/HomeHero'
import SiteHeader from '../components/site/SiteHeader'
import CurrentFocus from '../components/hero/CurrentFocus'
import HomeHeroCTA from '../components/hero/HomeHeroCTA'
import ProfileAtAGlance from '../components/profile/ProfileAtAGlance'
import ProfileSelectedEducation from '../components/profile/ProfileSelectedEducation'
import ProfileSelectedExperience from '../components/profile/ProfileSelectedExperience'
import SiteFooter from '../components/site/SiteFooter'

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
