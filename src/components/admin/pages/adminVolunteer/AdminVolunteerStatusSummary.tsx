import React from 'react';
import type { Volunteer } from '../../../../api/admin/volunteerAdminApi';

interface AdminVolunteerStatusSummaryProps {
  volunteers: Volunteer[];
  statusOptions: Array<{ value: string; label: string; color: string }>;

}

const AdminVolunteerStatusSummary: React.FC<AdminVolunteerStatusSummaryProps> = ({ 
  volunteers, 
  statusOptions 
}) => {
  const getStatusCounts = () => {
    const counts = volunteers.reduce((acc, volunteer) => {
      acc[volunteer.status] = (acc[volunteer.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return counts;
  };

  const statusCounts = getStatusCounts();

  if (volunteers.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h4 className="font-semibold text-gray-900 mb-4">Volunteer Status Summary</h4>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {statusOptions.map((status) => (
          <div key={status.value} className="text-center ">
            <div className={`text-2xl font-bold rounded-lg  ${status.color}`}>
              {statusCounts[status.value] || 0}
              <div className={`text-sm rounded-lg ${status.color}`}>{status.label}</div>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminVolunteerStatusSummary;