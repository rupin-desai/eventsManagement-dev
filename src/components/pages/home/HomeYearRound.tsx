import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, AlertCircle } from "lucide-react";
// Removed all API imports
// import { getYearRoundActivities, getActivityImage, convertToDataUrl } from "../../../api/activityApi";
// import type { Activity } from "../../../api/activityApi";
// import { getEventsByYear } from "../../../api/eventApi";
// import type { Event } from "../../../api/eventApi";
import {
  sectionVariants,
  fadeInVariants,
  cardVariants,
  textVariants,
} from "../../../utils/animationVariants";
import EventDetailsModal from "../../ui/modals/EventDetailsModal";

// Dummy Activity type
interface Activity {
  activityId: number;
  name: string;
  subName?: string;
  description?: string;
}

// Dummy Event type
interface Event {
  eventId: number;
  activityId: number;
  name: string;
  subName?: string;
  description?: string;
  tentativeMonth?: string;
  tentativeYear?: string;
  enableConf?: string;
  enableComp?: string;
  enableCert?: string;
  type?: string;
  status?: string;
  finYear?: string;
}

// Dummy activities data
const dummyActivities: Activity[] = [
  {
    activityId: 1,
    name: "Community Clean-Up",
    subName: "Environment",
    description: "Help clean up local parks and public spaces.",
  },
  {
    activityId: 2,
    name: "Literacy Program",
    subName: "Education",
    description: "Volunteer to teach reading and writing skills.",
  },
  {
    activityId: 3,
    name: "Blood Donation Drive",
    subName: "Health",
    description: "Participate in organizing blood donation camps.",
  },
];

// Dummy events data mapped by activityId
const dummyEvents: Record<number, Event[]> = {
  1: [
    {
      eventId: 101,
      activityId: 1,
      name: "Community Clean-Up",
      subName: "Environment",
      description: "Help clean up local parks and public spaces.",
      tentativeMonth: "April",
      tentativeYear: "2025",
      enableConf: "true",
      enableComp: "false",
      enableCert: "true",
      type: "year-round",
      status: "active",
      finYear: "2025-2026",
    },
  ],
  2: [
    {
      eventId: 102,
      activityId: 2,
      name: "Literacy Program",
      subName: "Education",
      description: "Volunteer to teach reading and writing skills.",
      tentativeMonth: "May",
      tentativeYear: "2025",
      enableConf: "true",
      enableComp: "false",
      enableCert: "true",
      type: "year-round",
      status: "active",
      finYear: "2025-2026",
    },
  ],
  3: [
    {
      eventId: 103,
      activityId: 3,
      name: "Blood Donation Drive",
      subName: "Health",
      description: "Participate in organizing blood donation camps.",
      tentativeMonth: "June",
      tentativeYear: "2025",
      enableConf: "true",
      enableComp: "false",
      enableCert: "true",
      type: "year-round",
      status: "active",
      finYear: "2025-2026",
    },
  ],
};

const dummyImages: Record<number, string> = {
  1: "/images/photos/image1.jpeg",
  2: "/images/photos/image2.jpeg",
  3: "/images/photos/image3.jpeg",
};

