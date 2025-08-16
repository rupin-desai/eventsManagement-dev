import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import WeCareHero from "../components/pages/weCare/WeCareHero";
import WeCareWhyAugust from "../components/pages/weCare/weCareWhyAugust";
import WeCareCalendar from "../components/pages/weCare/weCareCalendar";
import HomeYou from "../components/pages/home/HomeYou";

const WeCareMonthPage = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash === "#we-care-calendar") {
      const el = document.getElementById("we-care-calendar");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [location]);

  return (
    <>
      <title>We Care Month | Alkem Smile Volunteering</title>
      <meta name="description" content="Celebrate We Care Month with Alkem Smile. Discover special August volunteering activities, events, and opportunities for employees." />
      <meta name="keywords" content="alkem, we care month, august, volunteering, events, activities, smile" />
      <div className="overflow-hidden">
        <WeCareHero />
        <WeCareWhyAugust />
        <WeCareCalendar />
        <HomeYou />
      </div>
    </>
  );
};

export default WeCareMonthPage;