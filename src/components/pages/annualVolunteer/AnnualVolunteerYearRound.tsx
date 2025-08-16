import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle } from 'lucide-react';
import {
  sectionVariants,
  fadeInVariants,
  cardVariants,
  textVariants,
} from '../../../utils/animationVariants';
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

// Helper function to truncate description till end of "Objective" line or when a <strong> tag is found,
// and keep <strong> content as bold
const truncateTillObjectiveOrStrong = (html: string = ""): React.JSX.Element => {
  const lowerHtml = html.toLowerCase();
  const objIdx = lowerHtml.indexOf("objective");
  let cutHtml = html;

  if (objIdx === -1) {
    // fallback: just return up to first <strong> or first 150 chars
    const strongIdx = lowerHtml.indexOf("<strong>");
    if (strongIdx !== -1) {
      cutHtml = html.substring(0, strongIdx);
    } else {
      cutHtml = html.substring(0, 150) + (html.length > 150 ? "..." : "");
    }
  } else {
    // Find the next <strong> after "Objective"
    const strongIdx = lowerHtml.indexOf("<strong>", objIdx + 1);
    if (strongIdx !== -1) {
      cutHtml = html.substring(0, strongIdx);
    } else {
      // Try to find the end of the paragraph containing "Objective"
      const afterObj = html.substring(objIdx);
      const pCloseIdx = afterObj.indexOf("</p>");
      if (pCloseIdx !== -1) {
        cutHtml = html.substring(0, objIdx + pCloseIdx + 4);
      } else {
        cutHtml = html.substring(0, objIdx + 50) + "...";
      }
    }
  }

  // Render HTML, but keep <strong> as bold
  return (
    <span
      dangerouslySetInnerHTML={{
        __html: cutHtml.replace(/<strong>(.*?)<\/strong>/gi, '<b>$1</b>'),
      }}
    />
  );
};

interface ActivityWithImage extends Activity {
  imageDataUrl?: string;
  imageLoading?: boolean;
  imageError?: boolean;
}

