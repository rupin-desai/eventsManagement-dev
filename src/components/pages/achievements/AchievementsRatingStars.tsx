import { Smile } from "lucide-react";

interface AchievementsRatingStarsProps {
  rating: number;
  maxRating?: number;
}

const AchievementsRatingStars: React.FC<AchievementsRatingStarsProps> = ({ 
  rating, 
  maxRating = 5 
}) => {
  return (
    <div className="flex items-center justify-center gap-1">
      {[...Array(maxRating)].map((_, i) => (
        <Smile
          key={i}
          className={
            i < rating
              ? "text-yellow-400 w-5 h-5"
              : "text-gray-300 w-5 h-5"
          }
        />
      ))}
    </div>
  );
};

export default AchievementsRatingStars;