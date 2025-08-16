import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import {
  MessageCircle,
  Send,
  Loader2,
  AlertCircle,
  User,
  Calendar,
  X,
  Lightbulb,
  Clock,
} from "lucide-react";
import { cardVariants, fadeInVariants } from "../../../utils/animationVariants";
import AchievementsSectionHeader from "./AchievementsSectionHeader";
import NotificationToast from "../../ui/NotificationToast";

// Dummy types
interface Event {
  eventId: number;
  name: string;
  subName?: string;
  tentativeMonth?: string;
  tentativeYear?: string;
  type?: string;
}

interface Suggestion {
  suggestionId: number;
  description: string;
  employeeName: string;
  employeeDesig?: string;
  addedOn: string;
  type: string;
}

// Dummy data
const dummyEvents: Event[] = [
  {
    eventId: 1,
    name: "Tree Plantation Drive",
    subName: "Environmental Initiative",
    tentativeMonth: "8",
    tentativeYear: "2025",
    type: "annual",
  },
  {
    eventId: 2,
    name: "Blood Donation Camp",
    subName: "Health Initiative",
    tentativeMonth: "9",
    tentativeYear: "2025",
    type: "annual",
  },
  {
    eventId: 3,
    name: "Literacy Program",
    subName: "Education Support",
    tentativeMonth: "10",
    tentativeYear: "2025",
    type: "year-round",
  },
];

const dummySuggestions: Suggestion[] = [
  {
    suggestionId: 1,
    description: "We should provide refreshments during the event",
    employeeName: "John Doe",
    employeeDesig: "Software Engineer",
    addedOn: "2025-08-15T10:30:00Z",
    type: "SUGGESTION",
  },
  {
    suggestionId: 2,
    description: "Add more locations for better accessibility",
    employeeName: "Jane Smith",
    employeeDesig: "Project Manager",
    addedOn: "2025-08-14T14:20:00Z",
    type: "SUGGESTION",
  },
];

const dummyUserDetails = {
  empcode: "EMP001",
  employeeId: 1001,
};

interface AchievementsSuggestionsProps {}

