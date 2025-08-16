import { MapPin, Clock, Loader2, Calendar, Info } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { sectionVariants, staggerChildrenVariants } from '../../../utils/animationVariants'
import EventDetailsModal from '../../ui/modals/EventDetailsModal'

const BASE_URL = import.meta.env.BASE_URL || "/";

// Dummy Event type
interface Event {
  eventId: number;
  activityId?: number;
  name: string;
  subName?: string;
  description?: string;
  tentativeMonth: string;
  tentativeYear: string;
  enableConf?: string;
  enableComp?: string;
  enableCert?: string;
  type?: string;
  status?: string;
  finYear?: string;
}

// Dummy ProcessedEvent type
interface ProcessedEvent {
  eventId: number;
  activityId?: number;
  date: { day: string; month: string; year: string };
  title: string;
  subtitle?: string;
  time: string;
  day: string;
  location: string;
  image: string;
  eventDate: Date;
  tentativeMonth: string;
  tentativeYear: string;
  closestLocation?: {
    date: string;
    time: string;
    location: string;
  };
}

// Dummy events data
const dummyEvents: Event[] = [
  {
    eventId: 1,
    name: 'Community Service Initiative',
    subName: 'Volunteer Program',
    description: 'Serve your community with pride.',
    tentativeMonth: '7',
    tentativeYear: '2025',
    type: 'annual',
  },
  {
    eventId: 2,
    name: 'Environmental Awareness Drive',
    subName: 'Go Green Initiative',
    description: 'Promote environmental awareness.',
    tentativeMonth: '7',
    tentativeYear: '2025',
    type: 'annual',
  },
  {
    eventId: 3,
    name: 'Health & Wellness Campaign',
    subName: 'Community Outreach',
    description: 'Support health and wellness in your area.',
    tentativeMonth: '8',
    tentativeYear: '2025',
    type: 'annual',
  }
];

// Dummy processed events
const dummyProcessedEvents: ProcessedEvent[] = [
  {
    eventId: 1,
    date: { day: '15', month: 'Jul', year: '2025' },
    title: 'Community Service Initiative',
    subtitle: 'Volunteer Program',
    time: '9:00 AM - 1:00 PM',
    day: 'Tuesday',
    location: 'Mumbai',
    image: `${BASE_URL}images/photos/image2.jpeg`,
    eventDate: new Date(2025, 6, 15),
    tentativeMonth: '7',
    tentativeYear: '2025',
    closestLocation: {
      date: '15 Jul 2025',
      time: '9:00 AM - 1:00 PM',
      location: 'Mumbai'
    }
  },
  {
    eventId: 2,
    date: { day: '22', month: 'Jul', year: '2025' },
    title: 'Environmental Awareness Drive',
    subtitle: 'Go Green Initiative',
    time: '8:30 AM - 12:30 PM',
    day: 'Tuesday',
    location: 'Baddi',
    image: `${BASE_URL}images/photos/image3.jpeg`,
    eventDate: new Date(2025, 6, 22),
    tentativeMonth: '7',
    tentativeYear: '2025',
    closestLocation: {
      date: '22 Jul 2025',
      time: '8:30 AM - 12:30 PM',
      location: 'Baddi'
    }
  },
  {
    eventId: 3,
    date: { day: '05', month: 'Aug', year: '2025' },
    title: 'Health & Wellness Campaign',
    subtitle: 'Community Outreach',
    time: '10:00 AM - 2:00 PM',
    day: 'Tuesday',
    location: 'Sikkim',
    image: `${BASE_URL}images/photos/image14.jpeg`,
    eventDate: new Date(2025, 7, 5),
    tentativeMonth: '8',
    tentativeYear: '2025',
    closestLocation: {
      date: '05 Aug 2025',
      time: '10:00 AM - 2:00 PM',
      location: 'Sikkim'
    }
  }
];

