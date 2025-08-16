import { motion } from "framer-motion";
import { fadeInVariants } from "../../../utils/animationVariants";
import { Calendar, Loader2 } from "lucide-react";
import type { EventDetails, CurrentUserDetails } from "../../../types/volunteerFormTypes";

interface VolunteerFormHeaderProps {
  eventName: string;
  eventDetails: EventDetails;
  currentUser: CurrentUserDetails | null;
  loadingCurrentUser: boolean;
  title?: string;
  subtitle?: string;
}

const VolunteerFormHeader = ({
  eventName,
  eventDetails,
  loadingCurrentUser,
  title = "Nominate Volunteers",
  subtitle,
}: VolunteerFormHeaderProps) => {
  // Convert month number to month name
  const getMonthName = (monthNumber: string | number): string => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthIndex = parseInt(monthNumber.toString()) - 1;
    return monthNames[monthIndex] || 'Unknown';
  };

  return (
    <motion.div
      className="mb-8 px-2 sm:px-4"
      variants={fadeInVariants("up", 0.2)}
    >
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mb-4">
        <div className="w-8 sm:w-12 h-0.5 bg-yellow-400"></div>
        <span className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider text-center">
          Event Volunteering Form
        </span>
        <div className="w-8 sm:w-12 h-0.5 bg-yellow-400"></div>
      </div>

      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2 break-words">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-200 mb-4 max-w-xl mx-auto break-words">
            {subtitle}
          </p>
        )}
      </div>

      {/* Event Information - Centered */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 sm:p-6 mt-6">
        <div className="text-center">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-3">
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
            <span className="text-lg sm:text-2xl md:text-3xl font-bold text-yellow-800 dark:text-yellow-200 break-words">
              {eventName}
            </span>
          </div>
          {eventDetails && (
            <p className="text-base sm:text-lg text-yellow-700 dark:text-yellow-300">
              {getMonthName(eventDetails.tentativeMonth)} {eventDetails.tentativeYear}
            </p>
          )}
        </div>
      </div>

      {/* Loading Current User */}
      {loadingCurrentUser && (
        <motion.div
          className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3 sm:p-4 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
            <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm sm:text-base">
              Loading user information...
            </span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default VolunteerFormHeader;