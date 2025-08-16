import { motion } from "framer-motion";
import { sectionVariants, textVariants } from "../utils/animationVariants";

// Add base URL for public assets
const BASE_URL = import.meta.env.BASE_URL || "/";

const ContactPage = () => (
  <>
    <title>Contact Alkem Smile | Volunteering Events Support</title>
    <meta name="description" content="Contact Alkem Smile for volunteering event queries, support, and partnership opportunities. We're here to help you make a difference." />
    <meta name="keywords" content="alkem, contact, volunteering, support, partnership, events, smile" />
    <motion.div
      className="min-h-[70vh] bg-white flex flex-col items-center justify-center py-16 px-4"
      initial="initial"
      animate="animate"
      variants={sectionVariants}
    >
      <div className="max-w-xl w-full flex flex-col items-center">
        {/* Dash and subheader */}
        <motion.div
          className="flex items-center gap-3 mb-2"
          variants={textVariants.title}
          initial="initial"
          animate="animate"
        >
          <div className="w-8 h-0.5 bg-yellow-400" />
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Get in Touch
          </span>
        </motion.div>
        {/* Title with underline */}
        <motion.h1
          className="text-3xl md:text-4xl font-bold text-black text-center whitespace-nowrap relative mb-8"
          variants={textVariants.header}
          initial="initial"
          animate="animate"
        >
          Contact Us
          <img
            src={`${BASE_URL}graphics/smile_underline.svg`}
            alt="underline"
            className="absolute left-1/2 -translate-x-1/2 -bottom-6 w-[120px] h-auto"
            style={{ pointerEvents: "none" }}
          />
        </motion.h1>
        {/* Contact Info */}
        <motion.div
          className="text-lg text-gray-700 text-center mt-8"
          variants={textVariants.description}
          initial="initial"
          animate="animate"
        >
          For more queries contact us at <br />
          <a
            href="mailto:csr@alkem.com"
            className="inline-block text-xl mt-2 font-semibold text-black hover:underline"
          >
            csr@alkem.com
          </a>
        </motion.div>
      </div>
    </motion.div>
  </>
);

export default ContactPage;
