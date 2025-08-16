import { motion } from "framer-motion";
import {
  sectionVariants,
  fadeInVariants,
} from "../../../utils/animationVariants";
import CustomButton from "../../ui/CustomButton";

const BASE_URL = import.meta.env.BASE_URL || "/";

const HomeAbout = () => {
  return (
    <motion.section
      className="py-8 md:py-14 px-4 sm:px-8 md:px-16 lg:px-24 mt-6"
      style={{ backgroundColor: '#F4D03F' }}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.3 }}
      variants={sectionVariants}
    >
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Content */}
          <motion.div
            className="space-y-6"
            variants={fadeInVariants("left", 0.2)}
          >
            {/* Section Header */}
            <div className="space-y-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-0.5 bg-white"></div>
                <span className="text-sm font-medium text-gray-900 uppercase tracking-wider">
                  KNOW ABOUT US
                </span>
              </div>

              {/* Centrally aligned "What is" with SMILE image */}
              <div className="flex items-center justify-start gap-2 flex-wrap">
                <span className="text-3xl md:text-4xl lg:text-6xl mt-8 mr-2 font-bold text-gray-900">
                  What is
                </span>
                <span className="relative inline-block align-middle">
                  <img
                    src={`${BASE_URL}logos/smile_logo.png`}
                    alt="SMILE"
                    className="inline-block h-20 sm:h-28 md:h-[7.5em] md:-mt-4 w-auto align-middle"
                    style={{ verticalAlign: "middle" }}
                  />
                </span>
                <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mt-7">?</span>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-4 text-gray-900">
              <p className="text-base leading-relaxed">
                <strong className="text-black">
                  <span className="text-white">S</span>
                  <span className="text-white">M</span>
                  <span className="text-white">I</span>
                  <span className="text-white">L</span>
                  <span className="text-white">E</span>
                  {" "}
                  <span className="text-black">
                    ( <span className="text-white">S</span>upport to <span className="text-white">M</span>ake <span className="text-white">I</span>ndividual <span className="text-white">L</span>ives <span className="text-white">E</span>asier )
                  </span>
                </strong>{" "}
                is Alkem Foundation's flagship employee volunteering initiative, inspiring Alkemites to contribute meaningfully to society.
              </p>

              <ul className="list-disc pl-6 space-y-2 text-base leading-relaxed">
                <li>
                  Empowers employees to dedicate their <strong>time, skills, and passion</strong> to create a positive and lasting difference in the communities we serve.
                </li>
                <li>
                  <strong>Countless ways to make an impact</strong>—from hands-on volunteering to supporting community initiatives.
                </li>
              </ul>

              {/* Highlighted "What's in it for You?" */}
              <div className="pt-4">
                <div className="bg-yellow-200 border-l-4 border-yellow-500 rounded-lg px-4 py-3 mb-2">
                  <p className="text-lg font-bold text-black mb-1">
                    What’s in it for You?
                  </p>
                  <p className="text-base text-gray-900">
                    Your Time, Skills and Passion — put to meaningful use
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <motion.div className="pt-4" variants={fadeInVariants("up", 0.4)}>
              <CustomButton
                to="/about"
                variant="secondary"
                size="lg"
                ariaLabel="Learn more about SMILE program"
              >
                Learn More
              </CustomButton>
            </motion.div>
          </motion.div>

          {/* Right Image/Video */}
          <motion.div
            className="relative mt-8 lg:mt-0"
            variants={fadeInVariants("right", 0.3)}
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl w-full">
              <img
                src={`${BASE_URL}images/homePage/About-us.JPG`}
                alt="SMILE community volunteers helping with disaster relief"
                className="w-full h-56 sm:h-72 md:h-[400px] lg:h-[500px] object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default HomeAbout;