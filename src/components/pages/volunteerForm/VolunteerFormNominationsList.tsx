import { motion } from "framer-motion";
import { fadeInVariants } from "../../../utils/animationVariants";
import { Users, Send, MapPin, Trash2 } from "lucide-react";
import type { Nomination, CurrentUserDetails } from "../../../types/volunteerFormTypes";

interface VolunteerFormNominationsListProps {
  nominations: Nomination[];
  setNominations: (nominations: Nomination[]) => void;
  isSubmitting: boolean;
  currentUser: CurrentUserDetails | null;
  eventId: number;
  onSubmit: () => void;
}

const RELATION_OPTIONS = [
  { label: "Mother", value: 1 },
  { label: "Father", value: 2 },
  { label: "Spouse", value: 3 },
  { label: "Sibling", value: 4 },
  { label: "Child", value: 5 },
  { label: "Friend", value: 6 },
];

const VolunteerFormNominationsList = ({
  nominations,
  setNominations,
  isSubmitting,
  currentUser,
  onSubmit
}: VolunteerFormNominationsListProps) => {
  
  const removeNomination = (id: string) => {
    setNominations(nominations.filter((nom) => nom.id !== id));
  };

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
      variants={fadeInVariants("up", 0.3)} // ✅ Updated animation
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Users className="w-10 h-10 text-yellow-600" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            New Participations / Nominations ({nominations.length})
          </h2>
        </div>

        {nominations.length > 0 && (
          <motion.button
            className="bg-green-500 cursor-pointer hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            whileTap={{ scale: 0.95 }}
            onClick={onSubmit}
            disabled={isSubmitting || !currentUser}
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-3 h-3" />
            )}
            {isSubmitting ? "Submitting..." : "Submit"}
          </motion.button>
        )}
      </div>

      {nominations.length === 0 ? (
        <div className="text-center py-8">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No New Participations / Nominations
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Search and select employees to add participations / nominations.
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          {nominations.map((nomination) => (
            <motion.div
              key={nomination.id}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {nomination.type === "relation"
                      ? nomination.relationName
                      : nomination.employeeName}
                    {nomination.type === "relation" && (
                      <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                        (
                        {
                          RELATION_OPTIONS.find(
                            (opt) => opt.value === nomination.relationId
                          )?.label
                        }
                        )
                      </span>
                    )}
                  </h4>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {nomination.type === "relation"
                      ? nomination.relationContact
                      : nomination.employeeEmail}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <MapPin className="w-4 h-4" />
                    <span>{nomination.locationName}</span>
                  </div>
                  {nomination.type === "alkemite" && (
                    <div className="text-xs text-gray-500 dark:text-gray-500">
                      Employee ID: {nomination.employeeId}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => removeNomination(nomination.id)}
                  className="text-red-500 hover:text-red-700 transition p-1"
                  disabled={isSubmitting}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* API Preview */}
      
    </motion.div>
  );
};

export default VolunteerFormNominationsList;