import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { UploadCloud } from "lucide-react";
import {
  createSuggestionMail,
  getVolunteerDetailsByVIdMail,
  getActivityByEventIdMailByEventId,
  type ActivityByEventIdResponse,
  type VolunteerDetailsResponse,
} from "../../api/mailerApi";

import { getFeedbackDetails } from "../../api/feedbackApi"; // <-- Import feedback API

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const EXPERIENCE_TYPE = "E"; // You can change this if needed

const ExperienceForm = () => {
  const [writeup, setWriteup] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [encVolunteerId, setEncVolunteerId] = useState<string | null>(null);
  const [volunteerId, setVolunteerId] = useState<number | null>(null);
  const [employeeId, setEmployeeId] = useState<number | null>(null);
  const [eventId, setEventId] = useState<number | null>(null);
  const [activityDetails, setActivityDetails] = useState<ActivityByEventIdResponse | null>(null);

  // Feedback state for experience
  const [existingExperience, setExistingExperience] = useState<{
    description: string;
    imageUrl?: string;
    eventName?: string;
    eventSubName?: string;
    suggestionId?: number;
    experienceDate?: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
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
      // Only use eventId for fetching activity details
      const activity = await getActivityByEventIdMailByEventId(eventId);
      setActivityDetails(activity || null);
    };
    fetchActivityDetails();
  }, [eventId]);

  // Fetch existing experience for this volunteerId using type = E
  useEffect(() => {
    const fetchExperience = async () => {
      if (!volunteerId) return;
      try {
        // getFeedbackDetails can be reused for experience if it supports type param
        // If you have a getExperienceDetails API, use that instead
        const res = await getFeedbackDetails(volunteerId, EXPERIENCE_TYPE);
        if (
          res.data &&
          Array.isArray(res.data) &&
          res.data.length > 0
        ) {
          const exp = res.data[0];
          setExistingExperience({
            description: exp.description,
            // imageUrl: exp.imageUrl, // if your API returns imageUrl
            eventName: exp.eventName,
            eventSubName: exp.eventSubName,
            suggestionId: exp.suggestionId,
            // experienceDate: exp.experienceDate || exp.feedbackDate,
          });
          return;
        }
        setExistingExperience(null);
      } catch {
        setExistingExperience(null);
      }
    };
    fetchExperience();
  }, [volunteerId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImage(file || null);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!encVolunteerId || !volunteerId) return;
    setLoading(true);
    try {
      await createSuggestionMail({
        Description: writeup,
        VolunteerId: volunteerId,
        EmployeeId: employeeId ?? undefined,
        EventId: eventId ?? undefined,
        Type: "E",
        encVolunteerId,
        file: image ?? undefined,
      });

      setSubmitted(true);
    } catch (err) {
      alert("There was an error submitting your experience. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-bold mb-2 text-center">Share Your Experience</h2>
      {/* Show only name and subName */}
      <div className="mb-6 text-center">
        <div className="text-sm text-gray-500">Event/Activity:</div>
        <div className="font-semibold text-gray-800">
          {existingExperience?.eventName || activityDetails?.name || "Event details not found"}
        </div>
        {(existingExperience?.eventSubName || activityDetails?.subName) && (
          <div className="text-xs text-gray-500">
            {existingExperience?.eventSubName || activityDetails?.subName}
          </div>
        )}
      </div>
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
          {existingExperience.imageUrl && (
            <div className="mt-3 flex justify-center">
              <img
                src={existingExperience.imageUrl}
                alt="Experience"
                className="max-h-40 rounded shadow"
              />
            </div>
          )}
          {existingExperience.experienceDate && (
            <div className="text-xs text-gray-500 mt-2 text-right">
              Submitted on: {new Date(existingExperience.experienceDate).toLocaleString()}
            </div>
          )}
        </div>
      ) : submitted ? (
        <div className="text-green-600 text-center font-semibold">
          Thank you for sharing your experience!
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-medium mb-2" htmlFor="writeup">
              Your Experience (short write-up):
            </label>
            <textarea
              id="writeup"
              className="w-full border rounded p-2 min-h-[80px]"
              value={writeup}
              onChange={(e) => setWriteup(e.target.value)}
              required
              maxLength={500}
              placeholder="Share your experience in a few lines..."
              disabled={!!existingExperience}
              style={!!existingExperience ? { pointerEvents: "none", opacity: 0.7 } : {}}
            />
            <div className="text-xs text-gray-400 text-right">{writeup.length}/500</div>
          </div>
          <div>
            <label className="block font-medium mb-2" htmlFor="image">
              Upload an Image:
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleUploadClick}
                className="p-2 rounded-full bg-yellow-100 border border-yellow-300 text-yellow-700 hover:bg-yellow-400 hover:text-white hover:shadow-lg transition cursor-pointer"
                title="Upload Image"
                aria-label="Upload Image"
                disabled={!!existingExperience}
                style={!!existingExperience ? { pointerEvents: "none", opacity: 0.7 } : {}}
              >
                <UploadCloud className="w-6 h-6" />
              </button>
              <span className="text-sm text-gray-500">
                {image ? image.name : "No file chosen"}
              </span>
            </div>
            <input
              id="image"
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageChange}
              disabled={!!existingExperience}
            />
            {imagePreview && (
              <div className="mt-3 flex justify-center">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-40 rounded shadow"
                />
              </div>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded transition"
            disabled={
              writeup.trim() === "" ||
              loading ||
              !encVolunteerId ||
              !volunteerId ||
              !!existingExperience
            }
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      )}
    </div>
  );
};

export default ExperienceForm;