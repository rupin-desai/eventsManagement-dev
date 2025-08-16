import { motion } from "framer-motion";
import { fadeInVariants } from "../../../utils/animationVariants";

const BASE_URL = import.meta.env.BASE_URL || "/";

const AboutBanner = () => (
  <motion.section
    className="w-full flex justify-center bg-transparent"
    variants={fadeInVariants("up", 0.1)}
    initial="initial"
    whileInView="animate"
    viewport={{ once: true, amount: 0.3 }}
  >
    <div className="w-full max-w-3xl pt-4">
      <div className="rounded-xl px-2 sm:px-4 md:px-8 pt-4 pb-6 flex flex-col items-center">
        {/* Title with yellow, thick dashes */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-6 w-full">
          <span className="flex-1 h-2 bg-yellow-400 w-[40px] sm:w-[80px] md:w-[100px] rounded-full" />
          <span className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-900 text-center whitespace-nowrap flex items-center gap-2">
            Who Can Be A&nbsp;
            <img
              src={`${BASE_URL}logos/smile_logo.png`}
              alt="SMILE"
              className="inline-block h-[3em] w-auto -mt-7 align-middle"
              style={{ verticalAlign: "middle" }}
            />
            &nbsp;Ambassador?
          </span>
          <span className="flex-1 h-2 bg-yellow-400 w-[40px] sm:w-[80px] md:w-[100px] rounded-full" />
        </div>
        {/* Highlighted container for Alkemites & Family section */}
        <div className="w-full max-w-lg mx-auto bg-yellow-100 border-2 border-yellow-400 rounded-xl p-5 flex flex-col items-center mb-6 sm:mb-8">
          <div className="text-base sm:text-xl md:text-2xl font-semibold text-gray-800 text-center w-full">
            <span className="font-bold text-yellow-900">Alkemites, </span>
            <span className="font-bold text-yellow-900">Family Members &amp; Friends</span>
          </div>
        </div>
      </div>
    </div>
  </motion.section>
);

export default AboutBanner;