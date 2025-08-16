import { Loader2 } from "lucide-react";

const AchievementEventsLoadingState: React.FC = () => {
  return (
    <div className="bg-blue-50 rounded-xl shadow p-6">
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        <span className="ml-2 text-blue-700">Loading your events...</span>
      </div>
    </div>
  );
};

export default AchievementEventsLoadingState;