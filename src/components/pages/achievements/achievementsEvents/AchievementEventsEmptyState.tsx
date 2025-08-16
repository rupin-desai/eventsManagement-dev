import { Calendar } from "lucide-react";

interface AchievementEventsEmptyStateProps {
  employeeId: string;
}

const AchievementEventsEmptyState: React.FC<AchievementEventsEmptyStateProps> = ({
  employeeId
}) => {
  return (
    <div className="bg-gray-50 rounded-xl shadow p-6 text-center">
      <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
      <h4 className="text-lg font-semibold text-gray-900 mb-2">
        No Events Found
      </h4>
      <p className="text-gray-600 text-sm">
        You haven't participated in any events yet. 
        <br />
        Check out the events calendar to find volunteering opportunities!
      </p>
      {employeeId && (
        <div className="mt-4 p-3 bg-gray-100 rounded text-xs text-gray-600">
          <strong>Debug:</strong> Checked events for employee ID: {employeeId}
        </div>
      )}
    </div>
  );
};

export default AchievementEventsEmptyState;