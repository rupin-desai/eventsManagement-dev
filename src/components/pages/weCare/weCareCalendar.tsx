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
import { getEventsByYear, type Event } from "../../../api/eventApi";
import {
  getEventLocationsByEventId,
  getEventLocationsDateByEventLocId,
  type EventLocation,
} from "../../../api/locationApi";
import {
  getActivityImage,
  convertToDataUrl,
  type ActivityImageResponse,
} from "../../../api/activityApi";

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
  const [loadingImages, setLoadingImages] = useState<Set<number>>(new Set());
  // For calendar rings on all event dates
  const [hoveredEventAllDates, setHoveredEventAllDates] = useState<string[]>(
    []
  );

  useEffect(() => {
    loadWeCareEvents();
    // eslint-disable-next-line
  }, []);

  // Fetch all August annual events and their locations
  const loadWeCareEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const currentYear = new Date().getFullYear();
      const response = await getEventsByYear(currentYear.toString());

      let allEvents: Event[] = [];
      if (response.data && Array.isArray(response.data)) {
        allEvents = response.data;
      }

      // Filter for August Annual events only
      const augustAnnualEvents = allEvents.filter((event) => {
        const isAugust = event.tentativeMonth === "8";
        const isAnnual = event.type?.toLowerCase() === "annual";
        const hasRequiredFields =
          event.type && event.tentativeMonth && event.tentativeYear;
        return hasRequiredFields && isAugust && isAnnual;
      });

      // For each event, fetch its locations and flatten by date+event
      let flatEvents: {
        eventId: number;
        activityId: number;
        title: string;
        name?: string;
        subTitle?: string;
        description: string;
        date: string;
        displayDate: string;
        locationName: string;
        tentativeMonth: string;
        tentativeYear: string;
        type: string;
        enableConf: string;
        enableCert: string;
        enableComp: string;
        image?: string;
        color: string;
      }[] = [];

      for (const event of augustAnnualEvents) {
        let eventLocations: EventLocation[] = [];
        try {
          const resp = await getEventLocationsByEventId(event.eventId);
          eventLocations = resp.data || [];
        } catch {
          eventLocations = [];
        }

        // If no locations, still push a default
        if (eventLocations.length === 0) {
          flatEvents.push({
            eventId: event.eventId,
            activityId: event.activityId,
            title: event.name,
            name: event.name,
            subTitle: event.subName || undefined,
            description: event.description || "",
            date: "", // No date
            displayDate: `Aug ${event.tentativeYear}`,
            locationName: "To be shared",
            tentativeMonth: event.tentativeMonth,
            tentativeYear: event.tentativeYear,
            type: event.type,
            enableConf: event.enableConf,
            enableCert: event.enableCert,
            enableComp: event.enableComp,
            image: undefined,
            color: "bg-green-500",
          });
        } else {
          for (const loc of eventLocations) {
            flatEvents.push({
              eventId: event.eventId,
              activityId: event.activityId,
              title: event.name,
              name: event.name,
              subTitle: event.subName || undefined,
              description: event.description || "",
              date: loc.eventDate,
              displayDate: formatDateForDisplay(loc.eventDate),
              locationName: loc.locationName,
              tentativeMonth: event.tentativeMonth,
              tentativeYear: event.tentativeYear,
              type: event.type,
              enableConf: event.enableConf,
              enableCert: event.enableCert,
              enableComp: event.enableComp,
              image: undefined,
              color: eventHexColors[0],
            });
          }
        }
      }

      // Combine by eventId+date (merge locations)
      const combinedMap = new Map<string, DynamicWeCareEvent>();
      for (const item of flatEvents) {
        if (!item.date) continue; // skip if no date
        const key = `${item.eventId}__${item.date}`;
        if (!combinedMap.has(key)) {
          combinedMap.set(key, {
            eventId: item.eventId,
            activityId: item.activityId,
            title: item.title,
            name: item.name,
            subTitle: item.subTitle,
            description: item.description,
            date: item.date,
            displayDate: item.displayDate,
            locations: item.locationName,
            allLocations: [item.locationName],
            allDates: [item.date],
            tentativeMonth: item.tentativeMonth,
            tentativeYear: item.tentativeYear,
            type: item.type,
            enableConf: item.enableConf,
            enableCert: item.enableCert,
            enableComp: item.enableComp,
            image: item.image,
            color: item.color,
          });
        } else {
          const prev = combinedMap.get(key)!;
          prev.allLocations.push(item.locationName);
          prev.locations = Array.from(new Set(prev.allLocations)).join(", ");
        }
      }

      // Load images for each unique activityId
      const combinedEventsArr = Array.from(combinedMap.values());
      await Promise.all(
        combinedEventsArr.map(async (event) => {
          if (event.activityId && !event.image) {
            try {
              const img = await loadActivityImage(event.activityId);
              event.image = img;
            } catch {}
          }
        })
      );

      // Sort by date
      combinedEventsArr.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      setEvents(combinedEventsArr);
    } catch (error) {
      setError("Failed to load current year events");
    } finally {
      setLoading(false);
    }
  };

  const formatDateForDisplay = (dateString: string) => {
    if (!dateString || dateString === "0001-01-01") return "To be shared";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "To be shared";
    }
  };

  const loadActivityImage = async (
    activityId: number
  ): Promise<string | undefined> => {
    try {
      setLoadingImages((prev) => new Set(prev).add(activityId));
      const response = await getActivityImage(activityId);
      const imageData: ActivityImageResponse = response.data;
      // Return the image path if available
      if (imageData.fileName) {
        return imageData.fileName;
      }
      // Fallback to base64 if needed
      if (imageData.imgFile && imageData.contentType) {
        const dataUrl = convertToDataUrl(
          imageData.imgFile,
          imageData.contentType
        );
        return dataUrl;
      }
      return undefined;
    } catch {
      return undefined;
    } finally {
      setLoadingImages((prev) => {
        const newSet = new Set(prev);
        newSet.delete(activityId);
        return newSet;
      });
    }
  };

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

  // Fetch all dates for all locations of an event (for ring effect)
  const fetchAllDatesForEvent = async (eventId: number) => {
    try {
      const resp = await getEventLocationsByEventId(eventId);
      const locations = resp.data || [];
      let allDates: string[] = [];
      for (const loc of locations) {
        const dateResp = await getEventLocationsDateByEventLocId(
          loc.eventLocationId
        );
        if (Array.isArray(dateResp.data)) {
          allDates = allDates.concat(
            dateResp.data.map((d: any) => d.date.slice(0, 10))
          );
        }
      }
      allDates = Array.from(new Set(allDates));
      setHoveredEventAllDates(allDates);
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
