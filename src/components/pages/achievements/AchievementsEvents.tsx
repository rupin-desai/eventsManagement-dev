import React, { useState, useEffect } from "react";
import { Calendar, Clock, Award, MapPin, XCircle, Loader2, CheckCircle, AlertCircle, Lock, MessageSquare, Send } from "lucide-react";
import { motion } from "framer-motion";
import AchievementsSectionHeader from "./AchievementsSectionHeader";
import AchievementEventsLoadingState from "./achievementsEvents/AchievementEventsLoadingState";
import AchievementEventsErrorState from "./achievementsEvents/AchievementEventsErrorState";
import AchievementEventsEmptyState from "./achievementsEvents/AchievementEventsEmptyState";
import AchievementEventsSection from "./achievementsEvents/AchievementEventsSection";
import AchievementEventsSummary from "./achievementsEvents/AchievementEventsSummary";
import AchievementsCertificateDownload from "./AchievementsCertificateDownload";
import { cardVariants } from "../../../utils/animationVariants";
import type { 
  VolunteerWithEventDetails, 
  CategorizedEvents, 
  ExpandedSections 
} from "./achievementsEvents/types/AchievementEventsTypes";
import { 
  getMyVolunteerStatus,
  getVolunteerDetailsByVId,
  updateVolunteerRating,
  getVolunteersBySelfAndEvent,
  type VolunteerDetails
} from "../../../api/volunteerApi";
import { getEventsByYear, type Event } from "../../../api/eventApi";
import { extractEmpcodeFromClaims } from "../../../utils/volunteerFormHelpers";
import { getUser } from "../../../api/authApi";
import { getEmployeeDetailsById } from "../../../api/employeeApi";
import { updateVolunteerStatusList } from "../../../api/admin/volunteerAdminApi";
import { getFeedbackDetails, type FeedbackDetails } from "../../../api/feedbackApi";
import { 
  createSuggestion, 
  type CreateSuggestionRequest,
  SUGGESTION_TYPES 
} from "../../../api/suggestionApi";
import NotificationToast from "../../ui/NotificationToast"; // Add this import

interface AchievementEventsProps {}

// Enhanced AttendedEventCard with Feedback functionality
interface AttendedEventCardProps {
  volunteer: VolunteerWithEventDetails;
  updatingRatings: Set<number>;
  onRatingUpdate: (volunteerId: number, newRating: number) => Promise<void>;
  formatEventDate: (volunteer: VolunteerWithEventDetails) => string;
  formatEventTime: (volunteer: VolunteerWithEventDetails) => string;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string, isUpcoming?: boolean) => string;
  employeeId: string;
  eventId?: number; // Add eventId for feedback
}

const RATING_CONTAINER_HEIGHT = 160; // px, adjust as needed
const FEEDBACK_BOX_HEIGHT = 65; // px, adjust as needed

