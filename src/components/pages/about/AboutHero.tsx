import { motion } from "framer-motion";
import {
  sectionVariants,
  fadeInVariants,
} from "../../../utils/animationVariants";
import CustomButton from "../../ui/CustomButton";

const BASE_URL = import.meta.env.BASE_URL || "/";
const NAVBAR_HEIGHT = 70; // px

const AboutHero = () => (
  <motion.section
    className="w-full bg-white py-10 md:py-12 px-4 md:px-24 relative overflow-hidden flex flex-col md:flex-row items-center"
    style={{ minHeight: `calc(100vh - ${NAVBAR_HEIGHT}px)` }}
    variants={sectionVariants}
    initial="initial"
    whileInView="animate"
    viewport={{ once: true, amount: 0.3 }}
  >
    <div className="relative z-10 max-w-6xl mx-auto px-0 sm:px-4 flex flex-col md:flex-row items-center gap-8 md:gap-12 h-full justify-center w-full">
      {/* Left: Text Content */}
      <motion.div
        className="flex-1 w-full space-y-6"
        variants={fadeInVariants("left", 0.1)}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-10 sm:w-12 h-0.5 bg-yellow-400"></div>
            <span className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
              KNOW ABOUT US
            </span>
          </div>
          {/* Centrally aligned "What is" with SMILE logo image */}
          <div className="flex items-center justify-left gap-2">
            <span className="text-3xl md:text-4xl lg:text-6xl mt-7 mr-2 font-bold text-black">
              What is
            </span>
            <span className="relative inline-block align-middle">
              <img
                src={`${BASE_URL}logos/smile_logo.png`}
                alt="SMILE"
                className="inline-block h-[7.5em] -mt-4 w-auto align-middle"
                style={{ verticalAlign: "middle" }}
              />
            </span>
            <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-black">
              ?
            </span>
          </div>
        </div>

        <div className="space-y-4 text-gray-600">
          <p className="text-base leading-relaxed">
            <strong className="text-gray-900">
              <span className="text-yellow-500">S</span>
              <span className="text-yellow-500">M</span>
              <span className="text-yellow-500">I</span>
              <span className="text-yellow-500">L</span>
              <span className="text-yellow-500">E</span>{" "}
              <span className="text-gray-900">
                ( <span className="text-yellow-500">S</span>upport to{" "}
                <span className="text-yellow-500">M</span>ake{" "}
                <span className="text-yellow-500">I</span>ndividual{" "}
                <span className="text-yellow-500">L</span>ives{" "}
                <span className="text-yellow-500">E</span>asier )
              </span>
            </strong>{" "}
            is Alkem Foundation's flagship employee volunteering initiative,
            inspiring Alkemites to contribute meaningfully to society.
          </p>

          <ul className="list-disc pl-6 space-y-2 text-base leading-relaxed">
            <li>
              Empowers employees to dedicate their{" "}
              <strong>time, skills, and passion</strong> to create a positive
              and lasting difference in the communities we serve.
            </li>

            <li>
              <strong>Countless ways to make an impact</strong>—from hands-on
              volunteering to supporting community initiatives.
            </li>
          </ul>

          {/* Highlighted "What's in it for You?" */}
          <div className="pt-4">
            <div className="bg-yellow-100 border-l-4 border-yellow-400 rounded-lg px-4 py-3 mb-2">
              <p className="text-lg font-bold text-yellow-800 mb-1">
                What’s in it for You?
              </p>
              <p className="text-base text-gray-800">
                Your Time, Skills and Passion — put to meaningful use
              </p>
            </div>
          </div>
        </div>

        {/* Volunteer Now Button moved here */}
        <div className="flex justify-start mt-6">
          <CustomButton
            to="/volunteer"
            variant="secondary"
            size="lg"
            ariaLabel="Join As A Volunteer Now!"
          >
            Join As A Volunteer Now!
          </CustomButton>
        </div>
      </motion.div>
      {/* Right: Image */}
      <motion.div
        className="flex-1 flex justify-center w-full max-w-xs sm:max-w-md md:max-w-lg"
        variants={fadeInVariants("right", 0.2)}
      >
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl w-full max-w-xs sm:max-w-md md:max-w-lg">
          <img
            src={`${BASE_URL}images/homePage/About-us.JPG`}
            alt="SMILE community volunteers helping with disaster relief"
            className="w-full h-56 sm:h-80 md:h-[500px] object-cover"
          />
        </div>
      </motion.div>
    </div>
  </motion.section>
);

export default AboutHero;
