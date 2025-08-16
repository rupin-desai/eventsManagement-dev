import { motion } from "framer-motion";
import { sectionVariants, textVariants, fadeInVariants } from "../../../utils/animationVariants";

const BASE_URL = import.meta.env.BASE_URL || "/";

const AnnualVolunterHero = () => (
  <motion.section
    className="w-full bg-white pt-8 pb-4 px-2 sm:px-4 md:px-0"
    initial="initial"
    animate="animate"
    variants={sectionVariants}
  >
    <div className="max-w-5xl mx-auto">
      {/* Title Card */}
      <div className="relative mb-4">
        <motion.div
          className="absolute left-0 top-0 z-10 px-4 py-4 sm:px-6 sm:py-6 bg-white rounded-tl-2xl rounded-br-3xl flex flex-col items-start -ml-2 -mt-4 sm:-ml-8 sm:-mt-8"
          variants={fadeInVariants("down", 0.05)}
          initial="initial"
          animate="animate"
        >
          <motion.div className="flex items-center mb-1" variants={textVariants.title}>
            <span className="inline-block w-6 sm:w-10 h-0.5 bg-yellow-400 mr-2" />
            <span className="text-xs font-semibold text-gray-500 tracking-wide uppercase">
              Volunteering Opportunities
            </span>
          </motion.div>
          <motion.h1
            className="text-sm sm:text-xl md:text-2xl font-bold text-gray-900 leading-tight"
            variants={textVariants.header}
          >
            Explore Opportunities to Make a Difference
          </motion.h1>
        </motion.div>
        {/* Image */}
        <motion.img
          src={`${BASE_URL}images/photos/image18.jpeg`}
          alt="Volunteering on the beach"
          className="rounded-2xl w-full h-48 sm:h-64 md:h-80 object-cover mt-12 sm:mt-10"
          variants={fadeInVariants("up", 0.15)}
          initial="initial"
          animate="animate"
        />
      </div>
    </div>
  </motion.section>
);

export default AnnualVolunterHero;