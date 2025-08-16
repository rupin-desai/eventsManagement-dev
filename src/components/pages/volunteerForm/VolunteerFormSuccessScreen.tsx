import { motion } from "framer-motion";
import { sectionVariants, fadeInVariants } from "../../../utils/animationVariants";
import { Check } from "lucide-react";
import type { Nomination } from "../../../types/volunteerFormTypes";

interface VolunteerFormSuccessScreenProps {
  nominations: Nomination[];
  eventName: string;
}

const VolunteerFormSuccessScreen = ({
  nominations,
  eventName
}: VolunteerFormSuccessScreenProps) => {
  return (
    <motion.div
      className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4"
      initial="initial"
      animate="animate"
      variants={sectionVariants}
    >
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
        variants={fadeInVariants("up", 0.2)}
      >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Nominations Submitted Successfully!
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Your{" "}
          {nominations.length} nomination{nominations.length > 1 ? "s have" : " has"} been successfully submitted for{" "}
          <strong>{eventName}</strong>.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          The nominated volunteers will be notified about their selection.
        </p>
        <div className="text-xs text-gray-400 dark:text-gray-500">
          Redirecting to events page in a few seconds...
        </div>
      </motion.div>
    </motion.div>
  );
};

export default VolunteerFormSuccessScreen;