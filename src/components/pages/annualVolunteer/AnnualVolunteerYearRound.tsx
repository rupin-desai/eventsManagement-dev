import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { getYearRoundActivities, getActivityImage, convertToDataUrl } from '../../../api/activityApi';
import { getEventsByYear } from '../../../api/eventApi';
import { getEventLocationsByEventId, type EventLocation } from '../../../api/locationApi';
import type { Activity } from '../../../api/activityApi';
import type { Event } from '../../../api/eventApi';
import { AxiosError } from 'axios';
import {
  sectionVariants,
  fadeInVariants,
  cardVariants,
  textVariants,
} from '../../../utils/animationVariants';
import EventDetailsModal from "../../ui/modals/EventDetailsModal";

// Helper function to strip HTML tags from description


// Helper function to truncate description till end of "Objective" line or when a <strong> tag is found,
// and keep <strong> content as bold
const truncateTillObjectiveOrStrong = (html: string): React.JSX.Element => {
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

// Helper function to check if activity contains "test" (case-insensitive)
const containsTest = (activity: Activity): boolean => {
  const testPattern = /test/i;
  return (
    testPattern.test(activity.name) ||
    (activity.subName && testPattern.test(activity.subName)) ||
    testPattern.test(activity.description)
  );
};

interface ActivityWithImage extends Activity {
  imageDataUrl?: string;
  imageLoading?: boolean;
  imageError?: boolean;
}

const HomeUpcoming = () => {
  const [activities, setActivities] = useState<ActivityWithImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<ActivityWithImage | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activityEvents, setActivityEvents] = useState<Record<number, Event[]>>({});
  //@ts-ignore
  const [activityLocations, setActivityLocations] = useState<Record<number, EventLocation[]>>({});
  const [activityEventMeta, setActivityEventMeta] = useState<Record<number, { tentativeMonth: string; tentativeYear: string } | undefined>>({});

  const loadActivityImage = async (activityId: number): Promise<string | null> => {
    try {
      const response = await getActivityImage(activityId);
      const imageData = response.data;
      // Use fileName as image path if present (new API)
      if (imageData.fileName) {
        return imageData.fileName;
      }
      // Fallback to legacy base64 if present
      if (imageData.imgFile && imageData.contentType) {
        return convertToDataUrl(imageData.imgFile, imageData.contentType);
      }
      return null;
    } catch (error) {
      console.error(`Failed to load image for activity ${activityId}:`, error);
      return null;
    }
  };

  const fetchYearRoundActivities = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getYearRoundActivities();
      
      // Filter out activities that contain "test" (case-insensitive)
      const filteredActivities = response.data.filter(activity => !containsTest(activity));
      
      const activitiesData = filteredActivities.map(activity => ({
        ...activity,
        imageLoading: true,
        imageError: false
      }));
      
      setActivities(activitiesData);

      // Load images for each activity using their actual activityId
      for (let i = 0; i < activitiesData.length; i++) {
        const activity = activitiesData[i];
        
        const imageDataUrl = await loadActivityImage(activity.activityId);
        
        setActivities(prevActivities => 
          prevActivities.map(act => 
            act.activityId === activity.activityId 
              ? {
                  ...act,
                  imageDataUrl: imageDataUrl || undefined,
                  imageLoading: false,
                  imageError: !imageDataUrl
                }
              : act
          )
        );
        
        // Small delay between image loads to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (err) {
      console.error('Error fetching year-round activities:', err);
      
      if (err instanceof AxiosError) {
        if (err.response) {
          setError(`Failed to load activities: ${err.response.status} ${err.response.statusText}`);
        } else if (err.request) {
          setError('Network error: Unable to fetch activities');
        } else {
          setError('Error loading activities: ' + err.message);
        }
      } else {
        setError('An unexpected error occurred while loading activities');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all events for the current year and group by activityId
  const fetchEventsAndLocations = async (activities: ActivityWithImage[]) => {
    try {
      const year = new Date().getFullYear();
      const eventsResp = await getEventsByYear(year);
      const events: Event[] = eventsResp.data;

      // Group events by activityId
      const grouped: Record<number, Event[]> = {};
      const meta: Record<number, { tentativeMonth: string; tentativeYear: string } | undefined> = {};
      for (const event of events) {
        if (!grouped[event.activityId]) grouped[event.activityId] = [];
        grouped[event.activityId].push(event);
        // Save tentativeMonth and tentativeYear for each activityId (first event found)
        if (!meta[event.activityId]) {
          meta[event.activityId] = {
            tentativeMonth: event.tentativeMonth,
            tentativeYear: event.tentativeYear,
          };
        }
      }
      setActivityEvents(grouped);
      setActivityEventMeta(meta);

      // For each activity, fetch all event locations for its events
      const locationsMap: Record<number, EventLocation[]> = {};
      for (const activity of activities) {
        const eventsForActivity = grouped[activity.activityId] || [];
        let allLocations: EventLocation[] = [];
        for (const event of eventsForActivity) {
          try {
            const locResp = await getEventLocationsByEventId(event.eventId);
            allLocations = allLocations.concat(locResp.data);
          } catch {
            // ignore error for this event
          }
        }
        locationsMap[activity.activityId] = allLocations;
      }
      setActivityLocations(locationsMap);
    } catch (err) {
      // ignore error, fallback to empty
      setActivityEvents({});
      setActivityLocations({});
      setActivityEventMeta({});
    }
  };

  useEffect(() => {
    const load = async () => {
      await fetchYearRoundActivities();
    };
    load();
  }, []);

  // After activities are loaded, fetch events and locations
  useEffect(() => {
    if (activities.length > 0) {
      fetchEventsAndLocations(activities);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activities.length]);

  if (isLoading) {
    return (
      <section className="w-full my-10 flex justify-center py-10 bg-[#FBD336] relative">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin mr-3" />
          <span className="text-lg">Loading Activities...</span>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full my-10 flex justify-center py-10 bg-[#FBD336] relative">
        <div className="max-w-5xl w-full z-10">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-red-700 mb-2">Error Loading Activities</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchYearRoundActivities}
              className="flex items-center gap-2 mx-auto px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  // When opening modal, pass all eventIds for this activity and its tentativeMonth/year
  const handleOpenModal = (activity: ActivityWithImage) => {
    setSelectedActivity(activity);
    setModalOpen(true);
  };

  // Prepare event details for the modal
  const eventDetails = selectedActivity && activityEvents[selectedActivity.activityId]
    ? activityEvents[selectedActivity.activityId][0]
    : selectedActivity
      ? {
          eventId: 0,
          activityId: selectedActivity.activityId,
          name: selectedActivity.name,
          subName: selectedActivity.subName,
          description: selectedActivity.description,
          tentativeMonth:
            activityEventMeta[selectedActivity.activityId]?.tentativeMonth ?? "",
          tentativeYear:
            activityEventMeta[selectedActivity.activityId]?.tentativeYear ?? "",
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
          eventIds={eventDetails.eventId ? [eventDetails.eventId] : []}
          tentativeYear={eventDetails.tentativeYear}
          tentativeMonth={eventDetails.tentativeMonth}
          eventImageUrl={selectedActivity?.imageDataUrl ?? null} // <-- Pass the image URL here
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

export default HomeUpcoming;