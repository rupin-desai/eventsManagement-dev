import { motion } from 'framer-motion'
import { Building2, Users, Heart, Leaf } from 'lucide-react'
import { 
  sectionVariants, 
  fadeInVariants,
  cardVariants 
} from '../../../utils/animationVariants'
import CustomButton from '../../ui/CustomButton'

// Add base URL for public assets
const BASE_URL = import.meta.env.BASE_URL || "/";

const AboutVolunteer = () => {
  const volunteerBenefits = [
    {
      icon: Building2,
      title: "Strengthen community bonds",
      description: "Engage with children, elders, and special groups through inclusive activities like health awareness and Awarathon.",
    },
    {
      icon: Users,
      title: "Gain leadership and teamwork skills",
      description: "Boost leadership and teamwork through activities like wall painting or sports with the visually impaired.",
    },
    {
      icon: Heart,
      title: "Experience the joy of giving",
      description: "Find fulfillment in donating essentials—clothes, ration kits, footwear.",
    },
    {
      icon: Leaf,
      title: "Contribute to sustainability",
      description: "Contribute to a greener planet through plantation drives, cleanliness initiatives, and cloth recycling.",
    }
  ]

  return (
    <motion.section 
      className="py-8 md:py-12 mb-12 px-4 sm:px-8 md:px-24 relative overflow-hidden"
      style={{ backgroundColor: '#F4D03F' }}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.3 }}
      variants={sectionVariants}
    >
      {/* Top right smile decoration - rotated 90 degrees */}
      <motion.img
        src={`${BASE_URL}graphics/smile_Y_BG.svg`}
        alt="smile decoration"
        className="absolute -top-0 right-12 w-12 h-12 hidden md:block md:w-16 md:h-16 lg:w-28 lg:h-28"
        initial={{ opacity: 0, scale: 0.5, rotate: 70 }}
        animate={{ opacity: 1, scale: 1, rotate: 90 }}
        transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
      />

      <div className="container mx-auto px-0 sm:px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 items-center">
          {/* Left Content */}
          <motion.div 
            className="space-y-8"
            variants={fadeInVariants("left", 0.2)}
          >
            {/* Section Header */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="w-8 sm:w-12 h-0.5 bg-white"></div>
                <span className="text-xs sm:text-sm font-medium text-gray-700 uppercase tracking-wider">
                  MAKE A DIFFERENCE
                </span>
              </div>
              
              <div className="relative">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                  Why Volunteer?
                </h2>
                
                {/* Arrow decoration to the right of title */}
                <motion.img
                  src={`${BASE_URL}graphics/arrow_Y_BG.svg`}
                  alt="arrow decoration"
                  className="absolute -top-12 right-10  md:-top-14 md:right-32 lg:-top-8 lg:-right-14 xl:-top-16 xl:-right-8 w-28 h-28 md:w-32 md:h-32 lg:w-24 lg:h-24 xl:w-36 xl:h-36"
                  initial={{ opacity: 0, scale: 0.5, x: -20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
                />
              </div>
              
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed max-w-md">
                Volunteering is not just about giving back—it's about growing, connecting, and creating lasting impact together.
              </p>
            </div>

            {/* Benefits List */}
            <motion.div 
              className="space-y-6"
              variants={cardVariants.container}
            >
              {volunteerBenefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-3 sm:gap-4"
                  variants={cardVariants.item}
                >
                  {/* Icon */}
                  <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                    <benefit.icon size={20} className="text-white" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div 
            className="relative w-full"
            variants={fadeInVariants("right", 0.3)}
          >
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl w-full max-w-xs sm:max-w-md md:max-w-full mx-auto">
              <img 
                src={`${BASE_URL}images/homePage/volunteer.jpeg`} 
                alt="Volunteer wearing a volunteer jacket taking photos"
                className="w-full h-48 sm:h-72 md:h-[400px] lg:h-[500px] object-cover"
              />
              {/* Overlay gradient for better text visibility if needed */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </motion.div>
        </div>
        {/* Volunteer Now Button centered below content */}
        <div className="flex justify-center mt-8 md:mt-12">
          <CustomButton
            to="/volunteer"
            variant="secondary"
            size="lg"
            ariaLabel="Join As A Volunteer Now!"
          >
            Explore Opportunities
          </CustomButton>
        </div>
      </div>
    </motion.section>
  )
}

export default AboutVolunteer