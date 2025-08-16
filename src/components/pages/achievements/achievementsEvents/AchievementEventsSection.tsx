import { motion } from "framer-motion";
import { Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { cardVariants } from "../../../../utils/animationVariants";
import AchievementEventsCard from "./AchievementEventsCard";
import type { VolunteerWithEventDetails, ExpandedSections } from "./types/AchievementEventsTypes";

interface AchievementEventsSectionProps {
  title: string;
  sectionKey: keyof ExpandedSections;
  events: VolunteerWithEventDetails[];
  icon: React.ReactNode;
  bgColor: string;
  expandedSections: ExpandedSections;
  toggleSection: (section: keyof ExpandedSections) => void;
  updatingStatus: Set<number>;
  loadingRatings: Set<number>;
  updatingRatings: Set<number>;
  onRatingUpdate: (volunteerId: number, newRating: number) => Promise<void>;
  onConfirmParticipation: (volunteer: VolunteerWithEventDetails) => Promise<void>;
  onRejectParticipation?: (volunteer: VolunteerWithEventDetails) => void;
  canConfirmParticipation: (volunteer: VolunteerWithEventDetails) => boolean;
  isEventUpcomingForStatus: (volunteer: VolunteerWithEventDetails) => boolean;
  formatEventDate: (volunteer: VolunteerWithEventDetails) => string;
  formatEventTime: (volunteer: VolunteerWithEventDetails) => string;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string, isUpcoming?: boolean) => string;
}

const AchievementEventsSection: React.FC<AchievementEventsSectionProps> = ({
  title,
  sectionKey,
  events,
  icon,
  bgColor,
  expandedSections,
  toggleSection,
  updatingStatus,
  loadingRatings,
  updatingRatings,
  onRatingUpdate,
  onConfirmParticipation,
  onRejectParticipation,
  canConfirmParticipation,
  // isEventUpcomingForStatus,
  formatEventDate,
  formatEventTime,
  getStatusColor,
  getStatusText
}) => {
  return (
    <div className={`${bgColor} rounded-xl shadow p-6 mb-6`}>
      <button
        onClick={() => toggleSection(sectionKey)}
        className="w-full flex items-center justify-between mb-4 focus:outline-none"
      >
        <div className="flex items-center gap-3">
          {icon}
          <h3 className="text-lg font-semibold text-gray-900">
            {title} ({events.length})
          </h3>
        </div>
        {expandedSections[sectionKey] ? (
          <ChevronUp className="w-5 h-5 text-gray-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-600" />
        )}
      </button>
      
      {expandedSections[sectionKey] && (
        <motion.div
          className="space-y-4"
          variants={cardVariants.container}
          initial="initial"
          animate="animate"
        >
          {events.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 text-sm">No events in this category</p>
            </div>
          ) : (
            events.map((event, idx) => {
              // const isAttended = sectionKey === 'attended';
              // const isUpcomingEvent = isEventUpcomingForStatus(event);
              // const canConfirm = canConfirmParticipation(event);
              // const isConfirming = updatingStatus.has(event.volunteerId);
              // const isLoadingRating = loadingRatings.has(event.volunteerId);
              // const isUpdatingRating = updatingRatings.has(event.volunteerId);

              return (
                <AchievementEventsCard
                  key={`${event.volunteerId}-${idx}`}
                  volunteer={event}
                  idx={idx}
                  isAttended={false}
                  isUpcomingEvent={sectionKey === 'upcoming'} // Make sure this is correctly passed
                  canConfirm={canConfirmParticipation(event)}
                  isConfirming={updatingStatus.has(event.volunteerId)}
                  isLoadingRating={loadingRatings.has(event.volunteerId)}
                  isUpdatingRating={updatingRatings.has(event.volunteerId)}
                  onRatingUpdate={onRatingUpdate}
                  onConfirmParticipation={onConfirmParticipation}
                  onRejectParticipation={onRejectParticipation}
                  formatEventDate={formatEventDate}
                  formatEventTime={formatEventTime}
                  getStatusColor={getStatusColor}
                  getStatusText={getStatusText}
                />
              );
            })
          )}
        </motion.div>
      )}
    </div>
  );
};

export default AchievementEventsSection;