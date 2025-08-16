import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  createSuggestionMail,
  updateVolunteerRatingMail,
  getVolunteerDetailsByVIdMail,
  getActivityByEventIdMailByEventId,
  type ActivityByEventIdResponse,
  type VolunteerDetailsResponse,
} from "../../api/mailerApi";
import { getFeedbackDetails } from "../../api/feedbackApi"; // <-- Import feedback API

const ratingEmojis = [
  { value: 1, emoji: "😞", label: "Very Dissatisfied", color: "text-red-400", hoverColor: "hover:text-red-500" },
  { value: 2, emoji: "🙁", label: "Dissatisfied", color: "text-orange-400", hoverColor: "hover:text-orange-500" },
  { value: 3, emoji: "😐", label: "Neutral", color: "text-yellow-400", hoverColor: "hover:text-yellow-500" },
  { value: 4, emoji: "🙂", label: "Satisfied", color: "text-green-400", hoverColor: "hover:text-green-500" },
  { value: 5, emoji: "😊", label: "Very Satisfied", color: "text-green-500", hoverColor: "hover:text-green-600" },
];

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const FEEDBACK_TYPE = "F"; // You can change this as needed

const FeedbackForm = () => {
  const [rating, setRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [encVolunteerId, setEncVolunteerId] = useState<string | null>(null);
  const [volunteerId, setVolunteerId] = useState<number | null>(null);
  const [employeeId, setEmployeeId] = useState<number | null>(null);
  const [eventId, setEventId] = useState<number | null>(null);
  const [activityDetails, setActivityDetails] = useState<ActivityByEventIdResponse | null>(null);

  // Feedback state
  const [existingFeedback, setExistingFeedback] = useState<{
    description: string;
    rating: number;
    eventName?: string;
    eventSubName?: string;
    feedbackDate?: string;
  } | null>(null);

  const query = useQuery();

  useEffect(() => {
    const encId = query.get("encVolunteerId") || query.get("EncpvolunteerId");
    if (encId) setEncVolunteerId(encId);
  }, [query]);

  // Fetch volunteerId, employeeId, and eventId from backend using encVolunteerId
  useEffect(() => {
    const fetchVolunteerDetails = async () => {
      if (!encVolunteerId) return;
      const details: VolunteerDetailsResponse | null = await getVolunteerDetailsByVIdMail(encVolunteerId);
      if (details && details.volunteerId) {
        setVolunteerId(details.volunteerId);
        if (details.employeeId) setEmployeeId(details.employeeId);
        if (details.eventId) setEventId(details.eventId);
      }
    };
    fetchVolunteerDetails();
  }, [encVolunteerId]);

  // Fetch activity/event details using eventId only (do NOT use encVolunteerId)
  useEffect(() => {
    const fetchActivityDetails = async () => {
      if (!eventId) return;
      const activity = await getActivityByEventIdMailByEventId(eventId);
      setActivityDetails(activity || null);
    };
    fetchActivityDetails();
  }, [eventId]);

  // Fetch feedback for this volunteerId using suggestion type (not hardcoded in API)
  useEffect(() => {
    const fetchFeedback = async () => {
      if (!volunteerId) return;
      try {
        const res = await getFeedbackDetails(volunteerId, FEEDBACK_TYPE);
        if (
          res.data &&
          Array.isArray(res.data) &&
          res.data.length > 0
        ) {
          // Use the first feedback entry (API already filters by type)
          const feedbackSuggestion = res.data[0];
          setExistingFeedback({
            description: feedbackSuggestion.description,
            rating: feedbackSuggestion.rating,
            eventName: feedbackSuggestion.eventName,
            eventSubName: feedbackSuggestion.eventSubName,
            feedbackDate: feedbackSuggestion.feedbackDate,
          });
          return;
        }
        setExistingFeedback(null);
      } catch {
        setExistingFeedback(null);
      }
    };
    fetchFeedback();
  }, [volunteerId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!encVolunteerId || rating === null || !volunteerId) return;
    setLoading(true);
    try {
      // 1. Update volunteer rating
      await updateVolunteerRatingMail({
        volunteerId,
        rating,
        encVolunteerId,
      });

      // 2. Send feedback as suggestion (Type: 'F', include EventId)
      await createSuggestionMail({
        Description: feedback,
        VolunteerId: volunteerId,
        EmployeeId: employeeId ?? undefined,
        EventId: eventId ?? undefined,
        Type: "F",
        encVolunteerId,
      });

      setSubmitted(true);
    } catch (err) {
      alert("There was an error submitting your feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-bold mb-2 text-center">Feedback Form</h2>
      {/* Event/Activity Title Only */}
      <div className="mb-6 text-center">
        <div className="text-sm text-gray-500">Event/Activity:</div>
        <div className="font-semibold text-gray-800">
          {/* Prefer feedback eventName/subName if present, else fallback */}
          {existingFeedback?.eventName ||
            activityDetails?.name ||
            "Event details not found"}
        </div>
        {existingFeedback?.eventSubName && (
          <div className="text-xs text-gray-500">
            {existingFeedback.eventSubName}
          </div>
        )}
      </div>
      {/* Show existing feedback if present */}
      {existingFeedback ? (
        <div className="mb-6">
          <div className="text-green-700 font-semibold text-center mb-2">
            Feedback already submitted!
          </div>
          <div className="mb-2">
            <span className="font-medium">Your Rating:</span>{" "}
            <span className="text-2xl align-middle">
              {ratingEmojis.find((r) => r.value === existingFeedback.rating)?.emoji}
            </span>
            <span className="ml-2 text-gray-700">
              {ratingEmojis.find((r) => r.value === existingFeedback.rating)?.label}
            </span>
          </div>
          <div>
            <span className="font-medium">Your Feedback:</span>
            <textarea
              className="w-full border rounded p-2 min-h-[80px] bg-gray-100"
              value={existingFeedback.description}
              readOnly
              disabled
              style={{ pointerEvents: "none", opacity: 0.7 }}
            />
          </div>
          {existingFeedback.feedbackDate && (
            <div className="text-xs text-gray-500 mt-2 text-right">
              Submitted on: {new Date(existingFeedback.feedbackDate).toLocaleString()}
            </div>
          )}
        </div>
      ) : submitted ? (
        <div className="text-green-600 text-center font-semibold">
          Thank you for your feedback!
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-medium mb-2">Your Rating:</label>
            <div className="flex gap-2 justify-center">
              {ratingEmojis.map((item) => (
                <button
                  type="button"
                  key={item.value}
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-2xl transition
                    cursor-pointer
                    ${rating === item.value
                      ? `${item.color} scale-110 border-yellow-500 bg-yellow-100 shadow-lg`
                      : `bg-gray-100 border-gray-300 ${item.color} hover:bg-yellow-50 hover:scale-105`
                    }
                    ${item.hoverColor}
                  `}
                  onClick={() => setRating(item.value)}
                  aria-label={item.label}
                  title={item.label}
                  tabIndex={0}
                  disabled={!!existingFeedback}
                  style={!!existingFeedback ? { pointerEvents: "none", opacity: 0.6 } : {}}
                >
                  {item.emoji}
                </button>
              ))}
            </div>
            {rating && (
              <div className="text-center text-sm mt-2 text-gray-700 font-medium">
                {ratingEmojis.find((r) => r.value === rating)?.label}
              </div>
            )}
          </div>
          <div>
            <label className="block font-medium mb-2" htmlFor="feedback">
              Your Feedback:
            </label>
            <textarea
              id="feedback"
              className="w-full border rounded p-2 min-h-[80px] bg-gray-100"
              value={feedback}
              onChange={(e) => {
                if (!existingFeedback) setFeedback(e.target.value);
              }}
              required
              placeholder="Write your feedback here..."
              disabled={!!existingFeedback}
              style={!!existingFeedback ? { pointerEvents: "none", opacity: 0.7 } : {}}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded transition"
            disabled={
              rating === null ||
              feedback.trim() === "" ||
              loading ||
              !encVolunteerId ||
              !volunteerId ||
              !!existingFeedback
            }
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      )}
    </div>
  );
};

export default FeedbackForm;