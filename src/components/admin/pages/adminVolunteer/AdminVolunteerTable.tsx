import React, { useEffect, useState } from 'react';
import { User, Clock, Loader2, Mail, MapPin, Briefcase } from 'lucide-react';
import type { Volunteer } from '../../../../api/admin/volunteerAdminApi';
import { getFeedbackDetails, type FeedbackDetails } from '../../../../api/feedbackApi';

// Helper to fetch feedback and calculate average rating using the API
const fetchVolunteerRatings = async (volunteerIds: number[]): Promise<Record<number, number | null>> => {
  const ratings: Record<number, number | null> = {};
  await Promise.all(
    volunteerIds.map(async (id) => {
      try {
        // Pass type = "F" for admin volunteer feedback
        const res = await getFeedbackDetails(id, "F");
        const data: FeedbackDetails[] = res.data;
        if (Array.isArray(data) && data.length > 0) {
          // Average rating for this volunteer
          const avg =
            data.reduce((sum: number, f: { rating: number }) => sum + (f.rating || 0), 0) /
            data.length;
          ratings[id] = Math.round(avg * 10) / 10;
        } else {
          ratings[id] = null;
        }
      } catch {
        ratings[id] = null;
      }
    })
  );
  return ratings;
};

// Emoji rating display (matches AchievementsEvents)
const getEmojiForRating = (rating: number) => {
  switch (rating) {
    case 1: return '😞';
    case 2: return '🙁';
    case 3: return '😐';
    case 4: return '🙂';
    case 5: return '😊';
    default: return '—';
  }
};

const getEmojiColor = (rating: number) => {
  switch (rating) {
    case 1: return 'text-red-400';
    case 2: return 'text-orange-400';
    case 3: return 'text-yellow-400';
    case 4: return 'text-green-400';
    case 5: return 'text-green-500';
    default: return 'text-gray-400';
  }
};

interface AdminVolunteerTableProps {
  volunteers: Volunteer[];
  loading: boolean;
  searchTerm: string;
  selectedVolunteers: number[];
  statusOptions: Array<{ value: string; label: string; color: string }>;
  onVolunteerSelect: (volunteerId: number) => void;
  onSelectAll: () => void;
  onStatusUpdate: (volunteer: Volunteer, newStatus: string) => void;
  getStatusBadge: (status: string) => React.ReactNode;
  isEventComplete?: boolean;
}

