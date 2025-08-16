import { motion } from "framer-motion";
import {
  sectionVariants,
  fadeInVariants,
} from "../../../utils/animationVariants";

const BASE_URL = import.meta.env.BASE_URL || "/";
const weCareImage = `${BASE_URL}/wecare.png`;

const WeCareWhyAugust = () => {
  return (
    <motion.section
      className="w-full overflow-hidden bg-[#FBD336] py-12 px-8 md:px-24 relative"
      initial="initial"
      animate="animate"
      variants={sectionVariants}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
        {/* Left: Text */}
        <motion.div className="flex-1" variants={fadeInVariants("left", 0.1)}>
          {/* Title with dash and subtext */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-0.5 bg-gray-700" />
              <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Learn More
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Why August?
            </h2>
            <p className="text-lg md:text-xl text-gray-800 leading-relaxed">
              August is a special month for Alkem, marking our Foundation Day
              and the birth anniversaries of our visionary founders.
            </p>
          </div>

          {/* Enhanced "It aligns with" section */}
          <div className="mb-0">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              It aligns with:
            </h3>
            <div className="space-y-6">
              {/* Foundation Day Card */}
              <motion.div
                className="bg-gradient-to-r from-white/90 to-yellow-50/90 border-l-4 border-red-500 rounded-lg px-6 py-4 shadow-lg backdrop-blur-sm"
                variants={fadeInVariants("up", 0.1)}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              >
                <div className="flex items-start">
                  <div className="w-4 h-4 bg-red-500 rounded-full mt-3 mr-4 flex-shrink-0 shadow-sm"></div>
                  <div>
                    <span className="text-xl md:text-2xl font-bold text-gray-900 leading-relaxed block">
                      Organization’s Foundation Day (8th August)
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Birth Anniversaries Card */}
              <motion.div
                className="bg-gradient-to-r from-yellow-50/90 to-white/90 border-l-4 border-red-500 rounded-lg px-6 py-4 shadow-lg backdrop-blur-sm"
                variants={fadeInVariants("up", 0.2)}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              >
                <div className="flex items-start">
                  <div className="w-4 h-4 bg-red-500 rounded-full mt-3 mr-4 flex-shrink-0 shadow-sm"></div>
                  <div>
                    <span className="text-xl md:text-2xl font-bold text-gray-900 leading-relaxed block mb-2">
                      Birth anniversary of our beloved Founder & Chairman Emeritus, Late
                      Shri Samprada Singh, and celebrate the birthday of our
                      Co-founder and Executive Chairman, Shri B.N. Singh.{" "}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Right: Image */}
        <motion.div
          className="flex-1 flex justify-center bg-white rounded-xl"
          variants={fadeInVariants("right", 0.2)}
        >
          <img
            src={weCareImage}
            alt="Why August"
            className="rounded-xl w-full max-w-xl h-96 md:h-[500px] z-40 object-cover shadow-xl"
          />
        </motion.div>
      </div>

      {/* Who Can Participate - Clean centered section */}
      <motion.div
        className="max-w-3xl mx-auto mt-16 mb-8 relative"
        variants={fadeInVariants("up", 0.4)}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        {/* Decorative arrow on the left */}
        <img
          src={`${BASE_URL}graphics/arrow_Y_BG.svg`}
          alt="arrow decoration"
          className="absolute -left-52 top-1/2 transform -translate-y-1/2 -translate-x-8 h-52 z-10"
          style={{ pointerEvents: "none" }}
        />

        {/* Decorative arrow on the right (mirrored) */}
        <img
          src={`${BASE_URL}graphics/arrow_Y_BG.svg`}
          alt="arrow decoration"
          className="absolute -right-52 top-1/2 transform -translate-y-1/2 translate-x-8 h-52 z-10 scale-x-[-1]"
          style={{ pointerEvents: "none" }}
        />

        <div className="bg-yellow-100 border-2 border-yellow-600 rounded-2xl px-6 py-5 shadow-2xl text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-yellow-800 mb-3">
            Who Can Participate?
          </h3>
          <div className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
            Alkemites, families &amp; friends
          </div>
          <div className="w-24 h-1 bg-yellow-600 mx-auto rounded-full"></div>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default WeCareWhyAugust;
