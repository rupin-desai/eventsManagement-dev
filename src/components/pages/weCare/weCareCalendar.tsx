import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { sectionVariants } from "../../../utils/animationVariants";
import CustomCalendar from "../../ui/CustomCalendar";
import {
  Info,
  Loader2,
  Calendar as CalendarIcon,
  AlertCircle,
} from "lucide-react";
import EventDetailsModal from "../../ui/modals/EventDetailsModal";

// Dynamic event interface
export interface DynamicWeCareEvent {
  eventId: number;
  activityId: number;
  title: string;
  name?: string;
  subTitle?: string;
  description: string;
  date: string;
  displayDate: string;
  locations: string;
  allLocations: string[];
  allDates: string[];
  tentativeMonth: string;
  tentativeYear: string;
  type: string;
  enableConf: string;
  enableCert: string;
  enableComp: string;
  image?: string;
  color: string;
}

// Dummy event data
const dummyWeCareEvents: DynamicWeCareEvent[] = [
  {
    eventId: 1,
    activityId: 101,
    title: "Tree Plantation Drive",
    name: "Tree Plantation Drive",
    subTitle: "Environmental Initiative",
    description:
      "Join us in making our environment greener by planting trees in various locations across the city.",
    date: "2025-08-15",
    displayDate: "Friday, August 15, 2025",
    locations: "Mumbai, Delhi, Bangalore",
    allLocations: ["Mumbai", "Delhi", "Bangalore"],
    allDates: ["2025-08-15", "2025-08-16", "2025-08-17"],
    tentativeMonth: "8",
    tentativeYear: "2025",
    type: "annual",
    enableConf: "true",
    enableCert: "true",
    enableComp: "false",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80",
    color: "#22c55e",
  },
  {
    eventId: 2,
    activityId: 102,
    title: "Blood Donation Camp",
    name: "Blood Donation Camp",
    subTitle: "Health Initiative",
    description:
      "Save lives by donating blood at our annual blood donation camp organized across multiple cities.",
    date: "2025-08-22",
    displayDate: "Friday, August 22, 2025",
    locations: "Chennai, Pune, Hyderabad",
    allLocations: ["Chennai", "Pune", "Hyderabad"],
    allDates: ["2025-08-22", "2025-08-23"],
    tentativeMonth: "8",
    tentativeYear: "2025",
    type: "annual",
    enableConf: "true",
    enableCert: "true",
    enableComp: "false",
    image:
      "https://images.unsplash.com/photo-1615461066159-fea0960485d5?auto=format&fit=crop&w=800&q=80",
    color: "#ef4444",
  },
  {
    eventId: 3,
    activityId: 103,
    title: "Community Clean-Up",
    name: "Community Clean-Up",
    subTitle: "Cleanliness Drive",
    description:
      "Help clean and beautify our local communities and public spaces for a better tomorrow.",
    date: "2025-08-08",
    displayDate: "Friday, August 8, 2025",
    locations: "Kolkata, Ahmedabad",
    allLocations: ["Kolkata", "Ahmedabad"],
    allDates: ["2025-08-08", "2025-08-09", "2025-08-10"],
    tentativeMonth: "8",
    tentativeYear: "2025",
    type: "annual",
    enableConf: "true",
    enableCert: "true",
    enableComp: "false",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80",
    color: "#06b6d4",
  },
  {
    eventId: 4,
    activityId: 104,
    title: "Education Support Program",
    name: "Education Support Program",
    subTitle: "Learning Initiative",
    description:
      "Support underprivileged children with educational materials and tutoring sessions.",
    date: "2025-08-29",
    displayDate: "Friday, August 29, 2025",
    locations: "Jaipur, Lucknow, Bhopal",
    allLocations: ["Jaipur", "Lucknow", "Bhopal"],
    allDates: ["2025-08-29", "2025-08-30", "2025-08-31"],
    tentativeMonth: "8",
    tentativeYear: "2025",
    type: "annual",
    enableConf: "true",
    enableCert: "true",
    enableComp: "false",
    image:
      "https://images.unsplash.com/photo-1497486751825-1233686d5d80?auto=format&fit=crop&w=800&q=80",
    color: "#f59e42",
  },
];

const eventHexColors = [
  "#6366f1", // indigo
  "#f59e42", // orange
  "#22c55e", // green
  "#ec4899", // pink
  "#eab308", // yellow
  "#a21caf", // purple
  "#ef4444", // red
  "#14b8a6", // teal
  "#f97316", // orange deep
  "#06b6d4", // cyan
  "#f43f5e", // rose
  "#84cc16", // lime
  "#f472b6", // fuchsia
  "#3b82f6", // blue
];
const getHexColorForEvent = (() => {
  const colorMap: Record<number, string> = {};
  let colorIdx = 0;
  return (eventId: number) => {
    if (!colorMap[eventId]) {
      colorMap[eventId] = eventHexColors[colorIdx % eventHexColors.length];
      colorIdx++;
    }
    return colorMap[eventId];
  };
})();

const WeCareCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [hoveredEvents, setHoveredEvents] = useState<
    { title: string; date: string }[]
  >([]);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<DynamicWeCareEvent | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Dynamic data states
  const [events, setEvents] = useState<DynamicWeCareEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingImages] = useState<Set<number>>(new Set());
  // For calendar rings on all event dates
  const [hoveredEventAllDates, setHoveredEventAllDates] = useState<string[]>(
    []
  );

  useEffect(() => {
    loadWeCareEvents();
    // eslint-disable-next-line
  }, []);

  // Load dummy We Care events (simulating API call)
  const loadWeCareEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Use dummy data
      setEvents(dummyWeCareEvents);
    } catch (error) {
      setError("Failed to load current year events");
    } finally {
      setLoading(false);
    }
  };

  // const formatDateForDisplay = (dateString: string) => {
  //   if (!dateString || dateString === "0001-01-01") return "To be shared";
  //   try {
  //     const date = new Date(dateString);
  //     return date.toLocaleDateString("en-US", {
  //       weekday: "long",
  //       year: "numeric",
  //       month: "long",
  //       day: "numeric",
  //     });
  //   } catch {
  //     return "To be shared";
  //   }
  // };

  // // Simulate loading activity image (no actual API call)
  // const loadActivityImage = async (
  //   activityId: number
  // ): Promise<string | undefined> => {
  //   try {
  //     setLoadingImages((prev) => new Set(prev).add(activityId));

  //     // Simulate API delay
  //     await new Promise((resolve) => setTimeout(resolve, 1000));

  //     // Return placeholder image based on activityId
  //     const placeholderImages = [
  //       "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80",
  //       "https://images.unsplash.com/photo-1615461066159-fea0960485d5?auto=format&fit=crop&w=800&q=80",
  //       "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80",
  //       "https://images.unsplash.com/photo-1497486751825-1233686d5d80?auto=format&fit=crop&w=800&q=80",
  //     ];

  //     return placeholderImages[activityId % placeholderImages.length];
  //   } catch {
  //     return undefined;
  //   } finally {
  //     setLoadingImages((prev) => {
  //       const newSet = new Set(prev);
  //       newSet.delete(activityId);
  //       return newSet;
  //     });
  //   }
  // };

  // Helper to check if an event is hovered (match both title and date)
  const isEventHovered = (
    event: { title: string; date: string },
    idx: number
  ) =>
    hoveredEvents.some(
      (e) => e.title === event.title && e.date === event.date
    ) || hoveredIdx === idx;

  const handleEventClick = (event: DynamicWeCareEvent) => {
    setSelectedEvent({ ...event, name: event.title });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  // Simulate fetching all dates for all locations of an event (for ring effect)
  const fetchAllDatesForEvent = async (eventId: number) => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Get all dates for the event from dummy data
      const event = events.find((e) => e.eventId === eventId);
      if (event && event.allDates) {
        setHoveredEventAllDates(event.allDates);
      } else {
        setHoveredEventAllDates([]);
      }
    } catch {
      setHoveredEventAllDates([]);
    }
  };

  // Loading state
  if (loading) {
    return (
      <motion.section
        id="we-care-calendar"
        className="w-full py-10 px-2 md:px-0 mb-6 bg-white"
        initial="initial"
        animate="animate"
        variants={sectionVariants}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
            We care Activities
          </h2>
          <div className="flex items-center justify-center py-16">
            <div className="flex items-center gap-3 text-gray-600">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Loading August annual events...</span>
            </div>
          </div>
        </div>
      </motion.section>
    );
  }

  // Error state
  if (error) {
    return (
      <motion.section
        id="we-care-calendar"
        className="w-full py-10 px-2 md:px-0 mb-6 bg-white"
        initial="initial"
        animate="animate"
        variants={sectionVariants}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
            August Annual Activities
          </h2>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
            <p className="text-gray-600 mb-2">
              Unable to load August annual events
            </p>
            <button
              onClick={loadWeCareEvents}
              className="text-blue-600 hover:text-blue-800 font-medium"
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
        id="we-care-calendar"
        className="w-full py-10 px-2 md:px-0 mb-6 bg-white"
        initial="initial"
        animate="animate"
        variants={sectionVariants}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
            August Annual Activities
          </h2>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <CalendarIcon className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-600">No August annual events scheduled</p>
            <p className="text-sm text-gray-500 mt-1">
              Check back for upcoming August activities!
            </p>
          </div>
        </div>
      </motion.section>
    );
  }

  // Main content section
  // Filter out events with date "To be shared" or empty/invalid date
  const filteredEvents = events.filter(
    (event) =>
      event.date &&
      event.date !== "0001-01-01" &&
      event.date !== "" &&
      event.displayDate !== "To be shared"
  );

  // Only show the first date for each event in the calendar
  const calendarEvents = filteredEvents.map((event) => {
    if (event.allDates && event.allDates.length > 0) {
      return { ...event, date: event.allDates[0] };
    }
    return event;
  });

  // Helper: Extracts "Day Month" from a displayDate string
  const getDayMonth = (displayDate: string) => {
    if (!displayDate || displayDate === "To be shared") return displayDate;
    try {
      const date = new Date(displayDate);
      if (!isNaN(date.getTime())) {
        // e.g. "Monday, August 21, 2023" -> "21 August"
        return `${date.getDate()} ${date.toLocaleString("en-US", {
          month: "long",
        })}`;
      }
      // If not a valid date, fallback to first two words
      const parts = displayDate.split(" ");
      return parts.length >= 2
        ? `${parts[1]} ${parts[2] || ""}`.trim()
        : displayDate;
    } catch {
      return displayDate;
    }
  };

  // --- Pass color info to CustomCalendar ---

  const calendarDayProps = (date: Date) => {
    const dateKey = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");

    // Only use first date of each event for color/gradient
    const colors = calendarEvents
      .filter((event) => event.date && event.date.slice(0, 10) === dateKey)
      .map((event) => getHexColorForEvent(event.eventId));

    let background = "";
    if (colors.length === 1) {
      background = colors[0];
    } else if (colors.length === 2) {
      background = `linear-gradient(90deg, ${colors[0]}, ${colors[1]})`;
    } else if (colors.length > 2) {
      background = `linear-gradient(90deg, ${colors.join(",")})`;
    }

    // Add ring if this date is in hoveredEventAllDates
    const ring =
      hoveredEventAllDates.includes(dateKey) && colors.length > 0
        ? `0 0 0 2px ${colors[0]}`
        : undefined;

    return {
      background,
      boxShadow: ring ? ring : undefined,
      zIndex: ring ? 2 : undefined,
    };
  };

  return (
    <>
      <motion.section
        id="we-care-calendar"
        className="w-full py-10 px-2 md:px-8 mb-6 bg-white"
        initial="initial"
        animate="animate"
        variants={sectionVariants}
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10 items-start">
          {/* Left: Sticky Calendar with Heading */}
          <div className="md:w-[340px] w-full">
            <div className="sticky top-6 z-20">
              <div className="bg-white rounded-2xl shadow p-6 w-full max-w-xs md:max-w-full">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                  August Annual Activities
                </h2>
                <CustomCalendar
                  events={calendarEvents}
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  setHoveredEvents={setHoveredEvents}
                  calendarDayProps={calendarDayProps}
                />
                {loadingImages.size > 0 && (
                  <div className="mt-4 text-sm text-gray-500 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading {loadingImages.size} image
                    {loadingImages.size > 1 ? "s" : ""}...
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Events List */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {filteredEvents.map((event, idx) => {
              const eventHex = getHexColorForEvent(event.eventId);
              return (
                <div
                  key={`${event.eventId}-${event.date}`}
                  className={`relative flex flex-row items-start p-1 gap-2 transition group cursor-pointer`}
                  style={{ minHeight: 64 }}
                  onMouseEnter={async () => {
                    setHoveredIdx(idx);
                    await fetchAllDatesForEvent(event.eventId);
                  }}
                  onMouseLeave={() => {
                    setHoveredIdx(null);
                    setHoveredEventAllDates([]);
                  }}
                  onClick={() => handleEventClick(event)}
                >
                  {/* Highlight effect on hover */}
                  <div
                    className="absolute inset-0 z-0 rounded-xl transition pointer-events-none"
                    style={
                      isEventHovered(
                        { title: event.title, date: event.date },
                        idx
                      )
                        ? { background: `${eventHex}40` } // 40 = 25% opacity
                        : undefined
                    }
                  />

                  {/* Different color line for different event */}
                  <div
                    className="w-1.5 h-10 rounded-full mt-1 mr-2 z-10"
                    style={{ background: eventHex }}
                  ></div>

                  <div className="z-10 flex-1">
                    {/* Top info: Only day and month, with custom event color */}
                    <div
                      className="text-xs font-semibold mb-0.5"
                      style={{ color: eventHex }}
                    >
                      {getDayMonth(event.displayDate)}
                    </div>
                    <div className="font-semibold text-gray-800 leading-tight">
                      {event.title}
                    </div>
                    {event.subTitle && (
                      <div className="text-xs text-gray-500 mb-1">
                        {event.subTitle}
                      </div>
                    )}
                    <div className="text-sm text-gray-600 font-medium">
                      {event.locations}
                    </div>
                  </div>

                  {/* Details button bottom right on hover */}
                  <div
                    className={`absolute top-1 right-4 flex items-center gap-1 text-green-600 font-semibold text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 hover:underline`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEventClick(event);
                    }}
                  >
                    Details
                    <Info className="w-3 h-3" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Event Details Modal */}
      {isModalOpen && selectedEvent && (
        <EventDetailsModal
          isOpen={isModalOpen}
          onClose={closeModal}
          event={selectedEvent as any}
          selectedMonth="August"
          eventImageUrl={selectedEvent.image ?? null}
        />
      )}
    </>
  );
};

export default WeCareCalendar;