const AttendedEventCard: React.FC<AttendedEventCardProps> = ({
  volunteer,
  updatingRatings,
  onRatingUpdate,
  formatEventDate,
  formatEventTime,
  getStatusColor,
  getStatusText,
  employeeId,
  eventId
}) => {
  const [feedbackDetails, setFeedbackDetails] = useState<FeedbackDetails | null>(null);
  const [loadingFeedback, setLoadingFeedback] = useState(true);
  const [feedbackText, setFeedbackText] = useState('');
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackError, setFeedbackError] = useState('');

  const isUpdatingRating = updatingRatings.has(volunteer.volunteerId);

  useEffect(() => {
    loadFeedbackDetails();
  }, [volunteer.volunteerId]);

  const loadFeedbackDetails = async () => {
    try {
      setLoadingFeedback(true);
      
      const response = await getFeedbackDetails(volunteer.volunteerId, "F");
      const feedbackList = response.data || [];
      
      // Get the most recent feedback for this volunteer
      const latestFeedback = feedbackList.length > 0 ? feedbackList[0] : null;
      
      setFeedbackDetails(latestFeedback);
      
    } catch (error) {
      console.error('❌ Error loading feedback details:', error);
      // Don't show error, just proceed without feedback
      setFeedbackDetails(null);
    } finally {
      setLoadingFeedback(false);
    }
  };

  const handleRatingClick = async (newRating: number) => {
    // Don't allow rating changes if feedback already exists
    if (feedbackDetails) {
      return;
    }

    // Don't allow rating changes if volunteer rating already exists
    if ((volunteer.rating ?? 0) > 0) {
      return;
    }

    try {
      await onRatingUpdate(volunteer.volunteerId, newRating);
    } catch (error) {
      console.error('Error updating rating:', error);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!feedbackText.trim()) return;

    try {
      setSubmittingFeedback(true);
      setFeedbackError('');
      setFeedbackMessage('');

      const feedbackData: CreateSuggestionRequest = {
        eventId: eventId || 0,
        description: feedbackText.trim(),
        employeeId: parseInt(employeeId),
        volunteerId: volunteer.volunteerId,
        type: SUGGESTION_TYPES.FEEDBACK // Add required type field for feedback
      };

      
      const response = await createSuggestion(feedbackData);

      if (response.status === 200 || response.status === 201) {
        setFeedbackMessage('Feedback submitted successfully!');
        setFeedbackText('');
        setShowFeedbackForm(false);
        
        // Reload feedback details
        await loadFeedbackDetails();
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setFeedbackMessage('');
        }, 3000);
      }
    } catch (error) {
      console.error('❌ Error submitting feedback:', error);
      setFeedbackError('Failed to submit feedback. Please try again.');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const canChangeRating = !feedbackDetails && volunteer.rating === 0;
  const hasExistingRating = (volunteer.rating ?? 0) > 0 || (feedbackDetails && feedbackDetails.rating > 0);
  const displayRating = feedbackDetails ? feedbackDetails.rating : (volunteer.rating ?? 0);

  // Smile icons for rating (instead of stars)
  const renderSmileRating = () => {
    const smileIcons = [
      { rating: 1, emoji: '😞', color: 'text-red-400', hoverColor: 'hover:text-red-500' },
      { rating: 2, emoji: '🙁', color: 'text-orange-400', hoverColor: 'hover:text-orange-500' },
      { rating: 3, emoji: '😐', color: 'text-yellow-400', hoverColor: 'hover:text-yellow-500' },
      { rating: 4, emoji: '🙂', color: 'text-green-400', hoverColor: 'hover:text-green-500' },
      { rating: 5, emoji: '😊', color: 'text-green-500', hoverColor: 'hover:text-green-600' }
    ];

    return (
      <div className="flex gap-2">
        {smileIcons.map((smile) => {
          const isSelected = smile.rating <= displayRating;
          const isClickable = canChangeRating && !isUpdatingRating;
          return (
            <button
              key={smile.rating}
              onClick={() => handleRatingClick(smile.rating)}
              disabled={!isClickable}
              className={`text-2xl transition-all duration-200 ${
                isClickable
                  ? `cursor-pointer ${smile.hoverColor} hover:scale-110`
                  : 'cursor-not-allowed'
              } ${
                isSelected 
                  ? smile.color 
                  : 'grayscale opacity-40'
              }`}
              title={`Rate ${smile.rating} - ${smile.emoji}`}
              style={{
                filter: isSelected ? 'none' : 'grayscale(100%)',
                opacity: isSelected ? 1 : 0.4
              }}
            >
              {smile.emoji}
            </button>
          );
        })}
      </div>
    );
  };

  // Remove rating locked and feedback submitted date
  const getRatingMessage = () => {
    if (feedbackDetails) {
      return null;
    }
    if ((volunteer.rating ?? 0) > 0) {
      return (
        <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
          <Lock className="w-4 h-4" />
          <span>Rating cannot be changed once submitted</span>
        </div>
      );
    }
    return (
      <div className="text-sm text-gray-500 mt-2">
        Click to rate this event (cannot be changed later)
      </div>
    );
  };

  const getRatingText = (rating: number): string => {
    switch (rating) {
      case 1: return 'Very Dissatisfied';
      case 2: return 'Dissatisfied';
      case 3: return 'Neutral';
      case 4: return 'Satisfied';
      case 5: return 'Very Satisfied';
      default: return '';
    }
  };

  return (
    <motion.div
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow flex flex-col h-full"
      variants={cardVariants.item}
    >
      {/* Event Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {volunteer.eventName}
          </h3>
          {volunteer.eventSubName && (
            <p className="text-sm text-gray-600 mb-2">
              {volunteer.eventSubName}
            </p>
          )}
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(volunteer.status || '')}`}>
          {getStatusText(volunteer.status || '')}
        </span>
      </div>

      {/* Event Details */}
      <div className="space-y-2 mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{formatEventDate(volunteer)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{formatEventTime(volunteer)}</span>
        </div>
        {volunteer.eventLocationName && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{volunteer.eventLocationName}</span>
          </div>
        )}
      </div>

      {/* Spacer to push rating/feedback to bottom */}
      <div className="flex-1" />

      {/* Rating & Feedback Section (fixed height, feedback scrollable) */}
      <div
        className="bg-gray-50 rounded-lg p-4 mb-4 flex flex-col"
        style={{ minHeight: RATING_CONTAINER_HEIGHT, maxHeight: RATING_CONTAINER_HEIGHT, height: RATING_CONTAINER_HEIGHT }}
      >
        {loadingFeedback ? (
          <div className="flex items-center gap-2 h-full justify-center">
            <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
            <span className="text-sm text-gray-500">Loading rating...</span>
          </div>
        ) : (
          <>
            <div className="flex-1 flex flex-col justify-center">
              {isUpdatingRating ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-yellow-600" />
                  <span className="text-sm text-yellow-700">Updating rating...</span>
                </div>
              ) : (
                <>
                  {renderSmileRating()}
                  {displayRating > 0 && (
                    <div className="text-sm font-medium text-gray-700">
                      Rating: {displayRating}/5 - {getRatingText(displayRating)}
                    </div>
                  )}
                </>
              )}
              {getRatingMessage()}
            </div>
            {/* Feedback box - fixed height, scrollable if overflow, with custom scrollbar */}
            {feedbackDetails && (
              <div
                className="mt-3 p-3 bg-yellow-50 border border-yellow-300 rounded-lg overflow-y-auto custom-scrollbar"
                style={{
                  maxHeight: FEEDBACK_BOX_HEIGHT,
                  minHeight: FEEDBACK_BOX_HEIGHT,
                  height: FEEDBACK_BOX_HEIGHT,
                }}
              >
                <p className="text-sm text-yellow-900 font-semibold break-words">
                  Your Feedback : {feedbackDetails.description}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Feedback Section */}
      {!feedbackDetails && hasExistingRating && (
        <div className="bg-yellow-50 rounded-lg p-4 mb-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-yellow-600" />
            Share Your Feedback
          </h4>
          {!showFeedbackForm ? (
            <button
              onClick={() => setShowFeedbackForm(true)}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
            >
              Add Feedback
            </button>
          ) : (
            <div className="space-y-3">
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Share your feedback about this event..."
                className="w-full p-3 border border-yellow-200 rounded text-sm resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                rows={4}
                maxLength={500}
                disabled={submittingFeedback}
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {feedbackText.length}/500 characters
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setShowFeedbackForm(false);
                      setFeedbackText('');
                      setFeedbackError('');
                    }}
                    disabled={submittingFeedback}
                    className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitFeedback}
                    disabled={!feedbackText.trim() || submittingFeedback}
                    className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                      !feedbackText.trim() || submittingFeedback
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-yellow-600 text-white hover:bg-yellow-700'
                    }`}
                  >
                    {submittingFeedback ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-3 h-3" />
                        Submit Feedback
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Success/Error Messages */}
          {feedbackMessage && (
            <motion.div
              className="mt-3 flex items-center gap-2 text-sm text-green-700 bg-green-100 p-2 rounded"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <CheckCircle className="w-4 h-4" />
              {feedbackMessage}
            </motion.div>
          )}
          {feedbackError && (
            <motion.div
              className="mt-3 flex items-center gap-2 text-sm text-red-700 bg-red-100 p-2 rounded"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle className="w-4 h-4" />
              {feedbackError}
            </motion.div>
          )}
        </div>
      )}

      {/* First Timer Message */}
      {!feedbackDetails && !hasExistingRating && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">Rate this event to unlock feedback</p>
              <p className="text-blue-700 mt-1">
                Once you submit your rating, you can share detailed feedback. 
                Note that ratings cannot be changed after submission.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Certificate Download - always at bottom */}
      <div className="mt-auto pt-4 border-t border-gray-200 flex items-center justify-between min-h-[48px]">
        <span className="text-sm text-gray-700 font-medium">Download Certificate</span>
        <AchievementsCertificateDownload
          volunteerId={volunteer.volunteerId}
          activityName={volunteer.eventName || 'Event'}
        />
      </div>
    </motion.div>
  );
};

const AchievementEvents: React.FC<AchievementEventsProps> = () => {
  // ✅ ALL BUSINESS LOGIC STAYS HERE
  const [allMyEvents, setAllMyEvents] = useState<VolunteerWithEventDetails[]>([]);
  const [categorizedEvents, setCategorizedEvents] = useState<CategorizedEvents>({
    upcoming: [],
    attended: [],
    other: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [employeeId, setEmployeeId] = useState<string>("");
  const [employeeName, setEmployeeName] = useState<string>("My");
  const [eventsMap, setEventsMap] = useState<Map<string, Event>>(new Map()); // Store events by name for eventId lookup
  
  const [updatingStatus, setUpdatingStatus] = useState<Set<number>>(new Set());
  const [loadingRatings, setLoadingRatings] = useState<Set<number>>(new Set());
  const [updatingRatings, setUpdatingRatings] = useState<Set<number>>(new Set());
  
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    upcoming: true,
    attended: true,
    other: false
  });
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [showRejectPopup, setShowRejectPopup] = useState<{ open: boolean; volunteer: VolunteerWithEventDetails | null }>({ open: false, volunteer: null });

  useEffect(() => {
    loadEmployeeIdAndEvents();
  }, []);

  useEffect(() => {
    const fetchEmployeeName = async () => {
      try {
        const userClaimsResponse = await getUser();
        const empcode = extractEmpcodeFromClaims(userClaimsResponse.data);
        const employeeResponse = await getEmployeeDetailsById(empcode);
        // API returns an object or array, handle both
        const data = employeeResponse.data;
        let name = "My";
        if (Array.isArray(data) && data.length > 0) {
          name = data[0].name;
        } else if (data && data.name) {
          name = data.name;
        }
        setEmployeeName(name);
      } catch {
        setEmployeeName("My");
      }
    };
    fetchEmployeeName();
  }, []);

  // ✅ ALL BUSINESS LOGIC METHODS STAY HERE
  const loadEmployeeIdAndEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      
      const userClaimsResponse = await getUser();
      const empcode = extractEmpcodeFromClaims(userClaimsResponse.data);
      
      setEmployeeId(empcode);
      
      await loadMyVolunteerEvents(empcode);
      
    } catch (error) {
      console.error('❌ Error getting employee ID:', error);
      setError('Failed to get user information');
      setLoading(false);
    }
  };

  const loadMyVolunteerEvents = async (empcode: string) => {
    try {
      
      // First load all events to build eventId mapping
      await loadEventsMap();
      
      const volunteerStatusResponse = await getMyVolunteerStatus(empcode);
      
      let myVolunteers: VolunteerWithEventDetails[] = [];
      
      if (volunteerStatusResponse.data) {
        const responseData = volunteerStatusResponse.data;
        let volunteerEvents: any[] = [];
        
        if (Array.isArray(responseData)) {
          volunteerEvents = responseData;
        } else if (responseData.volunteerEvents && Array.isArray(responseData.volunteerEvents)) {
          volunteerEvents = responseData.volunteerEvents;
        } else if (responseData.events && Array.isArray(responseData.events)) {
          volunteerEvents = responseData.events;
        } else {
          await loadAllEventsAndVolunteersOriginal(empcode);
          return;
        }
        
        
        for (const volunteerEvent of volunteerEvents) {
          try {
            const enhancedVolunteer: VolunteerWithEventDetails = {
              volunteerId: volunteerEvent.volunteerId || 0,
              eventLocationId: volunteerEvent.eventLocationId || 0,
              eventLocationName: volunteerEvent.eventLocationName || 'Unknown Location',
              employeeId: parseInt(empcode),
              employeeName: volunteerEvent.employeeName || 'Unknown',
              employeeEmailId: volunteerEvent.employeeEmailId || '',
              employeeDesig: volunteerEvent.employeeDesig || '',
              status: volunteerEvent.status || 'N',
              addedBy: volunteerEvent.addedBy || parseInt(empcode),
              addedOn: volunteerEvent.addedOn || new Date().toISOString(),

              eventName: volunteerEvent.eventName,
              eventSubName: volunteerEvent.eventSubName,
              tentativeMonth: volunteerEvent.tentativeMonth,
              tentativeYear: volunteerEvent.tentativeYear,
              eventDate: volunteerEvent.eventDate,
              startTime: volunteerEvent.startTime,
              endTime: volunteerEvent.endTime,
              eventStime: volunteerEvent.eventStime,   // <-- Add this line
              eventEtime: volunteerEvent.eventEtime,   // <-- Add this line
              venue: volunteerEvent.venue,
              enableConf: volunteerEvent.enableConf,
              enableComp: volunteerEvent.enableComp || 'false',
              rating: volunteerEvent.rating || 0,
              detailsLoaded: volunteerEvent.rating !== undefined,
            };
            
            myVolunteers.push(enhancedVolunteer);
            
          } catch (error) {
            console.warn('⚠️ Error processing volunteer event:', volunteerEvent, error);
          }
        }
      }
      
      
      if (myVolunteers.length > 0) {
        const uniqueVolunteers = removeDuplicateVolunteers(myVolunteers);
        
        const categorized = categorizeEventsByStatus(uniqueVolunteers);
        
        setAllMyEvents(uniqueVolunteers);
        setCategorizedEvents(categorized);
        
        const attendedEventsNeedingRatings = categorized.attended.filter(event => !event.detailsLoaded);
        if (attendedEventsNeedingRatings.length > 0) {
          await loadRatingsForAttendedEvents(attendedEventsNeedingRatings);
        }
      } else {
        await loadAllEventsAndVolunteersOriginal(empcode);
      }
      
    } catch (error) {
      console.error('❌ Error loading volunteer events:', error);
      
      try {
        await loadAllEventsAndVolunteersOriginal(empcode);
      } catch (fallbackError) {
        console.error('❌ Fallback method also failed:', fallbackError);
        setError('Failed to load volunteer events');
      }
    } finally {
      setLoading(false);
    }
  };

  // Load events to build a map for eventId lookup
  const loadEventsMap = async () => {
    try {
      
      const currentYear = new Date().getFullYear();
      const years = [
        (currentYear - 2).toString(),
        (currentYear - 1).toString(),
        currentYear.toString(),
        (currentYear + 1).toString()
      ];
      
      const eventsMap = new Map<string, Event>();
      
      for (const year of years) {
        try {
          const eventsResponse = await getEventsByYear(year);
          eventsResponse.data.forEach(event => {
            // Create multiple keys for flexible lookup
            eventsMap.set(event.name, event);
            if (event.subName) {
              eventsMap.set(`${event.name} - ${event.subName}`, event);
              eventsMap.set(`${event.name}_${event.subName}`, event);
            }
          });
        } catch (error) {
          console.warn(`⚠️ Failed to load events for year ${year}:`, error);
        }
      }
      
      setEventsMap(eventsMap);
      
    } catch (error) {
      console.error('❌ Error loading events map:', error);
    }
  };

  // Get eventId for a volunteer event
  const getEventIdForVolunteer = (volunteer: VolunteerWithEventDetails): number => {
    const eventName = volunteer.eventName;
    const eventSubName = volunteer.eventSubName;
    
    // Try different combinations to find the event
    const lookupKeys = [
      eventName,
      eventSubName ? `${eventName} - ${eventSubName}` : null,
      eventSubName ? `${eventName}_${eventSubName}` : null
    ].filter(Boolean) as string[];
    
    for (const key of lookupKeys) {
      const event = eventsMap.get(key);
      if (event) {
        return event.eventId;
      }
    }
    
    console.warn(`⚠️ Could not find eventId for volunteer ${volunteer.volunteerId} (${eventName})`);
    return 0;
  };

  const loadAllEventsAndVolunteersOriginal = async (empcode: string) => {
    try {
      
      const currentYear = new Date().getFullYear();
      const years = [
        (currentYear - 2).toString(),
        (currentYear - 1).toString(),
        currentYear.toString(),
        (currentYear + 1).toString()
      ];
      
      let allEventsData: Event[] = [];
      const eventsMap = new Map<string, Event>();
      
      for (const year of years) {
        try {
          const eventsResponse = await getEventsByYear(year);
          allEventsData = [...allEventsData, ...eventsResponse.data];
          
          // Build events map
          eventsResponse.data.forEach(event => {
            eventsMap.set(event.name, event);
            if (event.subName) {
              eventsMap.set(`${event.name} - ${event.subName}`, event);
              eventsMap.set(`${event.name}_${event.subName}`, event);
            }
          });
        } catch (error) {
          console.warn(`⚠️ Failed to load events for year ${year}:`, error);
        }
      }
      
      setEventsMap(eventsMap);
      
      let myVolunteers: VolunteerWithEventDetails[] = [];
      
      for (const event of allEventsData) {
        try {
          
          const possibleAdminIds = [empcode, '65960'];
          const foundVolunteerIds = new Set<number>();
          
          for (const adminId of possibleAdminIds) {
            try {
              const volunteersResponse = await getVolunteersBySelfAndEvent(event.eventId, adminId);
              
              if (volunteersResponse.data && volunteersResponse.data.length > 0) {
                
                const myVolunteerRecords = volunteersResponse.data.filter(volunteer => {
                  const volunteerEmpId = String(volunteer.employeeId);
                  const currentEmpId = String(empcode);
                  
                  const isCurrentUser = volunteerEmpId === currentEmpId;
                  const isNotDuplicate = !foundVolunteerIds.has(volunteer.volunteerId);
                  
                  if (isCurrentUser && isNotDuplicate) {
                    foundVolunteerIds.add(volunteer.volunteerId);
                    return true;
                  }
                  
                  if (isCurrentUser && !isNotDuplicate) {
                  }
                  
                  return false;
                });
                
                if (myVolunteerRecords.length > 0) {
                  
                  const enhancedVolunteers = myVolunteerRecords.map(volunteer => ({
                    ...volunteer,
                    eventName: event.name,
                    eventSubName: event.subName,
                    tentativeMonth: event.tentativeMonth,
                    tentativeYear: event.tentativeYear,
                    enableConf: event.enableConf,
                    rating: 0,
                    detailsLoaded: false,
                  }));
                  
                  myVolunteers = [...myVolunteers, ...enhancedVolunteers];
                }
              }
            } catch (error) {
              console.warn(`⚠️ Failed to load volunteers for event ${event.eventId} with adminId ${adminId}:`, error);
            }
          }
        } catch (error) {
          console.warn(`⚠️ Failed to process event ${event.eventId}:`, error);
        }
      }
      
      
      const uniqueVolunteers = removeDuplicateVolunteers(myVolunteers);
      
      const categorized = categorizeEventsByStatus(uniqueVolunteers);      
      setAllMyEvents(uniqueVolunteers);
      setCategorizedEvents(categorized);
      
      await loadRatingsForAttendedEvents(categorized.attended);
      
    } catch (error) {
      console.error('❌ Error loading events and volunteers:', error);
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleRatingUpdate = async (volunteerId: number, newRating: number): Promise<void> => {
    try {
      
      setUpdatingRatings(prev => new Set(prev).add(volunteerId));
      
      const response = await updateVolunteerRating(volunteerId, newRating);
      
      if (response.status === 200) {
        
        const updateVolunteerRatingFunc = (volunteer: VolunteerWithEventDetails) => 
          volunteer.volunteerId === volunteerId 
            ? { ...volunteer, rating: newRating }
            : volunteer;
        
        setAllMyEvents(prev => prev.map(updateVolunteerRatingFunc));
        
        setCategorizedEvents(prev => ({
          ...prev,
          attended: prev.attended.map(updateVolunteerRatingFunc),
          upcoming: prev.upcoming.map(updateVolunteerRatingFunc),
          other: prev.other.map(updateVolunteerRatingFunc)
        }));
        
      } else {
        throw new Error('Failed to update rating');
      }
    } catch (error) {
      console.error('❌ Error updating rating:', error);
      throw error;
    } finally {
      setUpdatingRatings(prev => {
        const newSet = new Set(prev);
        newSet.delete(volunteerId);
        return newSet;
      });
    }
  };

  const loadRatingsForAttendedEvents = async (attendedEvents: VolunteerWithEventDetails[]) => {
    if (attendedEvents.length === 0) {
      return;
    }

    
    for (const volunteer of attendedEvents) {
      try {
        setLoadingRatings(prev => new Set(prev).add(volunteer.volunteerId));
        
        
        const detailsResponse = await getVolunteerDetailsByVId(volunteer.volunteerId);
        const details: VolunteerDetails = detailsResponse.data;
        

        
        const updatedVolunteer: VolunteerWithEventDetails = {
          ...volunteer,
          rating: details.rating || 0,
          detailsLoaded: true
        };
        
        setAllMyEvents(prev => 
          prev.map(v => v.volunteerId === volunteer.volunteerId ? updatedVolunteer : v)
        );
        
        setCategorizedEvents(prev => ({
          ...prev,
          attended: prev.attended.map(v => 
            v.volunteerId === volunteer.volunteerId ? updatedVolunteer : v
          )
        }));
        
      } catch (error) {
        console.error(`❌ Error loading details for volunteer ${volunteer.volunteerId}:`, error);
        setAllMyEvents(prev => 
          prev.map(v => v.volunteerId === volunteer.volunteerId ? { ...v, detailsLoaded: true } : v)
        );
      } finally {
        setLoadingRatings(prev => {
          const newSet = new Set(prev);
          newSet.delete(volunteer.volunteerId);
          return newSet;
        });
      }
    }
    
  };

  const removeDuplicateVolunteers = (volunteers: VolunteerWithEventDetails[]): VolunteerWithEventDetails[] => {
    const seen = new Set<number>();
    const unique: VolunteerWithEventDetails[] = [];
    
    for (const volunteer of volunteers) {
      if (!seen.has(volunteer.volunteerId)) {
        seen.add(volunteer.volunteerId);
        unique.push(volunteer);
      } else {
      }
    }
    
    return unique;
  };

  const categorizeEventsByStatus = (volunteers: VolunteerWithEventDetails[]): CategorizedEvents => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    const categorized: CategorizedEvents = {
      upcoming: [],
      attended: [],
      other: []
    };

    volunteers.forEach(volunteer => {
      const status = volunteer.status?.toUpperCase();
      const isUpcoming = isEventUpcoming(volunteer, currentDate, currentYear, currentMonth);
      const enableComp = volunteer.enableComp === 'true' || volunteer.enableComp === '1';

      if (status === 'A') {
        categorized.attended.push(volunteer);
      } else if (status === 'X') {
        // Not Attended goes to "View All Events"
        categorized.other.push(volunteer);
      } else if (status === 'N') {
        // No Action: put in "Upcoming Events" if enableComp is false, else in "View All Events"
        if (enableComp) {
          categorized.other.push(volunteer);
        } else {
          categorized.upcoming.push(volunteer);
        }
      } else if (isUpcoming) {
        categorized.upcoming.push(volunteer);
      } else {
        categorized.other.push(volunteer);
      }
    });

    categorized.attended.sort((a, b) => new Date(b.addedOn).getTime() - new Date(a.addedOn).getTime());
    categorized.other.sort((a, b) => new Date(b.addedOn).getTime() - new Date(a.addedOn).getTime());
    categorized.upcoming.sort((a, b) => new Date(a.addedOn).getTime() - new Date(b.addedOn).getTime());

    return categorized;
  };

  const isEventUpcoming = (volunteer: VolunteerWithEventDetails, currentDate: Date, currentYear: number, currentMonth: number): boolean => {
    if (volunteer.eventDate && volunteer.eventDate !== "0001-01-01T00:00:00") {
      try {
        const eventDate = new Date(volunteer.eventDate);
        return eventDate >= new Date(currentDate.toDateString());
      } catch {
        // Fall through to tentative date check
      }
    }
    
    if (volunteer.tentativeYear && volunteer.tentativeMonth) {
      const eventYear = parseInt(volunteer.tentativeYear);
      const eventMonth = parseInt(volunteer.tentativeMonth);
      
      return eventYear > currentYear || (eventYear === currentYear && eventMonth >= currentMonth);
    }
    
    try {
      const addedDate = new Date(volunteer.addedOn);
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      
      return addedDate >= threeMonthsAgo;
    } catch {
      return true;
    }
  };

  const handleConfirmParticipation = async (volunteer: VolunteerWithEventDetails) => {
    try {
      setUpdatingStatus(prev => new Set(prev).add(volunteer.volunteerId));
      
      
      const updateData = {
        volunteerList: [{
          volunteerId: volunteer.volunteerId,
          status: 'C'
        }]
      };
      
      const response = await updateVolunteerStatusList(updateData);
      
      if (response.status === 200) {
        
        const updatedVolunteer = { ...volunteer, status: 'C' };
        
        setAllMyEvents(prev => 
          prev.map(v => v.volunteerId === volunteer.volunteerId ? updatedVolunteer : v)
        );
        
        setCategorizedEvents(prev => ({
          ...prev,
          upcoming: prev.upcoming.map(v => 
            v.volunteerId === volunteer.volunteerId ? updatedVolunteer : v
          )
        }));
        
        setNotification({ type: "success", message: "Your participation has been confirmed successfully!" });
      } else {
        throw new Error('Failed to update volunteer status');
      }
    } catch (error) {
      console.error('❌ Error confirming participation:', error);
      setNotification({ type: "error", message: "Failed to confirm participation. Please try again." });
    } finally {
      setUpdatingStatus(prev => {
        const newSet = new Set(prev);
        newSet.delete(volunteer.volunteerId);
        return newSet;
      });
    }
  };

  const handleRejectParticipation = async (volunteer: VolunteerWithEventDetails) => {
    setShowRejectPopup({ open: true, volunteer });
  };

  // Confirm reject
  const confirmRejectParticipation = async () => {
    if (!showRejectPopup.volunteer) return;
    const volunteer = showRejectPopup.volunteer;
    setShowRejectPopup({ open: false, volunteer: null });
    try {
      setUpdatingStatus(prev => new Set(prev).add(volunteer.volunteerId));
      const updateData = {
        volunteerList: [{
          volunteerId: volunteer.volunteerId,
          status: 'R'
        }]
      };
      const response = await updateVolunteerStatusList(updateData);
      if (response.status === 200) {
        const updatedVolunteer = { ...volunteer, status: 'R' };
        setAllMyEvents(prev =>
          prev.map(v => v.volunteerId === volunteer.volunteerId ? updatedVolunteer : v)
        );
        setCategorizedEvents(prev => ({
          ...prev,
          upcoming: prev.upcoming.map(v =>
            v.volunteerId === volunteer.volunteerId ? updatedVolunteer : v
          )
        }));
        setNotification({ type: "success", message: "You have rejected your participation." });
      } else {
        throw new Error('Failed to update volunteer status');
      }
    } catch (error) {
      setNotification({ type: "error", message: "Failed to reject participation. Please try again." });
    } finally {
      setUpdatingStatus(prev => {
        const newSet = new Set(prev);
        if (showRejectPopup.volunteer)
          newSet.delete(showRejectPopup.volunteer.volunteerId);
        return newSet;
      });
    }
  };

  const canConfirmParticipation = (volunteer: VolunteerWithEventDetails): boolean => {
    const enablesConfirmation = volunteer.enableConf === 'true' || volunteer.enableConf === '1';
    const isPendingStatus = volunteer.status?.toUpperCase() === 'N' || !volunteer.status || volunteer.status === '';
    const isNotUpdating = !updatingStatus.has(volunteer.volunteerId);
    

    
    return enablesConfirmation && isPendingStatus && isNotUpdating;
  };

  const toggleSection = (section: keyof ExpandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const formatEventDate = (volunteer: VolunteerWithEventDetails): string => {
    if (volunteer.eventDate && volunteer.eventDate !== "0001-01-01T00:00:00") {
      try {
        const date = new Date(volunteer.eventDate);
        return date.toLocaleDateString('en-US', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      } catch {
        // Fall through to tentative date
      }
    }
    
    if (volunteer.tentativeYear && volunteer.tentativeMonth) {
      const monthNames = [
        '', 'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const monthIndex = parseInt(volunteer.tentativeMonth);
      const monthName = monthNames[monthIndex] || `Month ${volunteer.tentativeMonth}`;
      return `${monthName} ${volunteer.tentativeYear}`;
    }
    
    return 'Date TBD';
  };

  const formatEventTime = (volunteer: VolunteerWithEventDetails): string => {
    // Prefer eventStime and eventEtime if present (for attended events)
    if (volunteer.eventStime && volunteer.eventEtime) {
      try {
        const formatTime = (timeString: string) => {
          const [hours, minutes] = timeString.split(':');
          const hour = parseInt(hours, 10);
          const ampm = hour >= 12 ? 'PM' : 'AM';
          const displayHour = hour % 12 || 12;
          return `${displayHour}:${minutes} ${ampm}`;
        };
        return `${formatTime(volunteer.eventStime)} - ${formatTime(volunteer.eventEtime)}`;
      } catch {
        // fallback to below
      }
    }

    // Fallback to startTime and endTime if present
    if (volunteer.startTime && volunteer.endTime && 
        volunteer.startTime !== "00:00:00" && volunteer.endTime !== "00:00:00") {
      try {
        const formatTime = (timeString: string) => {
          const [hours, minutes] = timeString.split(':');
          const hour = parseInt(hours, 10);
          const ampm = hour >= 12 ? 'PM' : 'AM';
          const displayHour = hour % 12 || 12;
          return `${displayHour}:${minutes} ${ampm}`;
        };
        return `${formatTime(volunteer.startTime)} - ${formatTime(volunteer.endTime)}`;
      } catch {
        return 'Time TBD';
      }
    }
    
    return 'Time TBD';
  };

  const getStatusColor = (status: string): string => {
    switch (status?.toUpperCase()) {
      case 'C':
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800';
      case 'A':
      case 'ATTENDED':
        return 'bg-green-100 text-green-800';
      case 'R':
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'X':
        return 'bg-orange-100 text-orange-800'; // Not Attended
      case 'N':
        return 'bg-gray-100 text-gray-800'; // No Action
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string, isUpcoming: boolean = false): string => {
    switch (status?.toUpperCase()) {
      case 'C':
        return 'Confirmed';
      case 'A':
        return 'Attended';
      case 'R':
        return 'Rejected';
      case 'X':
        return 'Not Attended';
      case 'N':
        return 'No Action';
      default:
        return status || (isUpcoming ? 'Pending' : 'Unknown');
    }
  };

  const isEventUpcomingForStatus = (volunteer: VolunteerWithEventDetails): boolean => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    
    return isEventUpcoming(volunteer, currentDate, currentYear, currentMonth);
  };

  // Custom render function for attended events
  const renderAttendedEventCard = (volunteer: VolunteerWithEventDetails) => (
    <AttendedEventCard
      key={volunteer.volunteerId}
      volunteer={volunteer}
      updatingRatings={updatingRatings}
      onRatingUpdate={handleRatingUpdate}
      formatEventDate={formatEventDate}
      formatEventTime={formatEventTime}
      getStatusColor={getStatusColor}
      getStatusText={getStatusText}
      employeeId={employeeId}
      eventId={getEventIdForVolunteer(volunteer)} // Pass the eventId
    />
  );

  // Custom render function for "View All Events" (other) section
  const renderOtherEventCard = (volunteer: VolunteerWithEventDetails) => (
    <motion.div
      key={volunteer.volunteerId}
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow flex flex-col h-full"
      variants={cardVariants.item}
    >
      {/* Event Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {volunteer.eventName}
          </h3>
          {volunteer.eventSubName && (
            <p className="text-sm text-gray-600 mb-2">
              {volunteer.eventSubName}
            </p>
          )}
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(volunteer.status || '')}`}>
          {getStatusText(volunteer.status || '')}
        </span>
      </div>

      {/* Event Details */}
      <div className="space-y-2 mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{formatEventDate(volunteer)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{formatEventTime(volunteer)}</span>
        </div>
        {volunteer.eventLocationName && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{volunteer.eventLocationName}</span>
          </div>
        )}
      </div>
      {/* No volunteerId or confirmation info shown */}
    </motion.div>
  );

  // ✅ RENDER - NOW USING STRUCTURAL COMPONENTS
  return (
    <>
      <NotificationToast notification={notification} onClose={() => setNotification(null)} />
      <section className="mb-10">
        <AchievementsSectionHeader 
          title={`${toTitleCase(employeeName)}'s Events`} 
          sectionType="achievements" 
        />


        {/* Attended Events Section - moved to top */}
        <div className="bg-green-50 rounded-xl shadow mb-6">
          <button
            onClick={() => toggleSection('attended')}
            className="w-full flex items-center justify-between p-6 hover:bg-green-100 transition-colors rounded-xl"
          >
            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Attended Events ({categorizedEvents.attended.length})
              </h3>
            </div>
            <div className="flex items-center gap-3">
              {categorizedEvents.attended.length > 0 && (
                <span className="text-sm text-gray-600">
                  {categorizedEvents.attended.length} event{categorizedEvents.attended.length !== 1 ? 's' : ''}
                </span>
              )}
              <motion.div
                animate={{ rotate: expandedSections.attended ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.div>
            </div>
          </button>

          {expandedSections.attended && categorizedEvents.attended.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="px-6 pb-6"
            >
              <motion.div
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                variants={cardVariants.container}
                initial="initial"
                animate="animate"
              >
                {categorizedEvents.attended.map(renderAttendedEventCard)}
              </motion.div>
            </motion.div>
          )}

          {expandedSections.attended && categorizedEvents.attended.length === 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="px-6 pb-6"
            >
              <div className="text-center py-8 text-gray-500">
                <Award className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p>No attended events found.</p>
              </div>
            </motion.div>
          )}
        </div>

        {loading ? (
          <AchievementEventsLoadingState />
        ) : error ? (
          <AchievementEventsErrorState 
            error={error}
            onRetry={loadEmployeeIdAndEvents}
          />
        ) : allMyEvents.length === 0 ? (
          <AchievementEventsEmptyState 
            employeeId={employeeId}
          />
        ) : (
          <>
            {/* Upcoming Events Section */}
            <AchievementEventsSection
              title="Upcoming Events"
              sectionKey="upcoming"
              events={categorizedEvents.upcoming}
              icon={<Calendar className="w-5 h-5 text-blue-600" />}
              bgColor="bg-blue-50"
              expandedSections={expandedSections}
              toggleSection={toggleSection}
              updatingStatus={updatingStatus}
              loadingRatings={loadingRatings}
              updatingRatings={updatingRatings}
              onRatingUpdate={handleRatingUpdate}
              onConfirmParticipation={handleConfirmParticipation}
              onRejectParticipation={handleRejectParticipation}
              canConfirmParticipation={canConfirmParticipation}
              isEventUpcomingForStatus={isEventUpcomingForStatus}
              formatEventDate={formatEventDate}
              formatEventTime={formatEventTime}
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
            />

            {/* Other Events Section */}
            <div className="bg-orange-50 rounded-xl shadow mb-6">
              <button
                onClick={() => toggleSection('other')}
                className="w-full flex items-center justify-between p-6 hover:bg-orange-100 transition-colors rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-orange-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    View All Events ({categorizedEvents.other.length})
                  </h3>
                </div>
                <div className="flex items-center gap-3">
                  {categorizedEvents.other.length > 0 && (
                    <span className="text-sm text-gray-600">
                      {categorizedEvents.other.length} event{categorizedEvents.other.length !== 1 ? 's' : ''}
                    </span>
                  )}
                  <motion.div
                    animate={{ rotate: expandedSections.other ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.div>
                </div>
              </button>

              {/* Info message inside the container */}
              <div className="mb-4 mx-6 mt-2 text-yellow-700 bg-yellow-50  px-4 py-3 rounded">
                Here will be the list of events you have not attended or have been rejected.
              </div>

              {expandedSections.other && categorizedEvents.other.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-6 pb-6"
                >
                  <motion.div
                    className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                    variants={cardVariants.container}
                    initial="initial"
                    animate="animate"
                  >
                    {categorizedEvents.other.map(renderOtherEventCard)}
                  </motion.div>
                </motion.div>
              )}

              {expandedSections.other && categorizedEvents.other.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-6 pb-6"
                >
                  <div className="text-center py-8 text-gray-500">
                    <XCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p>No events found.</p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Summary */}
            <AchievementEventsSummary
              allMyEvents={allMyEvents}
              categorizedEvents={categorizedEvents}
              employeeId={employeeId}
            />
          </>
        )}
      </section>

      {/* Reject Participation Confirmation Popup */}
      {showRejectPopup.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Are you sure?</h3>
            <p className="mb-6 text-gray-700">
              Do you really want to <span className="font-bold text-red-600">reject</span> your participation for <span className="font-semibold">{showRejectPopup.volunteer?.eventName}</span>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                onClick={() => setShowRejectPopup({ open: false, volunteer: null })}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                onClick={confirmRejectParticipation}
              >
                Yes, Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

function toTitleCase(name: string) {
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default AchievementEvents;