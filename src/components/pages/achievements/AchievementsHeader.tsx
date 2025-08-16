import { motion } from "framer-motion";
import { fadeInVariants } from "../../../utils/animationVariants";
import type { CurrentUserDetails } from "../../../types/volunteerFormTypes";

// Add base URL for public assets
const BASE_URL = import.meta.env.BASE_URL || "/";

interface AchievementsHeaderProps {
  userName: string;
  empCode: string;
  userDetails?: CurrentUserDetails | null;
}

const AchievementsHeader: React.FC<AchievementsHeaderProps> = ({ 
 
}) => {
  return (
    <>
      {/* Title */}
      <motion.div
        className="relative flex flex-col items-center mb-8"
        variants={fadeInVariants("up", 0.1)}
      >
        <motion.h1
          className="text-3xl md:text-4xl font-bold text-black text-center whitespace-nowrap"
          variants={fadeInVariants("up", 0.15)}
        >
          My Achievements
        </motion.h1>
        <motion.img
          src={`${BASE_URL}graphics/smile_underline.svg`}
          alt="underline"
          className="absolute left-1/2 -translate-x-1/2 -bottom-6 w-[120px] h-auto"
          style={{ pointerEvents: "none" }}
          variants={fadeInVariants("up", 0.2)}
        />
      </motion.div>
    </>
  );
};

export default AchievementsHeader;