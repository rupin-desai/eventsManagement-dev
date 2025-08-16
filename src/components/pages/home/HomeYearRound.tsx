import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, AlertCircle } from "lucide-react";
import {
  getYearRoundActivities,
  getActivityImage,
  convertToDataUrl,
} from "../../../api/activityApi";
import type { Activity } from "../../../api/activityApi";
import {
  sectionVariants,
  fadeInVariants,
  cardVariants,
  textVariants,
} from "../../../utils/animationVariants";
import EventDetailsModal from "../../ui/modals/EventDetailsModal";
import { getEventsByYear } from "../../../api/eventApi";
import type { Event } from "../../../api/eventApi";

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

const HomeYearRound = () => {
  const [activities, setActivities] = useState<ActivityWithImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // For modal functionality
  const [selectedActivity, setSelectedActivity] =
    useState<ActivityWithImage | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activityEvents, setActivityEvents] = useState<Record<number, Event[]>>(
    {}
  );
  const [activityEventMeta, setActivityEventMeta] = useState<
    Record<
      number,
      { tentativeMonth: string; tentativeYear: string } | undefined
    >
  >({});

  const loadActivityImage = async (
    activityId: number
  ): Promise<string | null> => {
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
    } catch {
      return null;
    }
  };

  const fetchYearRoundActivities = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getYearRoundActivities();
      const filteredActivities = response.data.filter(
        (activity) => !containsTest(activity)
      );
      const activitiesData = filteredActivities.map((activity) => ({
        ...activity,
        imageLoading: true,
        imageError: false,
      }));
      setActivities(activitiesData);

      // Load images for each activity
      for (let i = 0; i < activitiesData.length; i++) {
        const activity = activitiesData[i];
        const imageDataUrl = await loadActivityImage(activity.activityId);
        setActivities((prevActivities) =>
          prevActivities.map((act) =>
            act.activityId === activity.activityId
              ? {
                  ...act,
                  imageDataUrl: imageDataUrl || undefined,
                  imageLoading: false,
                  imageError: !imageDataUrl,
                }
              : act
          )
        );
      }
    } catch (err) {
      setError("An unexpected error occurred while loading activities");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all events for the current year and group by activityId
  //@ts-ignore
  const fetchEventsAndMeta = async (activities: ActivityWithImage[]) => {
    try {
      const year = new Date().getFullYear();
      const eventsResp = await getEventsByYear(year);
      const events: Event[] = eventsResp.data;

      // Group events by activityId
      const grouped: Record<number, Event[]> = {};
      const meta: Record<
        number,
        { tentativeMonth: string; tentativeYear: string } | undefined
      > = {};
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
    } catch {
      setActivityEvents({});
      setActivityEventMeta({});
    }
  };

  useEffect(() => {
    fetchYearRoundActivities();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (activities.length > 0) {
      fetchEventsAndMeta(activities);
    }
    // eslint-disable-next-line
  }, [activities.length]);

  // Handler for View Details (same as annual volunteer year round)
  const handleViewDetails = (activity: ActivityWithImage) => {
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
              <button
                onClick={fetchYearRoundActivities}
                className="flex items-center gap-2 mx-auto px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
              >
                Retry
              </button>
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
                activityEvents[selectedActivity.activityId]?.[0] ||
                {
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
          selectedActivity && activityEventMeta[selectedActivity.activityId]
            ? activityEventMeta[selectedActivity.activityId]?.tentativeMonth ?? undefined
            : undefined
        }
        eventIds={
          selectedActivity && activityEvents[selectedActivity.activityId]
            ? activityEvents[selectedActivity.activityId].map((e) => e.eventId)
            : []
        }
        tentativeYear={
          selectedActivity && activityEventMeta[selectedActivity.activityId]
            ? activityEventMeta[selectedActivity.activityId]?.tentativeYear
            : undefined
        }
        tentativeMonth={
          selectedActivity && activityEventMeta[selectedActivity.activityId]
            ? activityEventMeta[selectedActivity.activityId]?.tentativeMonth
            : undefined
        }
        isYearRound={true}
        eventImageUrl={selectedActivity?.imageDataUrl ?? null} // <-- Pass the image URL here
      />
    </>
  );
};

export default HomeYearRound;
