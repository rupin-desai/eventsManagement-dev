import { motion } from "framer-motion";
import {
  sectionVariants,
  fadeInVariants,
} from "../../../utils/animationVariants";
import CustomButton from "../../ui/CustomButton";

const NAVBAR_HEIGHT = 70; // px
const BASE_URL = import.meta.env.BASE_URL || "/";

const WeCareHero = () => {
  // Scroll to the calendar section with id="we-care-calendar"
  const handleScrollToCalendar = () => {
    const el = document.getElementById("we-care-calendar");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <motion.section
      className="w-full bg-white py-16 md:py-12 px-4 md:px-24 relative overflow-hidden flex items-center"
      style={{ minHeight: `calc(70vh - ${NAVBAR_HEIGHT}px)` }}
      variants={sectionVariants}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="relative z-10 max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-8 md:gap-12 h-full justify-center">
        {/* Left: Text Content */}
        <motion.div
          className="flex-1 space-y-6"
          variants={fadeInVariants("left", 0.1)}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-0.5 bg-gray-400"></div>
              <span className="text-sm font-medium  text-gray-600 uppercase tracking-wider">
                VOLUNTEERING MONTH
              </span>
            </div>
            <div className="relative inline-block">
              <h2 className="text-3xl md:text-4xl lg:text-4xl font-bold text-gray-900">
                About "We Care Month"
              </h2>
              {/* SVG Underline */}
              <img
                src={`${BASE_URL}graphics/smile_underline.svg`}
                alt="underline"
                className="absolute left-50 -bottom-6 w-[120px] h-auto"
                style={{ pointerEvents: "none" }}
              />
            </div>
          </div>

          {/* One-line description */}
          <div className="text-lg md:text-xl text-gray-700 font-semibold">
            A month-long celebration of giving back, where Alkemites across India
            unite to volunteer and make a difference.
          </div>

          {/* Moved button here */}
          <div className="mt-8 cursor-pointer flex">
            <CustomButton
              variant="secondary"
              size="lg"
              onClick={handleScrollToCalendar}
              ariaLabel="View Volunteering Opportunities"
            >
              View Volunteering Opportunities
            </CustomButton>
          </div>
        </motion.div>
        {/* Right: Image */}
        <motion.div
          className="flex-1 flex justify-center"
          variants={fadeInVariants("right", 0.2)}
        >
          <div className="w-full max-w-md">
            <img
              src={`${BASE_URL}images/photos/image25.jpeg`}
              alt="We Care Month"
              className="rounded-2xl shadow-sm w-full h-auto object-cover"
            />
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default WeCareHero;