const AnnualVolunteerYearRound = () => {
  // Use dummy data instead of API
  const [activities] = useState<ActivityWithImage[]>(
    dummyActivities.map((activity) => ({
      ...activity,
      imageDataUrl: dummyImages[activity.activityId],
      imageLoading: false,
      imageError: false,
    }))
  );
  const [selectedActivity, setSelectedActivity] = useState<ActivityWithImage | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Handler for View Details
  const handleOpenModal = (activity: ActivityWithImage) => {
    setSelectedActivity(activity);
    setModalOpen(true);
  };

  // Prepare event details for the modal
  const eventDetails = selectedActivity
    ? dummyEvents[selectedActivity.activityId]?.[0] || {
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
    : null;

  return (
    <>
      {/* Event Details Modal rendered at the root, outside the section */}
      {eventDetails && (
        <EventDetailsModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          event={eventDetails}
          selectedMonth={eventDetails.tentativeMonth || undefined}
          tentativeYear={eventDetails.tentativeYear}
          tentativeMonth={eventDetails.tentativeMonth}
          eventImageUrl={selectedActivity?.imageDataUrl ?? null}
        />
      )}

      <motion.section 
        className="w-full my-10 flex justify-center py-6 sm:py-10 bg-[#FBD336] relative"
        variants={sectionVariants}
        initial="initial"
        animate="animate"
      >
        {/* Decorative SVGs */}
        <svg className="absolute left-0 top-0 h-20 w-32 sm:h-32 sm:w-48" viewBox="0 0 200 80" fill="none">
          <g stroke="#fff" strokeWidth="3">
            <polygon points="10,70 50,10 90,70" />
            <polygon points="50,70 90,10 130,70" />
            <polygon points="90,70 130,10 170,70" />
          </g>
        </svg>
        <svg className="absolute right-0 bottom-0 h-20 w-20 sm:h-32 sm:w-32" viewBox="0 0 80 80" fill="none">
          <g>
            <circle cx="20" cy="20" r="20" fill="#fff" />
            <circle cx="60" cy="20" r="20" fill="#fff" />
            <circle cx="20" cy="60" r="20" fill="#fff" />
            <circle cx="60" cy="60" r="20" fill="#fff" />
          </g>
        </svg>
        
        <div className="max-w-5xl w-full z-10 px-2 sm:px-4">
          {/* Updated Title Section */}
          <motion.div 
            className="text-center mb-8 mt-2"
            variants={textVariants.header}
            initial="initial"
            animate="animate"
          >
            {/* Subheader with dash */}
            <div className="flex items-center justify-center mb-4">
              <div className="h-1 bg-white w-10 sm:w-14 mr-2 sm:mr-4"></div>
              <span className="text-gray-700 font-medium tracking-wide uppercase text-xs sm:text-sm">
                Continuous Volunteering Opportunities
              </span>
            </div>
            
            {/* Main Title */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black break-words">
              Year Round Activities
            </h2>
          </motion.div>
          
          {activities.length === 0 ? (
            <motion.div 
              className="text-center py-10"
              variants={fadeInVariants("up", 0.3)}
              initial="initial"
              animate="animate"
            >
              <p className="text-gray-700 text-base sm:text-lg">No activities available at the moment.</p>
            </motion.div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8"
              variants={cardVariants.container}
              initial="initial"
              animate="animate"
            >
              {activities.map((activity) => (
                <motion.div
                  key={activity.activityId}
                  className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col group relative cursor-pointer transition-all"
                  variants={cardVariants.item}
                  whileHover="hover"
                  whileTap={{ scale: 0.97 }}
                >
                  <div className="relative">
                    {activity.imageLoading ? (
                      <div className="w-full h-40 sm:h-48 bg-gray-200 flex items-center justify-center">
                        <div className="text-center">
                          <Loader2 className="w-6 h-6 animate-spin text-gray-400 mx-auto mb-2" />
                          <span className="text-xs text-gray-500">Loading image...</span>
                        </div>
                      </div>
                    ) : activity.imageDataUrl ? (
                      <img
                        src={activity.imageDataUrl}
                        alt={activity.name.trim()}
                        className="w-full h-36 sm:h-42 object-contain"
                      />
                    ) : (
                      <div className="w-full h-40 sm:h-48 bg-gray-200 flex items-center justify-center">
                        <div className="text-center text-gray-500">
                          <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                          <span className="text-sm">No image available</span>
                        </div>
                      </div>
                    )}
                    {/* View Details Button */}
                    <button
                      className="hidden sm:block absolute bottom-3 right-3 bg-yellow-500 text-white px-4 py-2 rounded-lg font-semibold text-sm opacity-100 transition-opacity transition-transform duration-200 cursor-pointer hover:bg-yellow-600 active:scale-95"
                      onClick={() => handleOpenModal(activity)}
                      style={{ transition: 'transform 0.15s' }}
                    >
                      View Details
                    </button>
                    <button
                      className="block sm:hidden w-full mt-3 bg-yellow-500 text-white px-4 py-2 rounded-lg font-semibold text-sm cursor-pointer hover:bg-yellow-600 transition-transform active:scale-95 max-w-xs mx-auto"
                      onClick={() => handleOpenModal(activity)}
                      style={{ transition: 'transform 0.15s' }}
                    >
                      View Details
                    </button>
                  </div>
                  <div className="p-4 sm:p-5 flex flex-col flex-grow">
                    <div className="flex-grow">
                      <h3 className="font-semibold text-gray-900 mb-1 text-base sm:text-lg break-words">
                        {activity.name.trim()}
                      </h3>
                      {activity.subName && (
                        <h4 className="text-blue-600 font-medium mb-2 text-xs sm:text-sm break-words">
                          {activity.subName.trim()}
                        </h4>
                      )}
                      <p className="text-gray-600 text-xs sm:text-sm leading-relaxed break-words">
                        {truncateTillObjectiveOrStrong(activity.description)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.section>
    </>
  );
};

export default AnnualVolunteerYearRound;