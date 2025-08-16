import HomeHero from '../components/pages/home/HomeHero'
import HomeAbout from '../components/pages/home/HomeAbout'
import HomeYearRound from '../components/pages/home/HomeYearRound'
import HomeStats from '../components/pages/home/HomeStats'
import HomeUpcoming from '../components/pages/home/HomeUpcoming'
import HomeYou from '../components/pages/home/HomeYou'
import AnnualEventsCalendar from '../components/ui/AnnualEventsCalendar'

const HomePage = () => {
  return (
    <>
      <title>Alkem Smile | Home Page</title>
      <meta name="description" content="Join Alkem Smile's volunteering events and activities. Discover how Alkem employees make a difference through care, connection, and change." />
      <meta name="keywords" content="alkem, volunteering, events, community, employee engagement, social impact, smile, healthcare" />
      <HomeHero />
      <HomeAbout />
      <AnnualEventsCalendar />
      <HomeYearRound />
      <HomeStats />
      <HomeUpcoming />
      <HomeYou />
    </>
  )
}

export default HomePage