import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  sectionVariants,
  cardVariants,
  staggerChildrenVariants,
} from "../../utils/animationVariants";
import {
  Info,
  Loader2,
  Calendar as CalendarIcon,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from "lucide-react";
import EventDetailsModal from "./modals/EventDetailsModal"; // <-- Add this import

// Dummy Event type (no API dependency)
interface Event {
  id: number;
  title: string;
  details?: string;
  requirements?: string[];
  duration?: string;
  location?: string;
  objective?: string;
  date?: string;
  time?: string;
  venue?: string;
  locations?: string[];
  faqs?: { q: string; a: string }[];
  displayDate?: string;
  image?: string;
  color?: string;
  monthValue?: number;
  loadingLocations?: boolean;
  loadingImage?: boolean;
  tentativeMonth?: string;
  tentativeYear?: string;
  subName?: string;
  name?: string;
  eventId?: number;
  activityId?: number;
  type?: string;
  description?: string;
}

// Financial year months (April to March)
const financialYearMonths = [
  { name: "April", value: 4 },
  { name: "May", value: 5 },
  { name: "June", value: 6 },
  { name: "July", value: 7 },
  { name: "August", value: 8 },
  { name: "September", value: 9 },
  { name: "October", value: 10 },
  { name: "November", value: 11 },
  { name: "December", value: 12 },
  { name: "January", value: 1 },
  { name: "February", value: 2 },
  { name: "March", value: 3 },
];

const BASE_URL = import.meta.env.BASE_URL || "/";

// Color mapping for months (consistent color for same month)
const monthColors = [
  "bg-blue-500", // April
  "bg-green-500", // May
  "bg-purple-500", // June
  "bg-red-500", // July
  "bg-yellow-500", // August
  "bg-indigo-500", // September
  "bg-pink-500", // October
  "bg-teal-500", // November
  "bg-orange-500", // December
  "bg-cyan-500", // January
  "bg-lime-500", // February
  "bg-amber-500", // March
];

const getMonthColor = (monthValue: number) => {
  const idx = financialYearMonths.findIndex((m) => m.value === monthValue);
  return monthColors[idx % monthColors.length];
};

const AnnualEventsCalendar = () => {
  const navigate = useNavigate();

  // Dummy events data for static site
  const dummyEvents: Event[] = [
    {
      id: 1,
      title: "Tree Plantation Drive",
      details: "Join us for a tree plantation drive in your city.",
      requirements: ["Enthusiasm", "Team spirit"],
      duration: "Half Day",
      location: "Mumbai",
      objective: "Increase green cover",
      date: "2025-06-15",
      time: "09:00 AM",
      venue: "City Park",
      locations: ["Mumbai"],
      faqs: [{ q: "What to bring?", a: "Water bottle, cap" }],
      displayDate: "Jun 2025",
      image: `${BASE_URL}/images/photos/image1.jpeg`,
      color: getMonthColor(6),
      monthValue: 6,
      loadingLocations: false,
      loadingImage: false,
      tentativeMonth: "6",
      tentativeYear: "2025",
      subName: "Environment",
      name: "Tree Plantation Drive",
      eventId: 1,
      activityId: 1,
      type: "annual",
      description: "Annual tree plantation event.",
    },
    {
      id: 2,
      title: "Blood Donation Camp",
      details: "Donate blood and save lives.",
      requirements: ["Good health"],
      duration: "Full Day",
      location: "Delhi",
      objective: "Support local hospitals",
      date: "2025-08-10",
      time: "10:00 AM",
      venue: "Community Hall",
      locations: ["Delhi"],
      faqs: [{ q: "Who can donate?", a: "Anyone above 18 years" }],
      displayDate: "Aug 2025",
      image: `${BASE_URL}/images/photos/image2.jpeg`,
      color: getMonthColor(8),
      monthValue: 8,
      loadingLocations: false,
      loadingImage: false,
      tentativeMonth: "8",
      tentativeYear: "2025",
      subName: "Health",
      name: "Blood Donation Camp",
      eventId: 2,
      activityId: 2,
      type: "annual",
      description: "Annual blood donation event.",
    },
    {
      id: 3,
      title: "We Care Month",
      details: "Special month of giving back.",
      requirements: [],
      duration: "Full Month",
      location: "All Locations",
      objective: "Corporate Social Responsibility",
      date: "2025-08-01",
      time: "",
      venue: "",
      locations: ["All Locations"],
      faqs: [],
      displayDate: "Aug 2025",
      image: `${BASE_URL}/images/photos/image25.jpeg`,
      color: getMonthColor(8),
      monthValue: 8,
      loadingLocations: false,
      loadingImage: false,
      tentativeMonth: "8",
      tentativeYear: "2025",
      subName: "CSR",
      name: "We Care Month",
      eventId: 3,
      activityId: 3,
      type: "annual",
      description: "Special month of giving back.",
    },
    // Add more dummy events as needed
  ];

  // Remove all useEffect and API loading logic, use dummy data directly
  const [selectedFinancialYear, setSelectedFinancialYear] = useState(2025);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null); // null = full year
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [hoveredEvents] = useState<{ title: string; date: string }[]>([]);
  const [events] = useState<Event[]>(dummyEvents);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);
  const [eventsLoaded] = useState(true);

  // Ref for the section
  const sectionRef = useRef<HTMLDivElement>(null);

  // Scroll to section top helper
  const scrollToSectionTop = () => {
    requestAnimationFrame(() => {
      if (sectionRef.current) {
        // Get the section's position relative to the document
        const rect = sectionRef.current.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        // Adjust 96 to your sticky header height, or 0 if none
        const offset = 96;
        const top = rect.top + scrollTop - offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    });
  };

  // Get current financial year
  // const getCurrentFinancialYear = () => {
  //   const now = new Date();
  //   const currentMonth = now.getMonth() + 1; // 1-12
  //   const currentYear = now.getFullYear();
  //   return currentMonth >= 4 ? currentYear : currentYear - 1;
  // };

  // const formatDisplayDate = (month: number, year: number): string => {
  //   const monthNames = [
  //     "Jan",
  //     "Feb",
  //     "Mar",
  //     "Apr",
  //     "May",
  //     "Jun",
  //     "Jul",
  //     "Aug",
  //     "Sep",
  //     "Oct",
  //     "Nov",
  //     "Dec",
  //   ];
  //   const monthName = monthNames[month - 1] || "Unknown";
  //   return `${monthName} ${year}`;
  // };

  // Get events for selected financial year and selected month/full year
  const getFilteredEvents = (): Event[] => {
    const filtered = events.filter((event) => {
      const eventMonth = parseInt(event.tentativeMonth ?? "0");
      const eventYear = parseInt(event.tentativeYear ?? "0");
      const isInFinancialYear =
        (eventMonth >= 4 && eventYear === selectedFinancialYear) ||
        (eventMonth <= 3 && eventYear === selectedFinancialYear + 1);
      if (!isInFinancialYear) return false;
      if (selectedMonth !== null) {
        return eventMonth === selectedMonth;
      }
      return true;
    });
    // Sort by year, then month
    filtered.sort((a, b) => {
      const yearA = parseInt(a.tentativeYear ?? "0");
      const yearB = parseInt(b.tentativeYear ?? "0");
      if (yearA !== yearB) return yearA - yearB;
      const monthA = parseInt(a.tentativeMonth ?? "0");
      const monthB = parseInt(b.tentativeMonth ?? "0");
      return monthA - monthB;
    });
    return filtered;
  };

  // Get months that have events for the selected financial year
  const getMonthsWithEvents = () => {
    const monthsWithEvents = new Map<number, { count: number }>();
    events.forEach((event) => {
      const eventMonth = parseInt(event.tentativeMonth ?? "0");
      const eventYear = parseInt(event.tentativeYear ?? "0");
      const isInFinancialYear =
        (eventMonth >= 4 && eventYear === selectedFinancialYear) ||
        (eventMonth <= 3 && eventYear === selectedFinancialYear + 1);
      if (isInFinancialYear) {
        const existing = monthsWithEvents.get(eventMonth) || { count: 0 };
        existing.count += 1;
        monthsWithEvents.set(eventMonth, existing);
      }
    });
    return monthsWithEvents;
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const nextFinancialYear = () => {
    setSelectedFinancialYear((prev) => prev + 1);
    setSelectedMonth(null); // Reset to full year on year change
    scrollToSectionTop();
  };

  const prevFinancialYear = () => {
    setSelectedFinancialYear((prev) => prev - 1);
    setSelectedMonth(null); // Reset to full year on year change
    scrollToSectionTop();
  };

  // Only one month can be selected at a time, or full year (null)
  const handleMonthSelect = (monthValue: number) => {
    setSelectedMonth((prev) => (prev === monthValue ? null : monthValue));
    scrollToSectionTop();
  };

  // Full year selection
  const selectFullYear = () => {
    setSelectedMonth(null);
    scrollToSectionTop();
  };

  const isEventHovered = (
    event: { title: string; date: string },
    idx: number
  ) =>
    hoveredEvents.some(
      (e) => e.title === event.title && e.date === event.date
    ) || hoveredIdx === idx;

  const getSelectedMonthName = (): string | null => {
    if (selectedMonth === null) return null;
    const month = financialYearMonths.find((m) => m.value === selectedMonth);
    return month ? month.name : null;
  };

  const renderMonthSelector = () => {
    const monthsWithEvents = getMonthsWithEvents();

    return (
      <div className="bg-white rounded-xl shadow-md p-4 sticky top-4">
        {/* Financial Year Navigator */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevFinancialYear}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={selectFullYear}
            className={`font-bold text-lg px-4 py-2 rounded-lg transition-all cursor-pointer active:scale-95 ${
              selectedMonth === null
                ? "text-black shadow-md border-2 border-yellow-400 bg-yellow-300"
                : "text-gray-800 hover:bg-yellow-50 hover:text-yellow-600 border-2 border-transparent"
            }`}
          >
            FY {selectedFinancialYear}  - {selectedFinancialYear + 1}
          </button>

          <button
            onClick={nextFinancialYear}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Month Grid: only one can be selected */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {financialYearMonths.map((month) => {
            const isAugust = month.value === 8;
            const isSelected = selectedMonth === month.value;
            const monthData = monthsWithEvents.get(month.value);
            const hasEvents = monthData && monthData.count > 0;
            const eventCount = monthData?.count || 0;

            // Gray background when not selected, color when selected
            let baseBg = isSelected
              ? getMonthColor(month.value)
              : "bg-gray-100";
            let textColor = isSelected
              ? "text-white"
              : hasEvents
              ? "text-gray-800"
              : "text-gray-500";

            // Special case for August
            if (isAugust) {
              baseBg = isSelected ? "bg-red-600" : "bg-gray-100";
              textColor = isSelected ? "text-white" : "text-red-600";
              return (
                <button
                  key={month.value}
                  onClick={() => handleMonthSelect(month.value)}
                  className={`p-3 rounded-lg text-sm font-bold transition-all relative overflow-hidden cursor-pointer active:scale-95 border-2 flex flex-col items-center ${baseBg} ${textColor} ${
                    isSelected
                      ? "shadow-md border-transparent"
                      : hasEvents
                      ? "border-yellow-200 hover:bg-yellow-50"
                      : "border-gray-200 hover:bg-gray-200"
                  }`}
                >
                  <div className="relative z-10 flex flex-col items-center">
                    <div
                      className="font-semibold"
                      style={{ color: isSelected ? "#fff" : "#EAB308" }}
                    >
                      August
                    </div>
                    <div
                      className="text-xs mt-1 font-semibold text-red-600"
                      style={{ color: isSelected ? "#fff" : "#EAB308" }}
                    >
                      "We Care Month"
                    </div>
                  </div>
                </button>
              );
            }

            return (
              <button
                key={month.value}
                onClick={() => handleMonthSelect(month.value)}
                className={`p-3 rounded-lg text-sm font-medium transition-all relative overflow-hidden cursor-pointer active:scale-95 border-2 ${baseBg} ${textColor} ${
                  isSelected
                    ? "shadow-md border-transparent"
                    : hasEvents
                    ? "border-yellow-200 hover:bg-yellow-50"
                    : "border-gray-200 hover:bg-gray-200"
                }`}
              >
                <div className="relative z-10">
                  <div className="font-semibold">
                    {month.name.substring(0, 3)}
                  </div>
                  {hasEvents && (
                    <div
                      className={`text-xs mt-1 ${
                        isSelected ? "text-white/90" : "opacity-90"
                      }`}
                    >
                      {eventCount} event{eventCount !== 1 ? "s" : ""}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const filteredEvents = getFilteredEvents();

  // Loading state (only show loader if nothing loaded yet)
  if (loading && !eventsLoaded) {
    return (
      <motion.section
        className="w-full py-10 px-2 md:px-0 mb-6 bg-white"
        variants={sectionVariants}
        initial="initial"
        animate="animate"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-8"
            variants={staggerChildrenVariants(0.1)(0)}
          >
            <div className="flex items-center justify-center mb-4">
              <div className="h-1 bg-yellow-400 w-16 mr-4"></div>
              <span className="text-gray-600 font-medium tracking-wide uppercase text-sm">
                ANNUAL VOLUNTEERING EVENTS & OPPORTUNITIES
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Annual Volunteering Calendar
            </h2>
          </motion.div>

          <motion.div
            className="flex items-center justify-center py-16"
            variants={staggerChildrenVariants(0.1)(1)}
          >
            <div className="flex items-center gap-3 text-gray-600">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Loading annual events...</span>
            </div>
          </motion.div>
        </div>
      </motion.section>
    );
  }

  // Error state
  if (error) {
    return (
      <motion.section
        className="w-full py-10 px-2 md:px-0 mb-6 bg-white"
        variants={sectionVariants}
        initial="initial"
        animate="animate"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-8"
            variants={staggerChildrenVariants(0.1)(0)}
          >
            <div className="flex items-center justify-center mb-4">
              <div className="h-1 bg-yellow-400 w-16 mr-4"></div>
              <span className="text-gray-600 font-medium tracking-wide uppercase text-sm">
                ANNUAL VOLUNTEERING EVENTS & OPPORTUNITIES
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Annual Volunteering Calendar
            </h2>
          </motion.div>

          <motion.div
            className="flex flex-col items-center justify-center py-16 text-center"
            variants={staggerChildrenVariants(0.1)(1)}
          >
            <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
            <p className="text-gray-600 mb-2">Unable to load annual events</p>
            <button
              className="text-blue-600 hover:text-blue-800 font-medium cursor-not-allowed opacity-60"
              disabled
            >
              Try again
            </button>
          </motion.div>
        </div>
      </motion.section>
    );
  }

  // No events state
  if (eventsLoaded && events.length === 0) {
    return (
      <motion.section
        className="w-full py-10 px-2 md:px-0 mb-6 bg-white"
        variants={sectionVariants}
        initial="initial"
        animate="animate"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-8"
            variants={staggerChildrenVariants(0.1)(0)}
          >
            <div className="flex items-center justify-center mb-4">
              <div className="h-1 bg-yellow-400 w-16 mr-4"></div>
              <span className="text-gray-600 font-medium tracking-wide uppercase text-sm">
                ANNUAL VOLUNTEERING EVENTS & OPPORTUNITIES
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Annual Volunteering Calendar
            </h2>
          </motion.div>

          <motion.div
            className="flex flex-col items-center justify-center py-16 text-center"
            variants={staggerChildrenVariants(0.1)(1)}
          >
            <CalendarIcon className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-600">No annual events scheduled</p>
            <p className="text-sm text-gray-500 mt-1">
              Check back for upcoming annual activities!
            </p>
          </motion.div>
        </div>
      </motion.section>
    );
  }

  // Main content
  return (
    <>
      <motion.section
        ref={sectionRef}
        className="w-full py-10 px-2 md:px-0 mb-6 bg-white scroll-mt-24"
        variants={sectionVariants}
        initial="initial"
        animate="animate"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-8"
            variants={staggerChildrenVariants(0.1)(0)}
          >
            <div className="flex items-center justify-center mb-4">
              <div className="h-1 bg-yellow-400 w-16 mr-4"></div>
              <span className="text-gray-600 font-medium tracking-wide uppercase text-sm">
                ANNUAL VOLUNTEERING EVENTS & OPPORTUNITIES
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Annual Volunteering Calendar
            </h2>
          </motion.div>

          <div className="flex flex-col md:flex-row gap-8">
            <motion.div
              className="md:w-80"
              variants={staggerChildrenVariants(0.1)(1)}
            >
              {renderMonthSelector()}
            </motion.div>

            <motion.div
              className="flex-1"
              variants={staggerChildrenVariants(0.1)(2)}
            >
              <div className="mb-6">
                {selectedMonth === 8 ? (
                  <div
                    className="relative flex flex-col items-center justify-center w-full h-full min-h-[20rem] sm:min-h-[28rem] rounded-xl overflow-hidden"
                    style={{
                      minHeight: "20rem",
                      height: "100%",
                    }}
                  >
                    {/* Background image */}
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: `url('${BASE_URL}/images/photos/image25.jpeg')`,
                        zIndex: 1,
                      }}
                    />
                    {/* Overlay */}
                    <div
                      className="absolute inset-0 bg-black/55"
                      style={{ zIndex: 2 }}
                    />
                    {/* Centered content */}
                    <div className="relative z-10 flex flex-col items-center justify-center h-full w-full px-2 sm:px-4">
                      <div className="relative flex flex-col items-center">
                        <div className="text-xl xs:text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-2 text-center leading-tight">
                          "We Care Month" at Alkem
                        </div>
                        <img
                          src={`${BASE_URL}/graphics/smile_underline.svg`}
                          alt="underline"
                          className="absolute left-1/2 -translate-x-1/2 -bottom-6 sm:-bottom-8 w-[120px] sm:w-[200px] h-auto"
                          style={{ pointerEvents: "none" }}
                        />
                      </div>
                      <div className="text-sm xs:text-base md:text-lg text-white mb-6 mt-8 text-center max-w-xs sm:max-w-xl drop-shadow-lg">
                        Learn about and be a part of We Care Month – our special
                        month of giving back!
                      </div>
                      <button
                        className="inline-block cursor-pointer px-4 sm:px-6 py-2 bg-red-600 text-white font-bold rounded-lg shadow hover:bg-red-700 transition active:scale-95 text-sm sm:text-base"
                        onClick={() => navigate("/we-care-month#we-care-calendar")}
                      >
                        Go to "We Care Month" Calendar
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Only show event cards if not August */}
              {selectedMonth === 8 ? null : filteredEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center bg-gray-50 rounded-xl">
                  <CalendarIcon className="w-16 h-16 text-gray-300 mb-4" />
                  <h4 className="text-lg font-medium text-gray-700 mb-2">
                    No Events Found
                  </h4>
                  <p className="text-gray-500 mb-4">
                    There are no annual events in the selected{" "}
                    {selectedMonth === null ? "financial year" : "month"} for FY{" "}
                    {selectedFinancialYear}-{selectedFinancialYear + 1}
                  </p>
                  <p className="text-sm text-gray-400">
                    Try selecting a different month or financial year
                  </p>
                </div>
              ) : (
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6"
                  variants={cardVariants.container}
                  initial="initial"
                  animate="animate"
                >
                  {filteredEvents.map((event, idx) => (
                    <motion.div
                      key={`${event.eventId}-${idx}`}
                      className="relative flex flex-col h-80 bg-white rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer border border-gray-100 group overflow-hidden
        sm:h-96
        md:h-[22rem]
        xl:h-[24rem]
        w-full
        "
                      variants={cardVariants.item}
                      whileHover="hover"
                      onMouseEnter={() => setHoveredIdx(idx)}
                      onMouseLeave={() => setHoveredIdx(null)}
                      onClick={() => handleEventClick(event)}
                    >
                      {/* Background Image with overlay */}
                      {event.image && (
                        <div
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                          style={{
                            backgroundImage: `url(${event.image})`,
                          }}
                        />
                      )}

                      {/* Black overlay for text readability */}
                      <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-colors"></div>

                      {/* Fallback color background if no image */}
                      {!event.image && (
                        <div
                          className={`absolute inset-0 ${event.color} opacity-90`}
                        ></div>
                      )}

                      {/* Highlight effect on hover */}
                      {isEventHovered(
                        {
                          title: event.title ?? event.name ?? "",
                          date: event.date ?? "",
                        },
                        idx
                      ) && (
                        <div className="absolute inset-0 z-10 rounded-xl ring-2 ring-blue-400 bg-blue-400/10 transition-all" />
                      )}

                      {/* Event indicator: color by month */}
                      <div
                        className={`absolute top-0 left-0 right-0 h-1 z-20 ${getMonthColor(
                          event.monthValue ?? 0
                        )}`}
                      ></div>

                      {/* Event content */}
                      <div className="relative z-20 flex flex-col justify-between h-full p-4 sm:p-6 text-white">
                        <div>
                          <div className="text-md text-white font-medium mb-2">
                            {event.displayDate}
                          </div>
                          <h3 className="font-bold text-white text-xl sm:text-2xl mb-3 group-hover:text-blue-200 transition-colors line-clamp-2">
                            {event.title || event.name}
                          </h3>
                          {event.subName && (
                            <p className="text-gray-200 mb-4 text-base sm:text-lg line-clamp-2">
                              {event.subName}
                            </p>
                          )}
                          <div className="text-gray-200 mb-4 flex items-start gap-2 text-sm sm:text-md">
                            <MapPin className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 mt-0.5" />
                            <span className="line-clamp-2">
                              {event.loadingLocations ? (
                                <span className="italic text-gray-300">Loading location...</span>
                              ) : event.locations && event.locations.length > 0 ? (
                                event.locations.join(", ")
                              ) : (
                                "Location TBD"
                              )}
                            </span>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-blue-300 font-semibold text-xs sm:text-sm transition-opacity duration-200">
                              <span>Learn More</span>
                              <Info className="w-4 h-4" />
                            </div>

                            {/* Loading indicator for this specific image */}
                            {event.loadingImage && (
                              <div className="flex items-center gap-1 text-blue-300 text-xs">
                                <Loader2 className="w-3 h-3 animate-spin" />
                                Loading image...
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Event Details Modal */}
      {selectedEvent && (
        <EventDetailsModal
          isOpen={isModalOpen}
          onClose={closeModal}
          event={selectedEvent}
          selectedMonth={getSelectedMonthName() ?? undefined}
          eventImageUrl={selectedEvent.image} // <-- Pass the image URL here
        />
      )}
    </>
  );
};

export default AnnualEventsCalendar;