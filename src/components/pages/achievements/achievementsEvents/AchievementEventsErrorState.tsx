import { AlertCircle } from "lucide-react";

interface AchievementEventsErrorStateProps {
  error: string;
  onRetry: () => void;
}

const AchievementEventsErrorState: React.FC<AchievementEventsErrorStateProps> = ({
  error,
  onRetry
}) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6">
      <div className="flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-red-600" />
        <div>
          <h4 className="font-semibold text-red-900">Error Loading Events</h4>
          <p className="text-red-700 text-sm">{error}</p>
          <button 
            onClick={onRetry}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default AchievementEventsErrorState;