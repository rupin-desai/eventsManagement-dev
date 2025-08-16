import React from 'react';
import { Calendar, Users } from 'lucide-react';
import type { Event } from '../../../../api/eventApi';

interface AdminVolunteerSelectedEventInfoProps {
  selectedEvent: Event;
  volunteersCount: number;
  onChangeEvent: () => void;
}

const AdminVolunteerSelectedEventInfo: React.FC<AdminVolunteerSelectedEventInfoProps> = ({
  selectedEvent,
  volunteersCount,
  onChangeEvent
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{selectedEvent.name}</h3>
          <p className="text-sm text-gray-600">{selectedEvent.subName}</p>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {selectedEvent.tentativeMonth} {selectedEvent.tentativeYear}
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {volunteersCount} volunteers
            </div>
          </div>
        </div>
        <button
          onClick={onChangeEvent}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Change Event
        </button>
      </div>
    </div>
  );
};

export default AdminVolunteerSelectedEventInfo;