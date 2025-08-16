import { useState } from "react";
import { motion } from "framer-motion";

interface AchievementsSmileRatingProps {
  rating: number;
  volunteerId: number;
  isInteractive?: boolean;
  onRatingChange?: (volunteerId: number, newRating: number) => Promise<void>;
  isUpdating?: boolean;
}

const AchievementsSmileRating: React.FC<AchievementsSmileRatingProps> = ({
  rating,
  isInteractive = false,
  onRatingChange,
  isUpdating = false
}) => {
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [localRating, setLocalRating] = useState<number>(rating);

  // ✅ Smile emoji mapping based on event history pattern
  const getSmileEmoji = (ratingValue: number): string => {
    switch (ratingValue) {
      case 1:
        return '😞'; // Very dissatisfied
      case 2:
        return '😐'; // Dissatisfied
      case 3:
        return '🙂'; // Neutral/OK
      case 4:
        return '😊'; // Satisfied
      case 5:
        return '😁'; // Very satisfied
      default:
        return '😶'; // No rating
    }
  };

  // ✅ Rating text labels
  const getRatingText = (ratingValue: number): string => {
    switch (ratingValue) {
      case 1:
        return 'Poor';
      case 2:
        return 'Fair';
      case 3:
        return 'Good';
      case 4:
        return 'Very Good';
      case 5:
        return 'Excellent';
      default:
        return 'No Rating';
    }
  };

  // ✅ Handle rating click (static demo - no API call)
  const handleRatingClick = async (newRating: number) => {
    if (!isInteractive || isUpdating) return;

    try {
      setLocalRating(newRating);
      
      // Simulate API call with timeout
      if (onRatingChange) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        // In a real app, this would call the API
        // await onRatingChange(volunteerId, newRating);
      }
    } catch (error) {
      // Revert on error
      setLocalRating(rating);
      console.error('Failed to update rating:', error);
    }
  };

  // ✅ Render individual smile
  const renderSmile = (index: number) => {
    const ratingValue = index + 1;
    const isActive = (hoverRating || localRating) >= ratingValue;
    const emoji = getSmileEmoji(ratingValue);

    return (
      <motion.button
        key={index}
        className={`text-2xl transition-all duration-200 ${
          isInteractive ? 'cursor-pointer hover:scale-110' : 'cursor-default'
        } ${isActive ? 'opacity-100' : 'opacity-30'} ${
          isUpdating ? 'pointer-events-none' : ''
        }`}
        whileHover={isInteractive ? { scale: 1.1 } : {}}
        whileTap={isInteractive ? { scale: 0.95 } : {}}
        onClick={() => handleRatingClick(ratingValue)}
        onMouseEnter={() => isInteractive && setHoverRating(ratingValue)}
        onMouseLeave={() => isInteractive && setHoverRating(0)}
        disabled={isUpdating || !isInteractive}
        title={isInteractive ? `Rate ${getRatingText(ratingValue)}` : getRatingText(ratingValue)}
      >
        {emoji}
      </motion.button>
    );
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {/* ✅ Smile emojis row */}
      <div className="flex items-center gap-1">
        {[0, 1, 2, 3, 4].map(renderSmile)}
      </div>

      {/* ✅ Rating text and value */}
      <div className="text-center">
        {localRating > 0 ? (
          <>
            <div className="text-sm font-medium text-gray-700">
              {getRatingText(hoverRating || localRating)}
            </div>
            <div className="text-xs text-gray-500">
              ({hoverRating || localRating}/5)
            </div>
          </>
        ) : (
          <div className="text-sm text-gray-500">
            {isInteractive ? 'Click to rate' : 'Not rated'}
          </div>
        )}
      </div>

      {/* ✅ Interactive hint */}
      {isInteractive && !isUpdating && (
        <div className="text-xs text-gray-400 text-center max-w-32">
          Click a smile to rate your experience
        </div>
      )}

      {/* ✅ Updating indicator */}
      {isUpdating && (
        <div className="text-xs text-blue-600 text-center">
          Updating rating...
        </div>
      )}
    </div>
  );
};

export default AchievementsSmileRating;