const HomeYearRound = () => {
  // Use dummy data instead of API
  const [activities] = useState(
    dummyActivities.map((activity) => ({
      ...activity,
      imageDataUrl: dummyImages[activity.activityId],
      imageLoading: false,
      imageError: false,
    }))
  );
  const [error] = useState<string | null>(null);
  const [isLoading] = useState(false);

  // For modal functionality
  const [selectedActivity, setSelectedActivity] =
    useState<typeof activities[0] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Handler for View Details
  const handleViewDetails = (activity: typeof activities[0]) => {
    setSelectedActivity(activity);
    setModalOpen(true);
  };

  return (
    <>
      <motion.section
        className="w-full my-10 flex justify-center pb-10 bg-white relative"
        variants={sectionVariants}
        initial="initial"
        animate="animate"
      >
        <div className="max-w-6xl w-full z-10">
          <motion.div
            className="text-center mb-8 mt-2"
            variants={textVariants.header}
            initial="initial"
            animate="animate"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="h-1 bg-yellow-400 w-14 mr-4"></div>
              <span className="text-gray-700 font-medium tracking-wide uppercase text-sm">
                Continuous Volunteering Opportunities
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-black">
              Year Round Activities
            </h2>
          </motion.div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin mr-3" />
              <span className="text-lg">Loading Activities...</span>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-red-700 mb-2">
                Error Loading Activities
              </h3>
              <p className="text-red-600 mb-4">{error}</p>
            </div>
          ) : activities.length === 0 ? (
            <motion.div
              className="text-center py-10"
              variants={fadeInVariants("up", 0.3)}
              initial="initial"
              animate="animate"
            >
              <p className="text-gray-700 text-lg">
                No activities available at the moment.
              </p>
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
              variants={cardVariants.container}
              initial="initial"
              animate="animate"
            >
              {activities.map((activity) => (
                <motion.div
                  key={activity.activityId}
                  className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col group relative"
                  variants={cardVariants.item}
                  whileHover="hover"
                >
                  <div className="relative">
                    {activity.imageLoading ? (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <div className="text-center">
                          <Loader2 className="w-6 h-6 animate-spin text-gray-400 mx-auto mb-2" />
                          <span className="text-xs text-gray-500">
                            Loading image...
                          </span>
                        </div>
                      </div>
                    ) : activity.imageDataUrl ? (
                      <img
                        src={activity.imageDataUrl}
                        alt={activity.name.trim()}
                        className="w-full h-42 object-contain"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <div className="text-center text-gray-500">
                          <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                          <span className="text-sm">No image available</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div
                    className="px-5 flex flex-col flex-grow relative"
                    style={{ minHeight: 130 }}
                  >
                    <h3 className="font-semibold text-gray-900 mb-3 text-lg">
                      {activity.name.trim()}
                    </h3>
                    {/* Spacer to reserve space for the button */}
                    <div style={{ maxHeight: 10 }} />
                    {/* Absolute View Details Button at bottom right, always below the title */}
                    <button
                      className="absolute bottom-5 right-5 bg-yellow-500 text-white px-4 py-2 rounded-lg cursor-pointer shadow-lg font-semibold text-sm transition-all duration-150 hover:shadow-2xl active:scale-95"
                      onClick={() => handleViewDetails(activity)}
                    >
                      View Details
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.section>
      {/* Modal at root level */}
      <EventDetailsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        event={
          selectedActivity
            ? (
                dummyEvents[selectedActivity.activityId]?.[0] ||
                {
                  eventId: 0,
                  activityId: selectedActivity.activityId,
                  name: selectedActivity.name,
                  subName: selectedActivity.subName,
                  description: selectedActivity.description,
                  tentativeMonth: "",
                  tentativeYear: "",
                  enableConf: "false",
                  enableComp: "false",
                  enableCert: "false",
                  type: "",
                  status: "",
                  finYear: "",
                }
              )
            : {
                eventId: 0,
                activityId: 0,
                name: "",
                subName: "",
                description: "",
                tentativeMonth: "",
                tentativeYear: "",
                enableConf: "false",
                enableComp: "false",
                enableCert: "false",
                type: "",
                status: "",
                finYear: "",
              }
        }
        selectedMonth={
          selectedActivity
            ? dummyEvents[selectedActivity.activityId]?.[0]?.tentativeMonth
            : undefined
        }
        tentativeYear={
          selectedActivity
            ? dummyEvents[selectedActivity.activityId]?.[0]?.tentativeYear
            : undefined
        }
        tentativeMonth={
          selectedActivity
            ? dummyEvents[selectedActivity.activityId]?.[0]?.tentativeMonth
            : undefined
        }
        isYearRound={true}
        eventImageUrl={selectedActivity?.imageDataUrl ?? null}
      />
    </>
  );
};

export default HomeYearRound;
