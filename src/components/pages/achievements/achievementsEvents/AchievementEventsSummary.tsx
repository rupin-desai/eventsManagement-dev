import type { CategorizedEvents, VolunteerWithEventDetails } from "./types/AchievementEventsTypes";

interface AchievementEventsSummaryProps {
  allMyEvents: VolunteerWithEventDetails[];
  categorizedEvents: CategorizedEvents;
  employeeId: string;
}

const AchievementEventsSummary: React.FC<AchievementEventsSummaryProps> = ({
  allMyEvents,
  categorizedEvents,
  employeeId
}) => {
  return (
    <div className="mt-6 pt-4 border-t border-gray-200 text-center">
      <p className="text-sm text-gray-700">
        Total Events: <strong>{allMyEvents.length}</strong> | 
        Upcoming: <strong>{categorizedEvents.upcoming.length}</strong> | 
        Attended: <strong>{categorizedEvents.attended.length}</strong> | 
        Other: <strong>{categorizedEvents.other.length}</strong>
      </p>
      {employeeId && (
        <p className="mt-1 text-xs text-gray-500">
          Employee ID: {employeeId}
        </p>
      )}
    </div>
  );
};

export default AchievementEventsSummary;