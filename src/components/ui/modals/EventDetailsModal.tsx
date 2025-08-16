import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  MapPin,
  Info,
  CheckCircle2,
  Clock,
  UserPlus,
  Loader2,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Event as ApiEvent } from "../../../api/eventApi";
import {
  getEventLocationsByEventId,
  getEventLocationsDateByEventLocId,
  type EventLocation,
} from "../../../api/locationApi";
import React from "react";
import { fadeInVariants } from "../../../utils/animationVariants"; // <-- Import optimized animation

// Extended Event type that matches the EventsCalendar component
interface Event extends ApiEvent {
  details?: string;
  requirements?: string[];
  duration?: string;
  location?: string;
  id?: number;
  title?: string;
  objective?: string;
  date?: string;
  time?: string;
  venue?: string;
  locations?: string[];
  faqs?: { q: string; a: string }[];
}

interface EventDetailModalProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
  eventImageUrl?: string | null; // <-- Add this prop
  selectedMonth?: string; // <-- Add this prop
  eventIds?: number[]; // <-- Add this prop to fix the error
  tentativeYear?: string;
  tentativeMonth?: string;
  isYearRound?: boolean;
}

const EventDetailsModal: React.FC<EventDetailModalProps> = ({
  isOpen,
  onClose,
  event,
  selectedMonth,
  eventIds,
  tentativeYear,
  tentativeMonth,
  isYearRound,
  eventImageUrl: eventImageUrlProp,
}) => {
  // All hooks at the top!
  const navigate = useNavigate();
  const [eventLocations, setEventLocations] = useState<EventLocation[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [eventImageUrl, setEventImageUrl] = useState<string | null>(null);
  const [locationDates, setLocationDates] = useState<Record<number, string[]>>({});
  const [loadingDates, setLoadingDates] = useState<Record<number, boolean>>({});

  // Disable body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Load event locations when modal opens
  useEffect(() => {
    const fetchLocations = async () => {
      if (isOpen && eventIds && eventIds.length > 0) {
        setLoadingLocations(true);
        try {
          let allLocs: EventLocation[] = [];
          for (const eid of eventIds) {
            const resp = await getEventLocationsByEventId(eid);
            allLocs = allLocs.concat(resp.data);
          }
          setEventLocations(allLocs);
        } catch {
          setEventLocations([]);
        } finally {
          setLoadingLocations(false);
        }
      } else if (isOpen && event?.eventId) {
        // fallback to single event
        setLoadingLocations(true);
        try {
          const resp = await getEventLocationsByEventId(event.eventId);
          setEventLocations(resp.data);
        } catch {
          setEventLocations([]);
        } finally {
          setLoadingLocations(false);
        }
      } else {
        setEventLocations([]);
      }
    };
    fetchLocations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, eventIds, event?.eventId]);

  useEffect(() => {
    setEventImageUrl(eventImageUrlProp ?? null);
  }, [eventImageUrlProp]);

  // ✅ Check if event is completed/closed for nominations
  const isEventCompleted = (event: Event): boolean => {
    return event.enableComp === "true";
  };

  // ✅ Get event status for display
  const getEventStatus = (event: Event) => {
    if (isEventCompleted(event)) {
      return {
        type: "completed",
        label: "Event Completed",
        icon: CheckCircle2,
        color: "text-green-600",
        bgColor: "bg-green-50 border-green-200",
        message:
          "This event has been completed and nominations are no longer accepted.",
      };
    }
    const currentYear = new Date().getFullYear();
    const eventYear = parseInt(event.tentativeYear);
    if (eventYear > currentYear) {
      return {
        type: "upcoming",
        label: "Upcoming Event",
        icon: Calendar,
        color: "text-blue-600",
        bgColor: "bg-blue-50 border-blue-200",
        message:
          "Event is scheduled for the future. Nominations will open closer to the event date.",
      };
    }
    return {
      type: "active",
      label: "Open for Nominations",
      icon: UserPlus,
      color: "text-green-600",
      bgColor: "bg-green-50 border-green-200",
      message:
        "Event is currently accepting nominations. Click below to participate!",
    };
  };

  // Check if time is valid (not default/empty values)
  const isValidTime = (timeString: string) => {
    if (!timeString || timeString.trim() === "") return false;
    if (timeString === "00:00:00" || timeString === "00:00") return false;
    return true;
  };

  // Format time display with fallback
  const formatTime = (timeString: string) => {
    if (!isValidTime(timeString)) return "To be shared";
    try {
      const [hours, minutes] = timeString.split(":");
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? "PM" : "AM";
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch {
      return "To be shared";
    }
  };

  // Format venue display
  const formatVenue = (venue: string): string[] => {
    if (!venue || venue.trim() === "") return [];
    return venue
      .split("\n")
      .filter((v) => v.trim())
      .map((v) => v.trim());
  };

  // Check if date is valid (not default/empty values)
  const isValidDate = (dateString: string) => {
    if (!dateString || dateString.trim() === "") return false;
    if (dateString === "0001-01-01" || dateString.startsWith("0001-"))
      return false;
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return false;
      if (date.getFullYear() <= 1) return false;
      return true;
    } catch {
      return false;
    }
  };

  // Format date display with fallback
  const formatDate = (dateString: string) => {
    if (!isValidDate(dateString)) return "To be shared";
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

  // Helper: Convert month number to name if needed
  const getMonthName = (month: string | number | undefined) => {
    if (!month) return "";
    if (isNaN(Number(month))) return month;
    const m = Number(month);
    if (m < 1 || m > 12) return month;
    return new Date(2000, m - 1, 1).toLocaleString("en-US", { month: "long" });
  };

  // Now, after all hooks, you can do:
  if (!event) return null;

  // ✅ Get event status
  const eventStatus = getEventStatus(event);
  const isCompleted = isEventCompleted(event);

  // Function to safely render HTML content
  const renderHtmlContent = (htmlContent: string) => {
    if (!htmlContent) return "Details will be shared soon.";
    return (
      <div
        className="prose prose-sm max-w-none dark:prose-invert prose-p:my-2 prose-ul:my-2 prose-li:my-1"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
        style={
          {
            "--tw-prose-body": "rgb(55 65 81)",
            "--tw-prose-headings": "rgb(17 24 39)",
            "--tw-prose-bold": "rgb(17 24 39)",
            "--tw-prose-bullets": "rgb(107 114 128)",
          } as React.CSSProperties
        }
      />
    );
  };

  const handleNominate = () => {
    if (isCompleted) {
      return;
    }
    navigate("/volunteer-form", {
      state: {
        eventId: event.eventId,
        eventName: event.name,
        eventDetails: event,
      },
    });
    onClose();
  };

  // Compose all unique location names as a comma-separated string
  const allLocationNames =
    eventLocations.length > 0
      ? Array.from(new Set(eventLocations.map((loc) => loc.locationName))).join(
          ", "
        )
      : "To be shared";

  // Compose all unique event dates from eventLocations
  //@ts-ignore
  const allEventDates = eventLocations
    .map((loc) => loc.eventDate)
    .filter((date) => !!date && date !== "0001-01")
    .map((date) => {
      try {
        const d = new Date(date);
        return d.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  // const uniqueEventDates = Array.from(new Set(allEventDates)).join(", ") || "To be shared";

  // Handler for "all August activities" link
  const handleAugustActivitiesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClose();
    setTimeout(() => {
      navigate("/we-care-month");
    }, 200);
  };

  // Responsive: Show fixed bottom button on mobile, hide sticky sidebar button
  // Tailwind: 'block lg:hidden' for mobile, 'hidden lg:block' for desktop

  // Helper to format multiple dates and date ranges
  const formatEventLocationDates = (
    dateType: string | undefined,
    dates: string[] | undefined,
    fallbackDate: string
  ) => {
    if (!dates || dates.length === 0) return fallbackDate;
    // Filter out invalid/empty dates
    const validDates = dates
      .map((d) => {
        if (!d) return null;
        const dateObj = new Date(d);
        return isNaN(dateObj.getTime()) ? null : dateObj;
      })
      .filter(Boolean) as Date[];

    if (validDates.length === 0) return fallbackDate;

    // Sort dates ascending
    validDates.sort((a, b) => a.getTime() - b.getTime());

    if (dateType === "M") {
      // Multiple dates: show as comma separated, e.g. "21 Aug 2025, 24 Aug 2025"
      return validDates
        .map((date) =>
          date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        )
        .join(", ");
    }
    if (dateType === "R" && validDates.length > 1) {
      // Range: show as "21 Aug 2025 - 25 Aug 2025"
      const start = validDates[0];
      const end = validDates[validDates.length - 1];
      return `${start.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })} - ${end.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })}`;
    }
    // Single date
    const date = validDates[0];
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Fetch dates for each event location when eventLocations change
  useEffect(() => {
    if (!eventLocations || eventLocations.length === 0) return;
    eventLocations.forEach((loc) => {
      if (
        (loc.dateType === "M" || loc.dateType === "R") &&
        !locationDates[loc.eventLocationId]
      ) {
        setLoadingDates((prev) => ({ ...prev, [loc.eventLocationId]: true }));
        getEventLocationsDateByEventLocId(loc.eventLocationId)
          .then((res) => {
            // Map API response to array of date strings
            // API response: [{ eventLocationDatesId, date }]
            const dates =
              Array.isArray(res.data)
                ? res.data
                    .map((d: any) => d.date?.slice(0, 10) || "")
                    .filter(Boolean)
                : [];
            setLocationDates((prev) => ({
              ...prev,
              [loc.eventLocationId]: dates,
            }));
          })
          .catch(() => {
            setLocationDates((prev) => ({
              ...prev,
              [loc.eventLocationId]: [],
            }));
          })
          .finally(() => {
            setLoadingDates((prev) => ({
              ...prev,
              [loc.eventLocationId]: false,
            }));
          });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventLocations]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4"
          initial="initial"
          animate="animate"
          exit="initial"
          variants={fadeInVariants("none", 0)} // <-- Use fadeInVariants for overlay
          onClick={onClose}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[96vh] overflow-hidden"
            initial="initial"
            animate="animate"
            exit="initial"
            variants={fadeInVariants("up", 0.08)} // <-- Use fadeInVariants for modal
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-1 flex flex-col overflow-y-auto max-h-[96vh] custom-scrollbar">
              {/* Title Bar with Image (not fixed, scrolls with content) */}
              <div className="relative w-full">
                {eventImageUrl && (
                  <motion.div
                    className="w-full h-[400px] bg-gray-200 overflow-hidden flex items-center justify-center"
                    initial="initial"
                    animate="animate"
                    exit="initial"
                    variants={fadeInVariants("up", 0.12)} // Animate image
                  >
                    <img
                      src={eventImageUrl}
                      alt={event.title || event.name}
                      className="w-full h-full object-contain"
                      style={{ maxHeight: 400, objectFit: "contain" }}
                    />
                  </motion.div>
                )}
                <div className="absolute top-4 right-4 z-10">
                  <motion.button
                    onClick={onClose}
                    className="text-white bg-black/60 cursor-pointer hover:bg-black/80 rounded-full p-2 transition-colors"
                    initial="initial"
                    animate="animate"
                    exit="initial"
                    variants={fadeInVariants("down", 0.13)} // Animate close button
                  >
                    <X className="w-6 h-6" />
                  </motion.button>
                </div>
                <motion.div
                  className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent px-6 py-6"
                  initial="initial"
                  animate="animate"
                  exit="initial"
                  variants={fadeInVariants("up", 0.15)} // Animate title bar
                >
                  <h2 className="text-2xl font-bold text-white">
                    {event.title || event.name}
                  </h2>
                  {event.subName && (
                    <p className="text-yellow-100 mt-1">{event.subName}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <div
                      className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                        isCompleted
                          ? "bg-red-100 text-red-800"
                          : eventStatus.type === "upcoming"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      <eventStatus.icon className="w-4 h-4" />
                      {eventStatus.label}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Content */}
              <div className={`p-6 ${!isCompleted ? "pb-28 lg:pb-6" : ""}`}>
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Left Column - Event Details */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* ✅ Event Status Alert */}
                    {isCompleted && (
                      <motion.div
                        className="bg-red-50 border border-red-200 rounded-lg p-4"
                        initial="initial"
                        animate="animate"
                        exit="initial"
                        variants={fadeInVariants("down", 0.18)} // Animate alert
                      >
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-red-900 mb-1">
                              Event Completed
                            </h4>
                            <p className="text-red-700 text-sm">
                              This event has been completed and is no longer
                              accepting nominations. Thank you for your interest
                              in volunteering!
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Event Description */}
                    <motion.div
                      initial="initial"
                      animate="animate"
                      exit="initial"
                      variants={fadeInVariants("up", 0.2)}
                    >
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        Event Details
                      </h3>
                      <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {renderHtmlContent(event.description)}
                      </div>
                    </motion.div>

                    {/* Event Locations Section */}
                    <motion.div
                      initial="initial"
                      animate="animate"
                      exit="initial"
                      variants={fadeInVariants("up", 0.22)}
                    >
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-yellow-600" />
                        Event Locations & Schedule
                      </h3>
                      {loadingLocations ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="w-6 h-6 animate-spin text-yellow-500" />
                          <span className="ml-2 text-gray-600 dark:text-gray-400">
                            Loading location details...
                          </span>
                        </div>
                      ) : eventLocations.length === 0 ? (
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 text-center">
                          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            Location Details Coming Soon
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400">
                            Specific location and timing details will be shared
                            closer to the event date.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {eventLocations.map((location, index) => {
                            // Determine if date/time should be shown for this location
                            const showDateTime = event.enableConf === "true" && isValidDate(location.eventDate);
                            const isMultiOrRange = location.dateType === "M" || location.dateType === "R";
                            const dates = locationDates[location.eventLocationId];
                            const isLoadingDates = loadingDates[location.eventLocationId];

                            return (
                              <motion.div
                                key={location.eventLocationId}
                                className="bg-yellow-100 border border-yellow-300 rounded-lg p-5"
                                initial="initial"
                                animate="animate"
                                exit="initial"
                                variants={fadeInVariants("up", 0.24 + index * 0.04)}
                              >
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-yellow-400 text-[#2B0A3D] rounded-full flex items-center justify-center text-sm font-bold">
                                      {index + 1}
                                    </div>
                                    <div>
                                      <h4 className="text-lg font-semibold text-[#2B0A3D]">
                                        {location.locationName}
                                      </h4>
                                      <p className="text-[#2B0A3D] text-sm">
                                        {/* Always show "To be shared" for date if enableConf is not true */}
                                        {event.enableConf !== "true"
                                          ? "To be shared"
                                          : isMultiOrRange ? (
                                              isLoadingDates ? (
                                                <span>Loading dates...</span>
                                              ) : (
                                                formatEventLocationDates(
                                                  location.dateType,
                                                  dates,
                                                  showDateTime ? location.eventDate : "To be shared"
                                                )
                                              )
                                            ) : showDateTime ? (
                                              formatDate(location.eventDate)
                                            ) : (
                                              "To be shared"
                                            )}
                                      </p>
                                      {/* Show tentative month/year for year-round activities */}
                                      {isYearRound && tentativeMonth && tentativeYear && (
                                        <p className="text-md font-bold text-[#2B0A3D] mt-1">
                                          Tentative: {getMonthName(tentativeMonth)} {tentativeYear}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="bg-white rounded-lg px-3 py-2 shadow-sm">
                                    <div className="flex items-center gap-2 text-sm text-[#2B0A3D]">
                                      <Clock className="w-4 h-4" />
                                      <span className="font-medium">
                                        {/* Always show "To be shared" for time if enableConf is not true */}
                                        {event.enableConf !== "true"
                                          ? "To be shared"
                                          : showDateTime &&
                                            isValidTime(location.startTime) &&
                                            isValidTime(location.endTime)
                                          ? `${formatTime(location.startTime)} - ${formatTime(
                                              location.endTime
                                            )}`
                                          : "To be shared"}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                {/* Venue details */}
                                {event.enableConf !== "true" ? (
                                  <div className="mt-3">
                                    <h5 className="text-sm font-semibold text-[#2B0A3D] mb-2">
                                      Venue Details:
                                    </h5>
                                    <div className="flex items-center gap-2 text-sm text-[#2B0A3D] italic">
                                      <ChevronRight className="w-3 h-3" />
                                      <span>Venue details to be shared</span>
                                    </div>
                                  </div>
                                ) : formatVenue(location.venue).length > 0 ? (
                                  <div className="mt-3">
                                    <h5 className="text-sm font-semibold text-[#2B0A3D] mb-2">
                                      Venue Details:
                                    </h5>
                                    <div className="space-y-1">
                                      {formatVenue(location.venue).map(
                                        (venueItem: string, venueIndex: number) => (
                                          <div
                                            key={venueIndex}
                                            className="flex items-center gap-2 text-sm text-[#2B0A3D]"
                                          >
                                            <ChevronRight className="w-3 h-3" />
                                            <span>{venueItem}</span>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="mt-3">
                                    <h5 className="text-sm font-semibold text-[#2B0A3D] mb-2">
                                      Venue Details:
                                    </h5>
                                    <div className="flex items-center gap-2 text-sm text-[#2B0A3D] italic">
                                      <ChevronRight className="w-3 h-3" />
                                      <span>Venue details to be shared</span>
                                    </div>
                                  </div>
                                )}
                              </motion.div>
                            );
                          })}
                        </div>
                      )}
                    </motion.div>
                  </div>

                  {/* Right Column - Quick Info & Actions (Sticky, hidden on mobile) */}
                  <div className="space-y-6 hidden lg:block">
                    <div className="sticky top-6">
                      {/* Quick Event Info */}
                      <motion.div
                        className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3"
                        initial="initial"
                        animate="animate"
                        exit="initial"
                        variants={fadeInVariants("right", 0.28)}
                      >
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                          Quick Info
                        </h4>
                        {/* Location row with MapPin icon, prevent icon shrink */}
                        <div className="flex items-start gap-2">
                          <span className="flex-shrink-0 flex items-center justify-center mt-0.5">
                            <MapPin className="w-5 h-5 text-yellow-600" />
                          </span>
                          <span className="font-semibold flex-1 block">
                            Locations:
                            <span className="whitespace-pre-line break-words text-gray-900 font-normal dark:text-white">
                              {" "}
                              {loadingLocations
                                ? "Loading..."
                                : allLocationNames}
                            </span>
                          </span>
                        </div>
                        {/* Status row with Info/CheckCircle2 icon, prevent icon shrink */}
                        <div className="flex items-center gap-2">
                          <span className="flex-shrink-0 flex items-center justify-center">
                            {eventStatus.type === "completed" ? (
                              <CheckCircle2 className="w-5 h-5 text-green-600" />
                            ) : (
                              <Info className="w-5 h-5 text-blue-600" />
                            )}
                          </span>
                          <span className="font-semibold">Status:</span>
                          <span className={eventStatus.color + " break-words"}>
                            {eventStatus.label}
                          </span>
                        </div>
                      </motion.div>

                      {/* ✅ Updated Nomination Button Section */}
                      <motion.div
                        className={`border rounded-lg p-4 mt-6 ${
                          isCompleted
                            ? "bg-red-50 border-red-200"
                            : "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
                        } dark:from-green-900/20 dark:to-emerald-900/20 dark:border-green-800`}
                        initial="initial"
                        animate="animate"
                        exit="initial"
                        variants={fadeInVariants("right", 0.32)}
                      >
                        <h4
                          className={`font-semibold mb-3 ${
                            isCompleted
                              ? "text-red-900 dark:text-red-100"
                              : "text-green-900 dark:text-green-100"
                          }`}
                        >
                          {isCompleted
                            ? "Event Status"
                            : "Ready to Make a Difference?"}
                        </h4>
                        <p
                          className={`text-sm mb-3 ${
                            isCompleted
                              ? "text-red-700 dark:text-red-300"
                              : "text-green-700 dark:text-green-300"
                          }`}
                        >
                          {isCompleted
                            ? "This event has been completed. Thank you to all who participated in making a difference!"
                            : "Join this amazing volunteering opportunity and contribute to a meaningful cause."}
                        </p>
                        {isCompleted ? (
                          <motion.div
                            className="w-full bg-gray-400 text-gray-600 font-semibold px-6 py-3 rounded-lg flex items-center justify-center gap-2 cursor-not-allowed"
                            whileTap={{ scale: 0.98 }}
                          >
                            <CheckCircle2 className="w-5 h-5" />
                            Event Completed
                          </motion.div>
                        ) : (
                          <button
                            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer active:scale-95"
                            onClick={handleNominate}
                          >
                            <UserPlus className="w-8 h-8" />
                            Click here to <br /> Participate / Nominate
                          </button>
                        )}
                      </motion.div>

                      {/* Special Note for We Care Month */}
                      {selectedMonth === "August" && (
                        <motion.div
                          className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mt-6"
                          initial="initial"
                          animate="animate"
                          exit="initial"
                          variants={fadeInVariants("right", 0.36)}
                        >
                          <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                            🤗 This is part of our special "We Care Month"
                            celebration! Check out{" "}
                            <span
                              role="button"
                              tabIndex={0}
                              onClick={handleAugustActivitiesClick}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ")
                                  handleAugustActivitiesClick(e as any);
                              }}
                              className="underline text-yellow-900 font-semibold hover:text-yellow-700 transition cursor-pointer"
                            >
                              all August activities
                            </span>{" "}
                            for a complete experience.
                          </p>
                        </motion.div>
                      )}
                    </div>
                  </div>
                  {/* End Right Column */}
                </div>
              </div>
            </div>
            {/* Fixed mobile nominate button */}
            {!isCompleted && (
              <div className="block lg:hidden fixed left-0 right-0 bottom-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-3">
                <motion.button
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-4 text-base"
                  whileTap={{ scale: 0.97 }}
                  onClick={handleNominate}
                  initial="initial"
                  animate="animate"
                  exit="initial"
                  variants={fadeInVariants("up", 0.38)}
                >
                  <UserPlus className="w-8 h-8" />
                  Click Here to <br/>Participate / Nominate 
                </motion.button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EventDetailsModal;
