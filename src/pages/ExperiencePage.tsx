import { useState, useEffect } from "react";
import {
  Plus,
  X,
  Calendar,
  MapPin,
  Clock,
  Send,
  Star,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import Masonry from "react-masonry-css";
import {
  sectionVariants,
  textVariants,
  cardVariants,
} from "../utils/animationVariants";
// Removed API imports
// import { getMyVolunteerStatus, getVolunteerDetailsByVId } from "../api/volunteerApi";
// import { createSuggestion, SUGGESTION_TYPES, validateFile } from "../api/suggestionApi";
// import { getCurrentUserDetails } from "../utils/volunteerFormHelpers";
// import { getExpHubApproved } from "../api/experienceApi";
// import { getFeedbackDetails } from "../api/feedbackApi";
import ExperienceOverlay from "../components/pages/experience/ExperienceOverlay";

const BASE_URL = import.meta.env.BASE_URL || "/";

export interface MyVolunteerStatusEvent {
  volunteerId: number;
  eventLocationId: number;
  eventName: string;
  eventVenue: string;
  eventDate: string;
  eventStime: string;
  eventEtime: string;
  eventLocationName: string;
  employeeId: number;
  employeeName: string;
  employeeEmailId: string;
  employeeDesig: string;
  status: string;
  addedBy: number;
  addedOn: string;
  enableConf: string;
  enableComp: string;
  rating: number;
}

// Dummy data for attended events
const dummyAttendedEvents: MyVolunteerStatusEvent[] = [
  {
    volunteerId: 1,
    eventLocationId: 101,
    eventName: "Tree Plantation Drive",
    eventVenue: "City Park, Mumbai",
    eventDate: "2025-06-15",
    eventStime: "09:00:00",
    eventEtime: "13:00:00",
    eventLocationName: "Mumbai",
    employeeId: 1001,
    employeeName: "John Doe",
    employeeEmailId: "john.doe@company.com",
    employeeDesig: "Software Engineer",
    status: "A",
    addedBy: 1,
    addedOn: "2025-06-01",
    enableConf: "true",
    enableComp: "true",
    rating: 5,
  },
  {
    volunteerId: 2,
    eventLocationId: 102,
    eventName: "Blood Donation Camp",
    eventVenue: "Community Hall, Delhi",
    eventDate: "2025-08-10",
    eventStime: "10:00:00",
    eventEtime: "16:00:00",
    eventLocationName: "Delhi",
    employeeId: 1001,
    employeeName: "John Doe",
    employeeEmailId: "john.doe@company.com",
    employeeDesig: "Software Engineer",
    status: "A",
    addedBy: 1,
    addedOn: "2025-08-01",
    enableConf: "true",
    enableComp: "false",
    rating: 4,
  },
];

// Dummy user details
const dummyUserDetails = {
  empcode: "EMP001",
  employeeId: 1001,
  name: "John Doe",
  email: "john.doe@company.com",
  designation: "Software Engineer",
};

// Dummy approved experiences
const dummyApprovedExperiences = [
  {
    suggestionId: 1,
    description:
      "Participating in the tree plantation drive was an incredible experience. I felt a deep connection with nature and realized how small actions can make a big difference for our environment.",
    employeeName: "Jane Smith",
    status: "A",
    type: "E",
    filePath:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80",
  },
  {
    suggestionId: 2,
    description:
      "Volunteering at the blood donation camp taught me the importance of giving back to the community. Seeing the smiles on people's faces when they knew they were helping save lives was priceless.",
    employeeName: "Mike Johnson",
    status: "A",
    type: "E",
    filePath:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=800&q=80",
  },
  {
    suggestionId: 3,
    description:
      "The literacy program opened my eyes to the power of education. Teaching children to read and write reminded me how fortunate I am and motivated me to continue volunteering.",
    employeeName: "Sarah Williams",
    status: "A",
    type: "E",
    filePath:
      "https://images.unsplash.com/photo-1497486751825-1233686d5d80?auto=format&fit=crop&w=800&q=80",
  },
  {
    suggestionId: 4,
    description:
      "Cleaning up the local park with my colleagues was both fun and meaningful. We removed tons of waste and made the space beautiful again for families to enjoy.",
    employeeName: "David Brown",
    status: "A",
    type: "E",
    filePath:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80",
  },
  {
    suggestionId: 5,
    description:
      "Working at the elderly care center was emotionally rewarding. The stories and wisdom shared by the residents enriched my perspective on life and aging gracefully.",
    employeeName: "Lisa Davis",
    status: "A",
    type: "E",
    filePath:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80",
  },
];

// Add this helper function before your component:
function truncateText(text: string, maxLen: number) {
  if (!text) return "";
  return text.length > maxLen ? text.slice(0, maxLen - 2) + "…" : text;
}

export default function ExperiencePage() {
  // Modal states
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [attendedEvents] = useState<MyVolunteerStatusEvent[]>(dummyAttendedEvents);
  const [selectedEvent, setSelectedEvent] = useState<MyVolunteerStatusEvent | null>(null);
  const [experienceText, setExperienceText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // User details state
  const [userDetails] = useState(dummyUserDetails);

  // Approved experiences state
  const [approvedExperiences] = useState(dummyApprovedExperiences);
  const [approvedImages, setApprovedImages] = useState<Record<number, string>>({});
  const [approvedLoading] = useState(false);

  // Masonry image dimensions state
  const [imageDimensions, setImageDimensions] = useState<Record<number, { width: number; height: number }>>({});

  // Overlay state
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [overlayExp, setOverlayExp] = useState<any | null>(null);
  const [overlayIndex, setOverlayIndex] = useState<number>(-1);

  // State for existing experience for selected event (always null in static version)
  const [existingExperience] = useState<{ description: string; suggestionId?: number; feedbackDate?: string; } | null>(null);

  // Disable page scroll when modal is open
  useEffect(() => {
    if (showExperienceModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showExperienceModal]);

  // Setup approved images from filePath
  useEffect(() => {
    const imageMap: Record<number, string> = {};
    approvedExperiences.forEach((exp) => {
      imageMap[exp.suggestionId] = exp.filePath || "";
    });
    setApprovedImages(imageMap);
  }, [approvedExperiences]);

  // Dynamically get image dimensions for masonry
  useEffect(() => {
    const loadDimensions = async () => {
      const dims: Record<number, { width: number; height: number }> = {};
      await Promise.all(
        approvedExperiences.map(
          (exp) =>
            new Promise<void>((resolve) => {
              const url = approvedImages[exp.suggestionId];
              if (!url) return resolve();
              const img = new window.Image();
              img.onload = function () {
                dims[exp.suggestionId] = {
                  width: img.naturalWidth,
                  height: img.naturalHeight,
                };
                resolve();
              };
              img.onerror = () => resolve();
              img.src = url;
            })
        )
      );
      setImageDimensions(dims);
    };
    if (approvedExperiences.length && Object.keys(approvedImages).length) {
      loadDimensions();
    }
  }, [approvedExperiences, approvedImages]);

  // Handle modal open
  const handleOpenExperienceModal = () => {
    setShowExperienceModal(true);
    setSelectedEvent(null);
    setExperienceText("");
    setMessage("");
    setError("");
  };

  // Handle modal close
  const handleCloseExperienceModal = () => {
    setShowExperienceModal(false);
    setSelectedEvent(null);
    setExperienceText("");
    setSelectedFile(null);
    setFileError("");
    setMessage("");
    setError("");
  };

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Simple file validation (no API call)
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

    if (!allowedTypes.includes(file.type)) {
      setFileError("Please select a valid image file (JPEG, PNG, GIF)");
      setSelectedFile(null);
      return;
    }

    if (file.size > maxSize) {
      setFileError("File size must be less than 5MB");
      setSelectedFile(null);
      return;
    }

    setFileError("");
    setSelectedFile(file);
  };

  // Handle removing selected file
  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFileError("");
  };

  // Handle event selection
  const handleSelectEvent = (event: MyVolunteerStatusEvent) => {
    setSelectedEvent(event);
  };

  // Handle experience submission (static demo)
  const handleSubmitExperience = async () => {
    if (!selectedEvent || !experienceText.trim()) {
      setError("Please select an event and write your experience");
      return;
    }

    if (!selectedFile) {
      setError("Please add a photo of your volunteering experience.");
      return;
    }

    if (experienceText.length > 400) {
      setError("Experience text must be 400 characters or less.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setMessage("");

      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 2000));

      setMessage("Your experience has been submitted successfully!");
      setExperienceText("");
      setSelectedEvent(null);
      setSelectedFile(null);
      setFileError("");

      // Auto-close modal after 2 seconds
      setTimeout(() => {
        handleCloseExperienceModal();
      }, 2000);
    } catch (error) {
      setError("Failed to submit your experience. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Render event selection
  const renderEventSelection = () => {
    if (attendedEvents.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>You haven't attended any events yet.</p>
          <p className="text-sm">Complete some volunteering activities to share your experiences!</p>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <p className="text-sm text-gray-600 mb-3">
          Found {attendedEvents.length} attended event{attendedEvents.length !== 1 ? "s" : ""}
        </p>
        <div className="grid grid-cols-1 gap-3 max-h-[60vh] overflow-y-auto pr-2">
          {attendedEvents.map((event, index) => (
            <button
              key={`event-${event.volunteerId}-${event.eventLocationId}-${index}`}
              onClick={() => handleSelectEvent(event)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedEvent?.volunteerId === event.volunteerId &&
                selectedEvent?.eventLocationId === event.eventLocationId
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{event.eventName}</h4>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 flex-wrap">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(event.eventDate)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{event.eventLocationName}</span>
                    </div>
                    {event.eventStime && event.eventEtime && event.eventStime !== "00:00:00" && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatTime(event.eventStime)} - {formatTime(event.eventEtime)}</span>
                      </div>
                    )}
                  </div>
                  {event.eventVenue && event.eventVenue.trim() !== "" && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      <strong>Venue:</strong> {event.eventVenue.replace(/\n/g, ", ")}
                    </p>
                  )}
                  {event.rating > 0 && (
                    <div className="flex items-center gap-1 mt-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">Your rating: {event.rating}/5</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Attended
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "Date not available";
    try {
      const date = new Date(dateString);
      if (date.getFullYear() <= 1900) {
        return "Date TBD";
      }
      if (isNaN(date.getTime())) {
        return "Date not available";
      }
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Date not available";
    }
  };

  // Format time for display
  const formatTime = (timeString: string) => {
    if (!timeString || timeString === "00:00:00") return "";
    try {
      const timeParts = timeString.split(":");
      if (timeParts.length >= 2) {
        const hours = parseInt(timeParts[0]);
        const minutes = timeParts[1];
        const ampm = hours >= 12 ? "PM" : "AM";
        const displayHours = hours % 12 || 12;
        return `${displayHours}:${minutes} ${ampm}`;
      }
      return timeString;
    } catch {
      return timeString;
    }
  };

  // Handler to open overlay with index
  const handleOpenOverlay = (exp: any, idx?: number) => {
    setOverlayExp(exp);
    setOverlayOpen(true);
    setOverlayIndex(
      typeof idx === "number" ? idx : approvedExperiences.findIndex((e) => e.suggestionId === exp.suggestionId)
    );
  };

  // Handler to close overlay
  const handleCloseOverlay = () => {
    setOverlayOpen(false);
    setOverlayExp(null);
    setOverlayIndex(-1);
  };

  // Handler for previous experience
  const handlePrevOverlay = () => {
    if (overlayIndex > 0) {
      const prevIdx = overlayIndex - 1;
      setOverlayExp(approvedExperiences[prevIdx]);
      setOverlayIndex(prevIdx);
    }
  };

  // Handler for next experience
  const handleNextOverlay = () => {
    if (overlayIndex < approvedExperiences.length - 1) {
      const nextIdx = overlayIndex + 1;
      setOverlayExp(approvedExperiences[nextIdx]);
      setOverlayIndex(nextIdx);
    }
  };

  return (
    <>
      <title>Experience Hub | Alkem Smile Volunteering Stories</title>
      <meta
        name="description"
        content="Read and share real volunteering experiences from Alkem Smile employees. Get inspired by stories of care, connection, and change."
      />
      <meta
        name="keywords"
        content="alkem, experience, volunteering, stories, employee, community, smile"
      />
      <motion.div
        className="min-h-screen bg-white px-4 py-8"
        initial="initial"
        animate="animate"
        variants={sectionVariants}
      >
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center">
          {/* Section dash and subheader */}
          <motion.div
            className="flex flex-col items-center mb-2 relative"
            variants={textVariants.header}
            initial="initial"
            animate="animate"
          >
            <motion.div
              className="flex items-center gap-3 mb-2"
              variants={textVariants.title}
              initial="initial"
              animate="animate"
            >
              <div className="w-8 h-0.5 bg-yellow-400" />
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Shared By Our Alkemites
              </span>
            </motion.div>
            <motion.h1
              className="text-3xl md:text-4xl font-bold text-black text-center whitespace-nowrap relative mb-2"
              variants={textVariants.header}
              initial="initial"
              animate="animate"
            >
              Experience Hub
              <img
                src={`${BASE_URL}graphics/smile_underline.svg`}
                alt="underline"
                className="absolute left-1/2 -translate-x-1/2 -bottom-6 w-[120px] h-auto"
                style={{ pointerEvents: "none" }}
              />
            </motion.h1>
            <motion.div
              className="text-base text-gray-700 mt-8 mb-4 max-w-2xl text-center"
              variants={textVariants.description}
              initial="initial"
              animate="animate"
            >
              Through every activity, our employees live the values of care, connection, and change.
            </motion.div>

            {/* Share Your Experience Button */}
            <motion.button
              onClick={handleOpenExperienceModal}
              className="mb-6 cursor-pointer px-6 py-3 bg-purple-600 transition-all duration-100 hover:bg-purple-700 text-white rounded-xl font-medium flex items-center gap-2 shadow-lg active:scale-93"
              variants={textVariants.description}
            >
              <Plus className="w-5 h-5" />
              Share Your Experience
            </motion.button>
          </motion.div>

          {/* Approved Experiences Masonry Grid */}
          <motion.div
            className="mb-12 w-full"
            variants={cardVariants.container}
            initial="initial"
            animate="animate"
          >
            {approvedLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                <span className="ml-2 text-gray-600">Loading approved experiences...</span>
              </div>
            ) : approvedExperiences.length === 0 ? (
              <div className="text-center text-gray-500 py-8">No approved experiences found.</div>
            ) : (
              <>
                {/* Mobile: simple vertical grid, Desktop: masonry */}
                <div className="flex flex-col gap-8 md:hidden">
                  {approvedExperiences.map((exp, idx) => {
                    const imgUrl = approvedImages[exp.suggestionId];
                    const dims = imageDimensions[exp.suggestionId];
                    const imgHeight = dims
                      ? Math.max(180, Math.min(400, dims.height * (320 / dims.width)))
                      : 240;

                    const formattedName =
                      exp.employeeName && typeof exp.employeeName === "string"
                        ? "- " +
                          exp.employeeName
                            .split(" ")
                            .map(
                              (part: string) =>
                                part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
                            )
                            .join(" ")
                        : "";

                    const truncatedDesc = truncateText(exp.description, 40);

                    return (
                      <motion.div
                        key={exp.suggestionId}
                        className="rounded-2xl shadow-md border border-gray-100 overflow-hidden flex flex-col cursor-pointer bg-[#4B2067]"
                        style={{
                          width: 320,
                          maxWidth: "90vw",
                          margin: "0 auto",
                          breakInside: "avoid",
                          padding: 0,
                        }}
                        variants={cardVariants.item}
                        whileHover="hover"
                        onClick={() => handleOpenOverlay(exp, idx)}
                      >
                        <div
                          className="relative w-full"
                          style={{
                            height: imgHeight,
                            background: "#4B2067",
                          }}
                        >
                          {imgUrl ? (
                            <img
                              src={imgUrl}
                              alt={exp.employeeName}
                              className="w-full h-full object-cover block"
                              loading="lazy"
                              style={{
                                height: imgHeight,
                                width: "100%",
                                objectFit: "cover",
                                background: "#4B2067",
                                display: "block",
                              }}
                            />
                          ) : (
                            <div
                              className="w-full h-full flex items-center justify-center text-gray-400"
                              style={{
                                height: imgHeight,
                                background: "#4B2067",
                              }}
                            >
                              <ImageIcon className="w-12 h-12" />
                            </div>
                          )}
                          <div
                            className="absolute bottom-0 left-0 w-full px-4 py-4 flex flex-col justify-end"
                            style={{
                              height: "100%",
                              background:
                                "linear-gradient(180deg,rgba(0,0,0,0) 40%,rgba(30,41,59,0.85) 100%)",
                              pointerEvents: "none",
                            }}
                          >
                            <div className="w-full">
                              <div
                                className="text-white text-base font-medium italic whitespace-pre-line drop-shadow-lg"
                                style={{ pointerEvents: "auto" }}
                              >
                                {`"${truncatedDesc}"`}
                              </div>
                            </div>
                            <div className="w-full flex justify-end">
                              <span
                                className="text-xs text-gray-200 font-medium mt-4"
                                style={{ pointerEvents: "auto" }}
                              >
                                {formattedName}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
                {/* Desktop: masonry grid */}
                <Masonry
                  breakpointCols={{ default: 3, 1100: 2, 700: 1 }}
                  className="hidden md:flex w-auto gap-8"
                  columnClassName="masonry-column"
                  style={{ rowGap: "3rem" }}
                >
                  {approvedExperiences.map((exp, idx) => {
                    const imgUrl = approvedImages[exp.suggestionId];
                    const dims = imageDimensions[exp.suggestionId];
                    const imgHeight = dims
                      ? Math.max(230, Math.min(600, dims.height * (380 / dims.width)))
                      : 320;

                    const formattedName =
                      exp.employeeName && typeof exp.employeeName === "string"
                        ? "- " +
                          exp.employeeName
                            .split(" ")
                            .map(
                              (part: string) =>
                                part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
                            )
                            .join(" ")
                        : "";

                    const truncatedDesc = truncateText(exp.description, 50);

                    return (
                      <motion.div
                        key={exp.suggestionId}
                        className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden flex flex-col cursor-pointer"
                        style={{
                          width: "100%",
                          breakInside: "avoid",
                          padding: 0,
                        }}
                        variants={cardVariants.item}
                        whileHover="hover"
                        onClick={() => handleOpenOverlay(exp, idx)}
                      >
                        <div
                          className="relative w-full"
                          style={{ height: imgHeight }}
                        >
                          {imgUrl ? (
                            <img
                              src={imgUrl}
                              alt={exp.employeeName}
                              className="w-full h-full object-cover block bg-gray-100"
                              loading="lazy"
                              style={{
                                height: imgHeight,
                                width: "100%",
                                objectFit: "cover",
                                background: "#f3f4f6",
                                display: "block",
                              }}
                            />
                          ) : (
                            <div
                              className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400"
                              style={{ height: imgHeight }}
                            >
                              <ImageIcon className="w-12 h-12" />
                            </div>
                          )}
                          <div
                            className="absolute bottom-0 left-0 w-full px-6 py-6 flex flex-col justify-end"
                            style={{
                              height: "100%",
                              background:
                                "linear-gradient(180deg,rgba(0,0,0,0) 40%,rgba(30,41,59,0.85) 100%)",
                              pointerEvents: "none",
                            }}
                          >
                            <div className="w-full">
                              <div
                                className="text-white text-base md:text-lg font-medium italic whitespace-pre-line drop-shadow-lg"
                                style={{ pointerEvents: "auto" }}
                              >
                                {`"${truncatedDesc}"`}
                              </div>
                            </div>
                            <div className="w-full flex justify-end">
                              <span
                                className="text-xs text-gray-200 font-medium mt-4"
                                style={{ pointerEvents: "auto" }}
                              >
                                {formattedName}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </Masonry>
              </>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Experience Modal */}
      {showExperienceModal && (
        <motion.div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-2 md:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ overscrollBehavior: "contain" }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] flex flex-col md:flex-row overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            {/* Left: Events List */}
            <div className="md:w-2/5 w-full border-r border-gray-200 bg-gray-50 overflow-y-auto max-h-[95vh] p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Select Event</h2>
                <button
                  onClick={handleCloseExperienceModal}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              {renderEventSelection()}
            </div>
            {/* Right: Write up and image */}
            <div className="md:w-3/5 w-full p-4 md:p-8 flex flex-col overflow-y-auto max-h-[95vh]">
              {/* Success Message */}
              {message && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-medium">{message}</p>
                </div>
              )}
              {/* Error Message */}
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 font-medium">{error}</p>
                </div>
              )}
              {/* Experience Text */}
              {selectedEvent && (
                <>
                  {existingExperience ? (
                    <div className="mb-6">
                      <div className="text-green-700 font-semibold text-center mb-2">
                        Experience already submitted!
                      </div>
                      <div>
                        <span className="font-medium">Your Experience:</span>
                        <textarea
                          className="w-full border rounded p-2 min-h-[80px] bg-gray-100"
                          value={existingExperience.description}
                          readOnly
                          disabled
                          style={{ pointerEvents: "none", opacity: 0.7 }}
                        />
                      </div>
                      {existingExperience.feedbackDate && (
                        <div className="text-xs text-gray-500 mt-2 text-right">
                          Submitted on: {new Date(existingExperience.feedbackDate).toLocaleString()}
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <label className="block text-base md:text-lg font-medium text-gray-700 mb-3">
                        Share Your Experience
                      </label>
                      <textarea
                        value={experienceText}
                        onChange={(e) =>
                          e.target.value.length <= 400 ? setExperienceText(e.target.value) : null
                        }
                        placeholder="Tell us about your volunteering experience. What did you learn? How did it impact you or the community? What moments stood out to you?"
                        className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-base md:text-lg"
                        rows={10}
                        maxLength={400}
                        style={{
                          minHeight: "180px",
                          maxHeight: "320px",
                          fontSize: "1.1rem",
                        }}
                        disabled={!!existingExperience}
                      />
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-gray-500">
                          {experienceText.length}/400 characters
                        </span>
                        <span className="text-sm text-gray-400">
                          Minimum 50 characters recommended
                        </span>
                      </div>
                      {/* Add Photo section */}
                      <div className="mt-6">
                        <div className="mb-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800 font-medium">
                          Tip: For best results, upload a photo in 1:1 (square) or 4:3 (landscape) aspect ratio. Portrait images (3:4) are also supported.
                        </div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Add Photo <span className="text-red-600">*</span>
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                          {selectedFile ? (
                            <div className="space-y-4">
                              <div className="flex items-center justify-center">
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                  <ImageIcon className="w-8 h-8 text-purple-600" />
                                  <div className="text-left">
                                    <p className="text-sm font-medium text-gray-900">
                                      {selectedFile.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                  </div>
                                  <button
                                    onClick={handleRemoveFile}
                                    className="text-red-500 hover:text-red-700 ml-2"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                              <div>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleFileSelect}
                                  className="hidden"
                                  id="change-file-input"
                                />
                                <label
                                  htmlFor="change-file-input"
                                  className="cursor-pointer text-sm text-purple-600 hover:text-purple-700 underline"
                                >
                                  Change Photo
                                </label>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                              <div>
                                <p className="text-sm text-gray-600 mb-2">
                                  Share a photo from your volunteering experience
                                </p>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleFileSelect}
                                  className="hidden"
                                  id="file-upload"
                                  disabled={!!existingExperience}
                                />
                                <label
                                  htmlFor="file-upload"
                                  className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                  <Upload className="w-4 h-4 mr-2" />
                                  Choose Photo
                                </label>
                              </div>
                              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                            </div>
                          )}
                        </div>
                        {fileError && (
                          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                            {fileError}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </>
              )}
              {/* Submit Button */}
              {selectedEvent && (
                <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                  <button
                    onClick={handleCloseExperienceModal}
                    className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitExperience}
                    disabled={
                      submitting ||
                      !experienceText.trim() ||
                      !selectedFile ||
                      experienceText.length > 400 ||
                      !!existingExperience
                    }
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    {submitting ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    {submitting ? "Submitting..." : "Submit Experience"}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Experience Overlay */}
      <ExperienceOverlay
        open={overlayOpen}
        exp={overlayExp}
        imageUrl={overlayExp ? approvedImages[overlayExp.suggestionId] : ""}
        onClose={handleCloseOverlay}
        onPrev={handlePrevOverlay}
        onNext={handleNextOverlay}
        showPrev={overlayIndex > 0}
        showNext={overlayIndex < approvedExperiences.length - 1}
      />
    </>
  );
}
