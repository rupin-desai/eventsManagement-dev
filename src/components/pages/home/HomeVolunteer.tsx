import { motion } from 'framer-motion'
import { Building2, Users, Heart, Leaf } from 'lucide-react'
import { 
  sectionVariants, 
  fadeInVariants,
  cardVariants 
} from '../../../utils/animationVariants'

const BASE_URL = import.meta.env.BASE_URL || "/";

const HomeVolunteer = () => {
  const volunteerBenefits = [
    {
      icon: Building2,
      title: "Strengthen community bonds",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros."
    },
    {
      icon: Users,
      title: "Gain leadership & teamwork skills",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros."
    },
    {
      icon: Heart,
      title: "Experience the joy of giving back",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros."
    },
    {
      icon: Leaf,
      title: "Be part of a movement for sustainability",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros."
    }
  ]

  return (
    <motion.section 
      className="py-16 md:py-24 px-24 relative overflow-hidden"
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
        className="absolute -top-10 right-10 w-16 h-16 md:w-55 md:h-55 transform rotate-0"
        initial={{ opacity: 0, scale: 0.5, rotate: 70 }}
        animate={{ opacity: 1, scale: 1, rotate: 90 }}
        transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
      />

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div 
            className="space-y-8"
            variants={fadeInVariants("left", 0.2)}
          >
            {/* Section Header */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-0.5 bg-gray-800"></div>
                <span className="text-sm font-medium text-gray-800 uppercase tracking-wider">
                  WHAT WE DO
                </span>
              </div>
              
              <div className="relative">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                  Why Volunteer?
                </h2>
                
                {/* Arrow decoration to the right of title */}
                <motion.img
                  src={`${BASE_URL}graphics/arrow_Y_BG.svg`}
                  alt="arrow decoration"
                  className="absolute -top-20 -right-32 md:-right-10 w-12 h-12 md:w-48 md:h-48"
                  initial={{ opacity: 0, scale: 0.5, x: -20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
                />
              </div>
              
              <p className="text-base text-gray-700 leading-relaxed max-w-md">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in 
                eros elementum tristique.
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
                  className="flex items-start gap-4"
                  variants={cardVariants.item}
                >
                  {/* Icon */}
                  <div className="flex-shrink-0 w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                    <benefit.icon size={20} className="text-white" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div 
            className="relative"
            variants={fadeInVariants("right", 0.3)}
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src={`${BASE_URL}images/homePage/volunteer.jpeg`} 
                alt="Volunteer wearing a volunteer jacket taking photos"
                className="w-full h-[400px] md:h-[500px] object-cover"
              />
              
              {/* Overlay gradient for better text visibility if needed */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}

export default HomeVolunteer