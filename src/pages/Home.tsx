import HomeHero from '../components/HomeHero'
import SiteHeader from '../components/SiteHeader'
import CurrentFocus from '../components/CurrentFocus'
import HomeHeroCTA from '../components/HomeHeroCTA'

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
		</main>
	</>
)

export default Home
