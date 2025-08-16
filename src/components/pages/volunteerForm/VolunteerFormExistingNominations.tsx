import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fadeInVariants } from "../../../utils/animationVariants";
import { Users, MapPin, Clock, Loader2, RefreshCw, Eye, User, Mail, Briefcase, Heart } from "lucide-react";
import { getVolunteersBySelfNEvent, type ExistingVolunteer } from "../../../api/volunteerApi";
import { getRelVolunteersBySelfNEvent } from "../../../api/relationApi";
import type { CurrentUserDetails } from "../../../types/volunteerFormTypes";

interface VolunteerFormExistingNominationsProps {
  eventId: number;
  currentUser: CurrentUserDetails | null;
  refreshTrigger: number; // To refresh when new nominations are added
}

interface FamilyFriendVolunteer {
  relationId: number;
  relationName: string;
  relationContact: number;
  eventLocationName?: string;
  status?: string;
  addedOn?: string;
}

const RELATION_LABELS: Record<number, string> = {
  1: "Mother",
  2: "Father",
  3: "Spouse",
  4: "Sibling",
  5: "Child",
  6: "Friend",
};

const VolunteerFormExistingNominations = ({
  eventId,
  currentUser,
  refreshTrigger
}: VolunteerFormExistingNominationsProps) => {
  const [existingVolunteers, setExistingVolunteers] = useState<ExistingVolunteer[]>([]);
  const [familyFriends, setFamilyFriends] = useState<FamilyFriendVolunteer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // Function to load existing volunteers (Alkemites)
  const loadExistingVolunteers = async () => {
    if (!currentUser || !eventId) return;

    try {
      setLoading(true);
      setError("");
      const response = await getVolunteersBySelfNEvent(eventId, currentUser.employeeId);
      setExistingVolunteers(response.data || []);
    } catch (error: any) {
      if (error.response?.status !== 404) {
        setError("Failed to load existing nominations. Please try again.");
      } else {
        setExistingVolunteers([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to load family/friends nominations
  const loadFamilyFriends = async () => {
    if (!currentUser || !eventId) return;
    try {
      setLoading(true);
      setError("");
      // Use correct key "emloyeeId" and updated API usage
      const response = await getRelVolunteersBySelfNEvent({
        eventId: Number(eventId),
        employeeId: currentUser.employeeId, // <- use "employee Id"
      });
      setFamilyFriends(Array.isArray(response.data) ? response.data : []);
    } catch (error: any) {
      if (error.response?.status !== 404) {
        setError("Failed to load family/friends nominations. Please try again.");
      } else {
        setFamilyFriends([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Load both on mount and when dependencies change
  useEffect(() => {
    loadExistingVolunteers();
    loadFamilyFriends();
    // eslint-disable-next-line
  }, [eventId, currentUser, refreshTrigger]);

  // Manual refresh function
  const handleRefresh = () => {
    loadExistingVolunteers();
    loadFamilyFriends();
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  // Get status badge styling with theme colors
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'A': { label: 'Approved', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' },
      'P': { label: 'Pending', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' },
      'R': { label: 'Rejected', color: 'bg-red-100 dark:bg-red-900/20 text-white dark:text-red-400', style: { backgroundColor: 'var(--brand-secondary)' } },
      'N': { label: 'New', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' },
      'C': { label: 'Completed', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400' }
    }[status] || { label: status, color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400' };

    return (
      <span 
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}
        style={statusConfig.style}
      >
        {statusConfig.label}
      </span>
    );
  };

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
      variants={fadeInVariants("up", 0.4)}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Eye className="w-10 h-10" style={{ color: 'var(--brand-secondary)' }} />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Your Existing Participations / Nominations ({existingVolunteers.length + familyFriends.length})
          </h2>
        </div>

        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-white rounded-lg transition-colors disabled:opacity-50 hover:opacity-80"
          style={{ backgroundColor: 'var(--brand-secondary)' }}
        >
          <RefreshCw className={`w-4 h-4  ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--brand-secondary)' }} />
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading existing participations / nominations...</span>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="border rounded-lg p-4" style={{ backgroundColor: 'var(--brand-secondary)', borderColor: 'var(--brand-secondary)' }}>
          <div className="flex items-center gap-2 text-white">
            <Users className="w-5 h-5" />
            <span className="font-medium">Error Loading Nominations</span>
          </div>
          <p className="text-white/90 text-sm mt-1">{error}</p>
        </div>
      )}

      {/* No Existing Nominations */}
      {!loading && !error && existingVolunteers.length === 0 && familyFriends.length === 0 && (
        <div className="text-center py-8">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Previous Participations / Nominations
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            You haven't added any participations / nominations for this event yet.
          </p>
        </div>
      )}

      {/* Existing Nominations List with Custom Scrollbar */}
      {!loading && !error && (existingVolunteers.length > 0 || familyFriends.length > 0) && (
        <div className="space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {/* Alkemite nominations */}
          {existingVolunteers.map((volunteer) => (
            <motion.div
              key={volunteer.volunteerId}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Employee Name and Status */}
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <User className="w-4 h-4" style={{ color: 'var(--brand-secondary)' }} />
                      {volunteer.employeeName}
                    </h4>
                    <div>
                      {getStatusBadge(volunteer.status)}
                    </div>
                  </div>

                  {/* Employee Details */}
                  <div className="space-y-1 mb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Mail className="w-4 h-4" />
                      <span>{volunteer.employeeEmailId}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Briefcase className="w-4 h-4" />
                      <span>{volunteer.employeeDesig}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4" />
                      <span>{volunteer.eventLocationName}</span>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>Added: {formatDate(volunteer.addedOn)}</span>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Employee ID: {volunteer.employeeId}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          {/* Family/Friends nominations */}
          {familyFriends.map((ff, idx) => (
            <motion.div
              key={ff.relationContact + "-" + idx}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Relation Name and Status */}
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <Heart className="w-4 h-4" style={{ color: 'var(--brand-secondary)' }} />
                      {ff.relationName}
                      <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                        ({RELATION_LABELS[ff.relationId] || "Relation"})
                      </span>
                    </h4>
                    <div>
                      {ff.status && getStatusBadge(ff.status)}
                    </div>
                  </div>
                  {/* Relation Details */}
                  <div className="space-y-1 mb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4" />
                      <span>{ff.eventLocationName || "Location"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <User className="w-4 h-4" />
                      <span>Contact: {ff.relationContact}</span>
                    </div>
                  </div>
                  {/* Metadata */}
                  {ff.addedOn && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>Added: {formatDate(ff.addedOn)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

     
    </motion.div>
  );
};

export default VolunteerFormExistingNominations;