const AchievementsSuggestions: React.FC<AchievementsSuggestionsProps> = () => {
  // State management
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [employeeId, setEmployeeId] = useState<number>(1001);

  // Year and type filters
  const [selectedYear, setSelectedYear] = useState<string>(
    new Date().getFullYear().toString()
  );
  const [selectedEventType, setSelectedEventType] = useState<string>("annual");
  const [availableYears, setAvailableYears] = useState<string[]>([]);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  // Form state
  const [newSuggestion, setNewSuggestion] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    loadEmployeeIdAndEvents();
  }, []);

  useEffect(() => {
    if (employeeId && selectedYear) {
      loadEventsByYear();
    }
  }, [selectedYear, selectedEventType, employeeId]);

  // Initialize available years
  const initializeYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 2; i <= currentYear + 1; i++) {
      years.push(i.toString());
    }
    setAvailableYears(years);
  };

  // Load employee ID (using dummy data)
  const loadEmployeeIdAndEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use dummy data
      setEmployeeId(dummyUserDetails.employeeId);
      initializeYears();
    } catch (error) {
      console.error("❌ Error getting employee ID:", error);
      setError("Failed to get user information");
      setNotification({
        type: "error",
        message: "Failed to get user information",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load events by year and type (using dummy data)
  const loadEventsByYear = async () => {
    try {
      setLoading(true);
      setError(null);

      // Filter dummy events based on selected type
      const filteredEvents = dummyEvents.filter(
        (event) => event.type?.toLowerCase() === selectedEventType.toLowerCase()
      );

      setEvents(filteredEvents);
    } catch (error) {
      console.error("❌ Error loading events:", error);
      setError(`Failed to load events for ${selectedYear}`);
    } finally {
      setLoading(false);
    }
  };

  // Open suggestions modal
  const openSuggestionsModal = async (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
    setNewSuggestion("");

    // Load existing suggestions (dummy data)
    await loadSuggestions(event.eventId);
  };

  // Close modal
  const closeModal = () => {
    document.body.style.overflow = "unset";
    setIsModalOpen(false);
    setSelectedEvent(null);
    setSuggestions([]);
    setNewSuggestion("");
  };

  // Load suggestions for event (using dummy data)
  //@ts-ignore
  const loadSuggestions = async (eventId: number) => {
    try {
      setLoadingSuggestions(true);

      // Use dummy suggestions
      setSuggestions(dummySuggestions);
    } catch (error) {
      console.error("❌ Error loading suggestions:", error);
      setSuggestions([]);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  // Submit new suggestion (simulated)
  const handleSubmitSuggestion = async () => {
    if (!newSuggestion.trim() || !selectedEvent || !employeeId) return;

    try {
      setSubmitting(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setNotification({
        type: "success",
        message: "Suggestion submitted successfully!",
      });
      setNewSuggestion("");

      // Add new suggestion to list
      const newSugg: Suggestion = {
        suggestionId: Date.now(),
        description: newSuggestion.trim(),
        employeeName: "Current User",
        employeeDesig: "Employee",
        addedOn: new Date().toISOString(),
        type: "SUGGESTION",
      };
      setSuggestions((prev) => [newSugg, ...prev]);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    } catch (error) {
      console.error("❌ Error submitting suggestion:", error);
      setNotification({
        type: "error",
        message: "Failed to submit suggestion. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle keyboard shortcuts
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleSubmitSuggestion();
    }
  };

  // Format event date
  const formatEventDate = (event: Event): string => {
    if (event.tentativeYear && event.tentativeMonth) {
      const monthNames = [
        "",
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const monthIndex = parseInt(event.tentativeMonth);
      const monthName =
        monthNames[monthIndex] || `Month ${event.tentativeMonth}`;
      return `${monthName} ${event.tentativeYear}`;
    }
    return "Date TBD";
  };

  // Render event card
  const renderEventCard = (event: Event) => (
    <motion.div
      key={event.eventId}
      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow h-44 flex flex-col"
      variants={cardVariants.item}
    >
      <div className="flex-1">
        <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">
          {event.name}
        </h3>

        {event.subName && (
          <p className="text-xs text-gray-600 mb-2 line-clamp-1">
            {event.subName}
          </p>
        )}

        <div className="flex flex-col gap-1 text-xs text-gray-600 mb-2">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{formatEventDate(event)}</span>
          </div>

          <div className="flex flex-wrap gap-1">
            <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full text-xs font-medium">
              {event.type}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={() => openSuggestionsModal(event)}
        className="w-full flex items-center justify-center cursor-pointer gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-2 py-1.5 rounded text-xs font-medium transition-colors mt-auto"
      >
        <MessageCircle className="w-3 h-3" />
        Suggestions
      </button>
    </motion.div>
  );

  // Render suggestion item
  const renderSuggestion = (suggestion: Suggestion) => (
    <motion.div
      key={suggestion.suggestionId}
      className="border border-gray-200 rounded-lg p-4 bg-gray-50"
      variants={cardVariants.item}
    >
      <div className="flex items-start gap-3">
        <div className="bg-blue-100 rounded-full p-2 flex-shrink-0">
          <User className="w-4 h-4 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-sm font-medium text-gray-900">
              {suggestion.employeeName}
            </span>
            {suggestion.employeeDesig && (
              <span className="text-xs text-gray-500">
                • {suggestion.employeeDesig}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-700 mb-2">{suggestion.description}</p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            <span>
              {new Date(suggestion.addedOn).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Render suggestions modal using portal
  const renderSuggestionsModal = () => {
    if (!isModalOpen || !selectedEvent) return null;

    return createPortal(
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 bg-black/50 flex overflow-hidden items-center justify-center p-2 md:p-8 z-[9999]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeModal}
          style={{ overscrollBehavior: "contain" }}
        >
          <motion.div
            className="bg-white rounded-2xl max-w-6xl w-full my-8 overflow-hidden flex flex-col custom-scrollbar"
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              overflow: "auto",
            }}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    Suggestions for {selectedEvent.name}
                  </h3>
                  {selectedEvent.subName && (
                    <p className="text-sm text-gray-600 mt-1 truncate">
                      {selectedEvent.subName}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {formatEventDate(selectedEvent)}
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 text-gray-400 hover:text-gray-600  ml-4 flex-shrink-0 cursor-pointer active:scale-95 transition-transform duration-200"
                  type="button"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 px-6 pb-8 pt-6">
              {/* New Suggestion Form */}
              <div className="mb-6">
                <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-600" />
                  Share Your Suggestion
                </h4>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <textarea
                    value={newSuggestion}
                    onChange={(e) => setNewSuggestion(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="What suggestions do you have to improve this event? (Ctrl + Enter to submit)"
                    className="w-full p-3 border border-yellow-200 rounded text-sm resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    rows={4}
                    maxLength={500}
                    disabled={submitting}
                  />
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-gray-500">
                      {newSuggestion.length}/500 characters
                    </span>
                    <button
                      onClick={handleSubmitSuggestion}
                      disabled={!newSuggestion.trim() || submitting}
                      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded  cursor-pointer active:scale-95 transition-transform duration-200 ${
                        !newSuggestion.trim() || submitting
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-yellow-600 text-white hover:bg-yellow-700"
                      }`}
                      type="button"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Submit Suggestion
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Existing Suggestions */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-4">
                  Below Write Your Suggestions (
                  {suggestions.filter((s) => s.type === "SUGGESTION").length})
                </h4>
                {loadingSuggestions ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-yellow-600" />
                    <span className="ml-2 text-yellow-700">
                      Loading suggestions...
                    </span>
                  </div>
                ) : suggestions.filter((s) => s.type === "SUGGESTION").length ===
                  0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MessageCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm">
                      No suggestions yet. Be the first to share your ideas!
                    </p>
                  </div>
                ) : (
                  <motion.div
                    className="space-y-3"
                    variants={cardVariants.container}
                    initial="initial"
                    animate="animate"
                  >
                    {suggestions
                      .filter((s) => s.type === "SUGGESTION")
                      .map(renderSuggestion)}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>,
      document.body
    );
  };

  // Handle body scroll when modal opens/closes
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  // Main render
  return (
    <>
      <NotificationToast
        notification={notification}
        onClose={() => setNotification(null)}
      />
      <section className="mb-10">
        <motion.div
          variants={fadeInVariants("up", 0)}
          initial="initial"
          animate="animate"
        >
          <AchievementsSectionHeader
            title="Share Your Suggestions Here For Upcoming Or Completed Events"
            sectionType="suggestions"
          />

          {/* Filters */}
          <div className="flex justify-center gap-4 mb-6">
            {/* Year Filter */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            {/* Type Filter */}
            <select
              value={selectedEventType}
              onChange={(e) => setSelectedEventType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="annual">Annual</option>
              <option value="year-round">Year-Round</option>
            </select>
          </div>

          {loading ? (
            <div className="bg-yellow-50 rounded-xl shadow p-8">
              <div className="flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-yellow-600" />
                <span className="ml-2 text-yellow-700">Loading events...</span>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <div>
                  <h4 className="font-semibold text-red-900">
                    Error Loading Events
                  </h4>
                  <p className="text-red-700 text-sm">{error}</p>
                  <button
                    onClick={loadEventsByYear}
                    className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          ) : events.length === 0 ? (
            <div className="bg-gray-50 rounded-xl shadow p-8 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                No Events Found
              </h4>
              <p className="text-gray-600 text-sm">
                No events are available for the selected filters.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow p-6 mb-6">
              <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  variants={cardVariants.container}
                  initial="initial"
                  animate="animate"
                >
                  {events.map(renderEventCard)}
                </motion.div>
              </div>
            </div>
          )}

          {/* Suggestions Modal - Rendered using portal */}
          {renderSuggestionsModal()}
        </motion.div>
      </section>
    </>
  );
};

export default AchievementsSuggestions;