const HomeUpcoming = () => {
  const [selected, setSelected] = useState(0);
  const [events] = useState<ProcessedEvent[]>(dummyProcessedEvents);
  const [rawEvents] = useState<Event[]>(dummyEvents);
  const [modalOpen, setModalOpen] = useState(false);
  const [eventDetails, setEventDetails] = useState<Event | null>(null);

  // Loading state (never true in static version)
  const loading = false;
  const error = null;

  // Loading state
  if (loading) {
    return (
      <motion.section
        className="w-full py-10 md:py-16 bg-white"
        variants={sectionVariants}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            className="mb-8"
            variants={staggerChildrenVariants(0.08)(0)}
          >
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-0.5 bg-gray-400"></div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                NEXT ON THE CALENDAR
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Upcoming Events</h2>
          </motion.div>
          
          <div className="flex items-center justify-center py-16">
            <div className="flex items-center gap-3 text-gray-600">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Loading upcoming events...</span>
            </div>
          </div>
        </div>
      </motion.section>
    );
  }

  // Error state
  if (error && events.length === 0) {
    return (
      <motion.section
        className="w-full py-10 md:py-16 bg-white"
        variants={sectionVariants}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            className="mb-8"
            variants={staggerChildrenVariants(0.08)(0)}
          >
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-0.5 bg-gray-400"></div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                NEXT ON THE CALENDAR
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Upcoming Events</h2>
          </motion.div>
          
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-600 mb-2">Unable to load upcoming events</p>
            <button
              className="text-[#BB1F2F] hover:text-[#9A1B29] font-medium"
            >
              Try again
            </button>
          </div>
        </div>
      </motion.section>
    );
  }

  // No events state
  if (events.length === 0) {
    return (
      <motion.section
        className="w-full py-10 md:py-16 bg-white"
        variants={sectionVariants}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            className="mb-8"
            variants={staggerChildrenVariants(0.08)(0)}
          >
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-0.5 bg-gray-400"></div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                NEXT ON THE CALENDAR
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Upcoming Events</h2>
          </motion.div>
          
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-600">No upcoming events scheduled at the moment</p>
            <p className="text-sm text-gray-500 mt-1">Check back later for new events!</p>
          </div>
        </div>
      </motion.section>
    );
  }

  // Main content with events
  return (
    <>
      {/* Event Details Modal rendered at the root, outside the section */}
      {eventDetails && (
        <EventDetailsModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          event={eventDetails}
          selectedMonth={eventDetails.tentativeMonth}
          tentativeYear={eventDetails.tentativeYear}
          tentativeMonth={eventDetails.tentativeMonth}
          eventImageUrl={
            // Find the ProcessedEvent for this event and pass its image URL
            events.find(ev => ev.eventId === eventDetails.eventId)?.image ?? undefined
          }
        />
      )}

      <motion.section
        className="w-full py-10 md:py-16 bg-white"
        variants={sectionVariants}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="max-w-5xl mx-auto px-4">
          {/* Header */}
          <motion.div
            className="mb-8"
            variants={staggerChildrenVariants(0.08)(0)}
            initial="initial"
            animate="animate"
          >
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-0.5 bg-yellow-400"></div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                NEXT ON THE CALENDAR
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Upcoming Events</h2>
          </motion.div>

          <div className="flex flex-col md:flex-row gap-6 items-center md:items-center">
            {/* Left: Main Event Image Card */}
            <motion.div
              className="relative flex items-center justify-center max-w-[90vw] md:max-w-full "
              style={{ width: "fit-content", height: "fit-content" }}
              variants={staggerChildrenVariants(0.12)(0)}
              initial="initial"
              animate="animate"
            >
              <img
                src={events[selected].image}
                alt={events[selected].title}
                className="object-contain rounded-2xl block"
                style={{ maxWidth: 400, maxHeight: "80vh", width: "auto", height: "auto" }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `${BASE_URL}images/photos/image2.jpeg`;
                }}
              />

              {/* Date Badge */}
              <motion.div
                className="absolute top-4 right-4 bg-[#BB1F2F] text-white rounded-lg px-4 py-2 flex flex-col items-center shadow-md"
                variants={staggerChildrenVariants(0.12)(1)}
              >
                {events[selected].closestLocation?.date ? (
                  <>
                    <span className="text-xl font-bold leading-none">
                      {
                        // Extract day from closestLocation.date (format: dd MMM yyyy)
                        events[selected].closestLocation.date.split(" ")[0]
                      }
                    </span>
                    <span className="text-xs uppercase">
                      {
                        // Extract month from closestLocation.date
                        events[selected].closestLocation.date.split(" ")[1]
                      }
                    </span>
                    <span className="text-xs">
                      {
                        // Extract year from closestLocation.date
                        events[selected].closestLocation.date.split(" ")[2]
                      }
                    </span>
                  </>
                ) : (
                  // Hide badge if no location date
                  <span className="hidden"></span>
                )}
              </motion.div>

              {/* Event Info Overlay */}
              <motion.div
                className="absolute left-0 bottom-0 w-full bg-gradient-to-t from-black/70 to-transparent rounded-b-2xl p-4"
                variants={staggerChildrenVariants(0.12)(2)}
              >
                <div className="text-white font-semibold text-lg mb-1">
                  {events[selected].title}
                  {events[selected].subtitle && (
                    <div className="text-sm text-white/90 font-normal mt-1">
                      {events[selected].subtitle}
                    </div>
                  )}
                </div>
                {/* Show closest event location info if available */}
                {events[selected].closestLocation ? (
                  <div className="flex flex-col gap-1 text-xs text-white/90 mb-1">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="inline-block mr-1" />
                      {events[selected].closestLocation.date}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="inline-block mr-1" />
                      {events[selected].closestLocation.time}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="inline-block mr-1" />
                      {events[selected].closestLocation.location}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-xs text-white/90 mb-1">
                    <Clock size={14} className="inline-block mr-1" />
                    {events[selected].time}
                    <span className="mx-1">•</span>
                    {events[selected].day}
                  </div>
                )}
              </motion.div>
            </motion.div>

            {/* Right: Upcoming List */}
            <div className="flex-1 flex flex-col gap-4">
              {events.map((event, idx) => {
                const isSelected = selected === idx;
                return (
                  <motion.div
                    key={event.eventId}
                    className={`flex items-center gap-3 cursor-pointer transition-all relative`}
                    variants={staggerChildrenVariants(0.12)(3 + idx)}
                    initial="initial"
                    animate="animate"
                    onClick={() => setSelected(idx)}
                  >
                    <div className={`flex flex-col items-center`}>
                      <div
                        className={`rounded-lg px-3 py-2 flex flex-col items-center shadow-sm font-bold transition-all
                          ${isSelected ? "bg-[#BB1F2F] text-white" : "bg-white text-[#BB1F2F] border border-[#BB1F2F]"}`}
                      >
                        {/* Show day only if available */}
                        {event.closestLocation?.date ? (
                          <span className="text-lg leading-none">
                            {event.closestLocation.date.split(" ")[0]}
                          </span>
                        ) : (
                          <span className="hidden"></span>
                        )}
                        <span className="text-xs uppercase">{event.date.month}</span>
                        <span className="text-[10px]">{event.date.year}</span>
                      </div>
                    </div>
                    <div
                      className={`flex-1 rounded-lg px-4 py-3 shadow-sm border transition-all
                        ${isSelected
                          ? "bg-[#BB1F2F] text-white border-[#BB1F2F]"
                          : "bg-white text-[#1a1a1a] border-gray-100 hover:border-[#BB1F2F]/20"
                        }`}
                    >
                      <div className="font-semibold text-base mb-1">
                        {event.title}
                        {event.subtitle && (
                          <div className={`text-sm font-normal mt-1 ${isSelected ? "text-white/90" : "text-gray-600"}`}>
                            {event.subtitle}
                          </div>
                        )}
                      </div>
                      {/* Show closest event location info if available */}
                      {event.closestLocation ? (
                        <div className={`flex flex-col gap-1 text-xs ${isSelected ? "text-white/90" : "text-gray-700"}`}>
                          <div className="flex items-center gap-2">
                            <Calendar size={13} className="inline-block mr-1" />
                            {event.closestLocation.date}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock size={13} className="inline-block mr-1" />
                            {event.closestLocation.time}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin size={13} className="inline-block mr-1" />
                            {event.closestLocation.location}
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className={`flex items-center gap-2 text-xs mb-1 ${isSelected ? "text-white/90" : "text-gray-700"}`}>
                            <Clock size={13} className="inline-block mr-1" />
                            {event.time}
                            <span className="mx-1">•</span>
                            {event.day}
                          </div>
                          <div className={`flex items-center gap-2 text-xs ${isSelected ? "text-white/90" : "text-gray-700"}`}>
                            <MapPin size={13} className="inline-block mr-1" />
                            {event.location}
                          </div>
                        </>
                      )}
                      {/* View Details Button at absolute bottom right */}
                      <button
                        className={`
                          absolute right-4 bottom-3 flex items-center gap-1 text-xs font-semibold cursor-pointer
                          transition
                          ${isSelected
                            ? "text-white hover:underline"
                            : "text-[#BB1F2F] hover:underline"
                          }
                          bg-transparent p-0 border-none shadow-none
                        `}
                        style={{ background: "none" }}
                        onClick={e => {
                          e.stopPropagation();
                          const rawEvent = rawEvents.find(ev => ev.eventId === event.eventId);
                          setEventDetails(rawEvent || null);
                          setModalOpen(true);
                        }}
                      >
                        View Details
                        <Info className="w-3 h-3" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.section>
    </>
  );
};

export default HomeUpcoming;