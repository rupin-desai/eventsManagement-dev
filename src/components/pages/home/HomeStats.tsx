import { PartyPopper, MapPin, Clock, Users } from 'lucide-react'
import CountUp from 'react-countup'
import { useRef } from 'react'
import { useInView, motion } from 'framer-motion'
import { sectionVariants, staggerChildrenVariants } from '../../../utils/animationVariants'

const stats = [
  {
    icon: <PartyPopper size={40} className="text-white" />, // Larger icon
    value: 18,
    suffix: '+',
    decimals: 0,
    label: "Activities"
  },
  {
    icon: <MapPin size={40} className="text-white" />,
    value: 9,
    suffix: '+',
    decimals: 0,
    label: "Cities"
  },
  {
    icon: <Clock size={40} className="text-white" />,
    value: 3163,
    suffix: '+',
    decimals: 0,
    label: "Total Hours"
  },
  {
    icon: <Users size={40} className="text-white" />,
    value: 40,
    suffix: 'K+',
    decimals: 0,
    label: "Impacted"
  }
]

const HomeStats = () => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.section
      className="w-full py-6 md:py-8"
      style={{ background: '#FBD336' }}
      variants={sectionVariants}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div
        ref={ref}
        className="flex flex-col md:flex-row justify-center items-center max-w-5xl mx-auto divide-y-2 md:divide-y-0 md:divide-x-2 divide-white/40"
      >
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            className="flex items-center justify-center px-6 py-4 text-center flex-1 w-full"
            variants={staggerChildrenVariants(0.12)(i)}
            initial="initial"
            animate={inView ? "animate" : "initial"}
          >
            {/* Icon at left */}
            <div className="flex-shrink-0 mr-4 flex items-center justify-center bg-yellow-400 rounded-full w-16 h-16 shadow-lg">
              {stat.icon}
            </div>
            {/* Number and label at right */}
            <div className="flex flex-col items-start">
              <div className="text-4xl font-extrabold text-white mb-1 leading-none">
                {inView && (
                  <CountUp
                    end={stat.value}
                    duration={1.2}
                    separator=","
                    suffix={stat.suffix}
                    decimals={stat.decimals}
                  />
                )}
              </div>
              <div className="text-lg text-white font-medium">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}

export default HomeStats