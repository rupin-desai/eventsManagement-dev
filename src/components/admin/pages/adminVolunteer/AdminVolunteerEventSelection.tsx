import React, { useEffect, useState } from 'react';
import type { JSX } from 'react';
import { Calendar, Loader2 } from 'lucide-react';
import type { Event as OriginalEvent } from '../../../../api/eventApi';
import type { Volunteer } from '../../../../api/volunteerApi';
import { STATUS_OPTIONS } from "../../../../pages/admin/AdminVolunteerPage";
import { getVolunteersByEventId } from '../../../../api/volunteerApi'; // Make sure this is exported

interface EventWithStatusCounts extends OriginalEvent {
  statusCounts?: Record<string, number>;
}

interface AdminVolunteerEventSelectionProps {
  events: OriginalEvent[];
  loading: boolean;
  selectedYear: string;
  onEventSelect: (event: EventWithStatusCounts) => void;
  getStatusBadge: (status: string) => JSX.Element;
}

const AdminVolunteerEventSelection: React.FC<AdminVolunteerEventSelectionProps> = ({
  events,
  loading,
  selectedYear,
  onEventSelect,
  getStatusBadge
}) => {
  // Store status counts for each eventId
  const [eventStatusCounts, setEventStatusCounts] = useState<Record<number, Record<string, number>>>({}); // { [eventId]: { status: count } }
  const [loadingStats, setLoadingStats] = useState<Record<number, boolean>>({});

  useEffect(() => {
    // Fetch volunteers for all events when events change
    const fetchAllStats = async () => {
      const stats: Record<number, Record<string, number>> = {};
      const loadingMap: Record<number, boolean> = {};
      await Promise.all(events.map(async (event) => {
        loadingMap[event.eventId] = true;
        try {
          const res = await getVolunteersByEventId(event.eventId);
          const volunteers: Volunteer[] = res.data;
          const counts: Record<string, number> = {};
          volunteers.forEach(v => {
            counts[v.status] = (counts[v.status] || 0) + 1;
          });
          stats[event.eventId] = counts;
        } catch {
          stats[event.eventId] = {};
        } finally {
          loadingMap[event.eventId] = false;
        }
      }));
      setEventStatusCounts(stats);
      setLoadingStats(loadingMap);
    };

    if (events.length > 0) {
      fetchAllStats();
    }
  }, [events]);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Event to Manage Volunteers</h3>
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-red-600" />
          <span className="ml-2 text-gray-600">Loading events...</span>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No events available for {selectedYear}.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => {
            const statusCounts = eventStatusCounts[event.eventId] || {};
            const isStatsLoading = loadingStats[event.eventId];

            return (
              <div
                key={event.eventId}
                onClick={() => onEventSelect({ ...event, statusCounts })}
                className="p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-red-500 hover:bg-red-50 transition-colors"
              >
                <div className="font-medium text-gray-900">{event.name}</div>
                <div className="text-sm text-gray-500">{event.subName}</div>
                <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {event.tentativeMonth} {event.tentativeYear}
                </div>
                {/* Status summary */}
                <div className="flex flex-wrap gap-2 mt-2 min-h-[28px]">
                  {isStatsLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-yellow-600" />
                  ) : (
                    STATUS_OPTIONS.map(option => (
                      <span
                        key={option.value}
                        className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${option.color}`}
                      >
                        {option.label}: {statusCounts[option.value] || 0}
                      </span>
                    ))
                  )}
                </div>
                <div className="mt-2">
                  {getStatusBadge(event.status)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminVolunteerEventSelection;