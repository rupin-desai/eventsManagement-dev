import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, User, Loader2, CheckCircle, Star } from "lucide-react";
import { cardVariants } from "../../../../utils/animationVariants";
import AchievementsSmileRating from "../AchievementsSmileRating";
import type { VolunteerWithEventDetails } from "./types/AchievementEventsTypes";

interface AchievementEventsCardProps {
  volunteer: VolunteerWithEventDetails;
  idx: number;
  isAttended: boolean;
  isUpcomingEvent: boolean;
  canConfirm: boolean;
  isConfirming: boolean;
  isLoadingRating: boolean;
  isUpdatingRating: boolean;
  onRatingUpdate: (volunteerId: number, newRating: number) => Promise<void>;
  onConfirmParticipation: (volunteer: VolunteerWithEventDetails) => Promise<void>;
  onRejectParticipation?: (volunteer: VolunteerWithEventDetails) => void; // <-- Add this line
  formatEventDate: (volunteer: VolunteerWithEventDetails) => string;
  formatEventTime: (volunteer: VolunteerWithEventDetails) => string;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string, isUpcoming?: boolean) => string;
}

const AchievementEventsCard: React.FC<AchievementEventsCardProps> = ({
  volunteer,
  idx,
  isAttended,
  isUpcomingEvent,
  canConfirm,
  isConfirming,
  isLoadingRating,
  isUpdatingRating,
  onRatingUpdate,
  onConfirmParticipation,
  onRejectParticipation, // <-- Add this
  formatEventDate,
  formatEventTime,
  getStatusColor,
  getStatusText
}) => {
  return (
    <motion.div
      key={`${volunteer.volunteerId}-${idx}`}
      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
      variants={cardVariants.item}
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Event Info */}
        <div className="flex-1">
          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-blue-600 mt-1" />
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-1">
                {volunteer.eventName || 'Event Name TBD'}
              </h4>
              {volunteer.eventSubName && (
                <p className="text-sm text-gray-600 mb-2">
                  {volunteer.eventSubName}
                </p>
              )}
              
              {/* Location */}
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <MapPin className="w-4 h-4" />
                <span>{volunteer.eventLocationName}</span>
              </div>
              
              {/* Date and Time */}
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <Calendar className="w-4 h-4" />
                <span>{formatEventDate(volunteer)}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{formatEventTime(volunteer)}</span>
              </div>
              
              {/* Venue if available */}
              {volunteer.venue && volunteer.venue.trim() && (
                <div className="mt-2 text-xs text-gray-500">
                  <strong>Venue:</strong> {volunteer.venue}
                </div>
              )}

              {/* Employee Info */}
              <div className="mt-2 text-xs text-gray-500">
                <strong>Volunteer ID:</strong> {volunteer.volunteerId}
                {!isAttended && (
                  <span className="ml-2">
                    <strong>Confirmation:</strong> {volunteer.enableConf === 'true' ? 'Enabled' : 'Disabled'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Status and Actions */}
        <div className="flex flex-col lg:items-end gap-3">
          {/* Only show status badge if not in upcoming section or if it's not a "Not Attended" status */}
          {(!isUpcomingEvent || (volunteer.status?.toUpperCase() !== 'N')) && (
            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(volunteer.status)}`}>
              {getStatusText(volunteer.status, isUpcomingEvent)}
            </span>
          )}
          
          {/* Rating for attended events */}
          {isAttended && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Your Rating</span>
              </div>
              {isLoadingRating ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-4 h-4 animate-spin text-green-600" />
                  <span className="ml-2 text-sm text-green-600">Loading rating...</span>
                </div>
              ) : (
                <AchievementsSmileRating
                  rating={volunteer.rating || 0}
                  volunteerId={volunteer.volunteerId}
                  isInteractive={true}
                  onRatingChange={onRatingUpdate}
                  isUpdating={isUpdatingRating}
                />
              )}
            </div>
          )}
          
          {/* Confirmation Button (only for upcoming events) */}
          {!isAttended && canConfirm && (
            <div className="flex gap-2">
              <button
                onClick={() => onConfirmParticipation(volunteer)}
                disabled={isConfirming}
                className={`flex items-center cursor-pointer gap-2 px-4 py-2 text-sm font-semibold rounded-lg shadow transition-colors
                  ${isConfirming
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2'
                  }`}
                style={{ minWidth: 180 }}
              >
                {isConfirming ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Confirming...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Confirm 
                  </>
                )}
              </button>
              {onRejectParticipation && (
                <button
                  onClick={() => onRejectParticipation(volunteer)}
                  disabled={isConfirming}
                  className={`flex items-center cursor-pointer gap-2 px-4 py-2 text-sm font-semibold rounded-lg shadow transition-colors
                    ${isConfirming
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2'
                    }`}
                  style={{ minWidth: 120 }}
                >
                  Reject
                </button>
              )}
            </div>
          )}
          
          <div className="text-xs text-gray-500">
            Nominated: {new Date(volunteer.addedOn).toLocaleDateString()}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AchievementEventsCard;