const AdminVolunteerTable: React.FC<AdminVolunteerTableProps> = ({
  volunteers,
  loading,
  searchTerm,
  selectedVolunteers,
  onVolunteerSelect,
  onSelectAll,
  getStatusBadge,
  isEventComplete = false,
}) => {
  const [ratings, setRatings] = useState<Record<number, number | null>>({});

  useEffect(() => {
    if (volunteers && volunteers.length > 0) {
      const ids = volunteers.map((v) => v.volunteerId);
      fetchVolunteerRatings(ids).then(setRatings);
    }
  }, [volunteers]);

  // Emoji rating with number below
  const getEmojiRating = (volunteerId: number) => {
    const rating = ratings[volunteerId];
    if (rating == null) {
      return (
        <div className="flex flex-col items-center">
          <span className="text-2xl text-gray-300">—</span>
          <span className="text-xs text-gray-400 mt-1">No rating</span>
        </div>
      );
    }
    const rounded = Math.round(rating);
    return (
      <div className="flex flex-col items-center">
        <span className={`text-2xl ${getEmojiColor(rounded)}`}>{getEmojiForRating(rounded)}</span>
        <span className="text-xs text-gray-700 mt-1">{rating}/5</span>
      </div>
    );
  };


  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="flex items-center justify-center p-8">
          <Loader2 className="w-8 h-8 animate-spin text-red-600" />
          <span className="ml-2 text-gray-600">Loading volunteers...</span>
        </div>
      </div>
    );
  }

  if (!Array.isArray(volunteers)) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="text-center p-8 text-red-500">
          Error: Invalid volunteers data format. Expected array, got {typeof volunteers}
        </div>
      </div>
    );
  }

  if (volunteers.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="text-center p-8 text-gray-500">
          {searchTerm ? 'No volunteers found matching your search.' : 'No volunteers found for this event.'}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow w-full" style={{ maxWidth: '100vw', maxHeight: '100vh' }}>
      {/* Mobile: horizontally scrollable table with sticky header */}
      <div className="block md:hidden relative" style={{ maxHeight: '100vh' }}>
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            <table className="w-full rounded-t-lg overflow-hidden table-fixed">
              <colgroup>
                <col className="w-[6%]" />    {/* Checkbox */}
                <col className="w-[12%]" />   {/* Volunteer ID */}
                <col className="w-[22%]" />   {/* Employee Details */}
                <col className="w-[18%]" />   {/* Location */}
                <col className="w-[14%]" />   {/* Status */}
                <col className="w-[14%]" />   {/* Rating */}
                <col className="w-[14%]" />   {/* Added Date */}
                
              </colgroup>
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left sticky top-0 z-10 bg-[var(--brand-secondary)]">
                    <input
                      type="checkbox"
                      checked={selectedVolunteers.length === volunteers.length}
                      onChange={onSelectAll}
                      className="rounded cursor-pointer border-gray-300 accent-red-600"
                      disabled={!isEventComplete}
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">
                    Volunteer ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">
                    Employee Details
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">
                    Location
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">
                    Rating
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">
                    Added Date
                  </th>
                  {/* Removed Actions column */}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {volunteers.map((volunteer) => (
                  <tr key={volunteer.volunteerId} className="hover:bg-[var(--brand-primary-light)] transition-colors">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedVolunteers.includes(volunteer.volunteerId)}
                        onChange={() => onVolunteerSelect(volunteer.volunteerId)}
                        className="rounded cursor-pointer border-gray-300 accent-red-600"
                      />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            #{volunteer.volunteerId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-900">
                          {volunteer.employeeName || 'Unknown'}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <span>ID: {volunteer.employeeId}</span>
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {volunteer.employeeEmailId || 'No email'}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Briefcase className="w-3 h-3" />
                          {volunteer.employeeDesig || 'No designation'}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="font-medium">{volunteer.eventLocationName}</div>
                          <div className="text-xs text-gray-500">ID: {volunteer.eventLocationId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {getStatusBadge(volunteer.status)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {getEmojiRating(volunteer.volunteerId)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <div>
                          <div>{new Date(volunteer.addedOn).toLocaleDateString()}</div>
                          <div className="text-xs">{new Date(volunteer.addedOn).toLocaleTimeString()}</div>
                        </div>
                      </div>
                    </td>
            
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Desktop: sticky header, vertical scroll only for tbody */}
      <div className="hidden md:block relative" style={{ maxHeight: '100vh' }}>
        <table className="w-full rounded-t-lg overflow-hidden table-fixed min-w-full">
          <colgroup>
            <col className="w-[6%]" />    {/* Checkbox */}
            <col className="w-[12%]" />   {/* Volunteer ID */}
            <col className="w-[22%]" />   {/* Employee Details */}
            <col className="w-[18%]" />   {/* Location */}
            <col className="w-[14%]" />   {/* Status */}
            <col className="w-[14%]" />   {/* Rating */}
            <col className="w-[14%]" />   {/* Added Date */}
          </colgroup>
          <thead>
            <tr>
              <th className="px-6 py-3 text-left sticky top-0 z-10 bg-[var(--brand-secondary)]">
                <input
                  type="checkbox"
                  checked={selectedVolunteers.length === volunteers.length}
                  onChange={onSelectAll}
                  className="rounded cursor-pointer border-gray-300 accent-red-600"
                  disabled={!isEventComplete}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">
                Volunteer ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">
                Employee Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">
                Rating
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">
                Added Date
              </th>
              {/* Removed Actions column */}
            </tr>
          </thead>
        </table>
        <div className="overflow-y-auto custom-scrollbar rounded-b-lg" style={{ maxHeight: 'calc(100vh - 48px)' }}>
          <table className="w-full table-fixed min-w-full">
            <colgroup>
              <col className="w-[6%]" />    {/* Checkbox */}
              <col className="w-[12%]" />   {/* Volunteer ID */}
              <col className="w-[22%]" />   {/* Employee Details */}
              <col className="w-[18%]" />   {/* Location */}
              <col className="w-[14%]" />   {/* Status */}
              <col className="w-[14%]" />   {/* Rating */}
              <col className="w-[14%]" />   {/* Added Date */}
            </colgroup>
            <tbody className="bg-white divide-y divide-gray-200">
              {volunteers.map((volunteer) => (
                <tr key={volunteer.volunteerId} className="hover:bg-[var(--brand-primary-light)] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedVolunteers.includes(volunteer.volunteerId)}
                      onChange={() => onVolunteerSelect(volunteer.volunteerId)}
                      className="rounded cursor-pointer border-gray-300 accent-red-600"
                      disabled={!isEventComplete}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="w-4 h-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          #{volunteer.volunteerId}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900">
                        {volunteer.employeeName || 'Unknown'}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <span>ID: {volunteer.employeeId}</span>
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {volunteer.employeeEmailId || 'No email'}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Briefcase className="w-3 h-3" />
                        {volunteer.employeeDesig || 'No designation'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="font-medium">{volunteer.eventLocationName}</div>
                        <div className="text-xs text-gray-500">ID: {volunteer.eventLocationId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(volunteer.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getEmojiRating(volunteer.volunteerId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <div>
                        <div>{new Date(volunteer.addedOn).toLocaleDateString()}</div>
                        <div className="text-xs">{new Date(volunteer.addedOn).toLocaleTimeString()}</div>
                      </div>
                    </div>
                  </td>
                  {/* Removed Actions column */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminVolunteerTable;