import AnnualVolunterHero from "../components/pages/annualVolunteer/AnnualVolunteerHero";
import AnnualVolunteerYearRound from "../components/pages/annualVolunteer/AnnualVolunteerYearRound";
import HomeYou from "../components/pages/home/HomeYou"
import AnnualEventsCalendar from "../components/ui/AnnualEventsCalendar";
const AnnualVolunteerPage = () => {
  return (
    <>
      <title>Annual Volunteering | Alkem Smile</title>
      <meta name="description" content="Join Alkem Smile's annual volunteering initiatives and events. Make a difference in the community with your participation." />
      <meta name="keywords" content="alkem, annual volunteering, events, community, employee engagement, smile" />
      <AnnualVolunterHero />
      <AnnualEventsCalendar />
      <AnnualVolunteerYearRound />
      <HomeYou />
    </>
  );
};

export default AnnualVolunteerPage;