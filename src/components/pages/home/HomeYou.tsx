import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { sectionVariants, cardVariants } from "../../../utils/animationVariants";

const BASE_URL = import.meta.env.BASE_URL || "/";

const cards = [
  {
    title: "Annual Volunteering",
    description: "Explore the yearly calendar of volunteering opportunities and activities.",
    image: `${BASE_URL}images/homePage/Hero3.JPG`,
    link: "/volunteer"
  },
  {
    title: "Experience Hub",
    description: "Read stories and see submissions from employees across locations and activities.",
    image: `${BASE_URL}images/homePage/About-us.JPG`,
    link: "/experience"
  },
  {
    title: "Achievements",
    description: "View your contributions and the impact of our collective efforts.",
    image: `${BASE_URL}images/photos/image21.jpeg`,
    link: "/achievements"
  }
];

const cardWithHoverVariants: any = {
  ...cardVariants.item,
  hover: {
    ...cardVariants.item?.hover,
    y: -8,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
  initial: {
    ...cardVariants.item?.initial,
    y: 0,
  },
};

const HomeYou = () => (
  <motion.section
    className="pb-8 md:pb-12 px-4 md:px-0"
    initial="initial"
    whileInView="animate"
    viewport={{ once: true, amount: 0.3 }}
    variants={sectionVariants}
  >
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-0.5 bg-yellow-400"></div>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            QUICK LINKS
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Explore More
        </h2>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {cards.map((card) => (
          <motion.div
            key={card.title}
            className="relative rounded-2xl overflow-hidden shadow-lg group min-h-[260px] flex flex-col justify-end"
            style={{ backgroundImage: `url(${card.image})`, backgroundSize: "cover", backgroundPosition: "center" }}
            variants={cardWithHoverVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
          >
            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-all duration-300" />
            <div className="relative z-10 p-6 flex flex-col h-full justify-end">
              <h3 className="text-white text-xl font-bold mb-2">{card.title}</h3>
              <p className="text-white text-sm mb-4">{card.description}</p>
              <Link
                to={card.link}
                className="inline-block bg-white text-gray-900 font-semibold px-4 py-2 rounded transition hover:bg-gray-100"
              >
                Go to {card.title}
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom Banner Card */}
      <motion.div
        className="relative rounded-2xl overflow-hidden shadow-lg min-h-[180px] flex items-center justify-center"
        style={{ backgroundImage: `url(${BASE_URL}images/homePage/Cta.jpeg)`, backgroundSize: "cover", backgroundPosition: "center" }}
        variants={cardVariants.item}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex flex-col items-center justify-center w-full py-10">
          <div className="text-white text-2xl md:text-3xl font-bold text-center mb-6 max-w-2xl">
            Join us and volunteer in our upcoming events to make a difference today!
          </div>
          <div className="flex gap-4">
            <Link
              to="/volunteer"
              className="bg-[#FBD336] text-gray-900 font-semibold px-6 py-2 rounded shadow hover:bg-yellow-300 transition"
            >
              Join as a volunteer
            </Link>

          </div>
        </div>
      </motion.div>
    </div>
  </motion.section>
);

export default HomeYou;