import AboutHero from "../components/pages/about/AboutHero"
import AboutVolunteer from "../components/pages/about/AboutVolunteer"
import AboutBanner from "../components/pages/about/AboutBanner"
import HomeYou from "../components/pages/home/HomeYou"

const AboutPage = () => {
  return (
    <>
      <title>About Alkem Smile | Our Mission & Volunteering Culture</title>
      <meta name="description" content="Learn about Alkem Smile's mission, values, and commitment to volunteering and community service. Discover our culture of care and employee engagement." />
      <meta name="keywords" content="alkem, about, volunteering, mission, values, company culture, community service, smile" />
      <AboutHero />
      <AboutBanner />
      <AboutVolunteer />
      <HomeYou />
    </>
  )
}

export default AboutPage