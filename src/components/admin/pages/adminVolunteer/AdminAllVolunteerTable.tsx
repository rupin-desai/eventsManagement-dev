import React from 'react';
import type { Volunteer } from '../../../../api/admin/volunteerAdminApi';
import type { RelationVolunteer } from './AdminRelationVolunteerTable';
import ExcelDownload from '../../../ui/ExcelDownload'; // Add this import

interface AdminAllVolunteerTableProps {
  alkemites: Volunteer[];
  relations: RelationVolunteer[];
  loading: boolean;
  getStatusBadge: (status: string) => React.ReactNode;
}

const AdminAllVolunteerTable: React.FC<AdminAllVolunteerTableProps> = ({
  alkemites,
  relations,
  loading,
  getStatusBadge,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="flex items-center justify-center p-8">
          <span className="ml-2 text-gray-600">Loading volunteers...</span>
        </div>
      </div>
    );
  }

  if ((!alkemites || alkemites.length === 0) && (!relations || relations.length === 0)) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="text-center p-8 text-gray-500">
          No volunteers found for this event.
        </div>
      </div>
    );
  }

  // Prepare data for export
  const getExportData = async () => [
    ...alkemites.map((v) => ({
      type: 'Alkemite',
      name: v.employeeName,
      contact: v.employeeEmailId,
      location: v.eventLocationName,
      addedBy: v.employeeName,
      status: v.status,
      addedOn: v.addedOn,
    })),
    ...relations.map((r) => ({
      type: 'Friend/Family',
      name: r.relationName,
      contact: r.relationContact,
      location: r.eventLocationName,
      addedBy: `${r.addedName} (${r.addedDesig})`,
      status: r.status,
      addedOn: r.addedOn,
    })),
  ];

  return (
    <div className="bg-white rounded-lg shadow w-full" style={{ maxWidth: '100vw', maxHeight: '100vh' }}>
      {/* Export Button */}
      <div className="flex justify-end p-2">
        <ExcelDownload
          fileName="AllVolunteers.xlsx"
          buttonText="Export All Volunteers"
          columns={[
            { label: 'Type', key: 'type' },
            { label: 'Name', key: 'name' },
            { label: 'Contact/Email', key: 'contact' },
            { label: 'Location', key: 'location' },
            { label: 'Added By', key: 'addedBy' },
            { label: 'Status', key: 'status' },
            { label: 'Added On', key: 'addedOn' },
          ]}
          getData={getExportData}
          disabled={loading || (!alkemites.length && !relations.length)}
        />
      </div>
      {/* Mobile: horizontally scrollable table with sticky header */}
      <div className="block md:hidden relative" style={{ maxHeight: '100vh' }}>
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            <table className="w-full rounded-t-lg overflow-hidden table-fixed">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">Contact/Email</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">Added By</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">Added On</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Alkemites */}
                {alkemites.map(v => (
                  <tr key={`alkemite-${v.volunteerId}`} className="hover:bg-[var(--brand-primary-light)] transition-colors">
                    <td className="p-2">Alkemite</td>
                    <td className="p-2">{v.employeeName}</td>
                    <td className="p-2 text-sm break-all whitespace-normal">
                      {/* For Alkemites */}
                      {v.employeeEmailId}
                    </td>
                    <td className="p-2">{v.eventLocationName}</td>
                    <td className="p-2">{v.employeeName || <span className="text-gray-400">—</span>}</td>
                    <td className="p-2">{getStatusBadge(v.status)}</td>
                    <td className="p-2">{new Date(v.addedOn).toLocaleString()}</td>
                  </tr>
                ))}
                {/* Friends & Family */}
                {relations.map(r => (
                  <tr key={`relation-${r.volRelationId}`} className="hover:bg-[var(--brand-primary-light)] transition-colors">
                    <td className="p-2">Friend/Family</td>
                    <td className="p-2">{r.relationName}</td>
                    <td className="p-2 text-sm break-all whitespace-normal">
                      {/* For Friends & Family */}
                      {r.relationContact ?? <span className="text-gray-400">—</span>}
                    </td>
                    <td className="p-2">{r.eventLocationName}</td>
                    <td className="p-2">{r.addedName} <span className="text-xs text-gray-500">({r.addedDesig})</span></td>
                    <td className="p-2">{r.status === "N" ? "Nominated" : r.status}</td>
                    <td className="p-2">{new Date(r.addedOn).toLocaleString()}</td>
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
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">Type</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">Name</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">Contact/Email</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">Location</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">Added By</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">Status</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">Added On</th>
            </tr>
          </thead>
        </table>
        <div className="overflow-y-auto custom-scrollbar rounded-b-lg" style={{ maxHeight: 'calc(100vh - 48px)' }}>
          <table className="w-full table-fixed min-w-full">
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Alkemites */}
              {alkemites.map(v => (
                <tr key={`alkemite-${v.volunteerId}`} className="hover:bg-[var(--brand-primary-light)] transition-colors">
                  <td className="px-6 py-4">Alkemite</td>
                  <td className="px-6 py-4">{v.employeeName}</td>
                  <td className="px-6 py-4 text-sm break-all whitespace-normal">
                    {/* For Alkemites */}
                    {v.employeeEmailId}
                  </td>
                  <td className="px-6 py-4">{v.eventLocationName}</td>
                  <td className="px-6 py-4">{v.employeeName || <span className="text-gray-400">—</span>}</td>
                  <td className="px-6 py-4">{getStatusBadge(v.status)}</td>
                  <td className="px-6 py-4">{new Date(v.addedOn).toLocaleString()}</td>
                </tr>
              ))}
              {/* Friends & Family */}
              {relations.map(r => (
                <tr key={`relation-${r.volRelationId}`} className="hover:bg-[var(--brand-primary-light)] transition-colors">
                  <td className="px-6 py-4">Friend/Family</td>
                  <td className="px-6 py-4">{r.relationName}</td>
                  <td className="px-6 py-4 text-sm break-all whitespace-normal">
                    {/* For Friends & Family */}
                    {r.relationContact ?? <span className="text-gray-400">—</span>}
                  </td>
                  <td className="px-6 py-4">{r.eventLocationName}</td>
                  <td className="px-6 py-4">{r.addedName} <span className="text-xs text-gray-500">({r.addedDesig})</span></td>
                  <td className="px-6 py-4">{r.status === "N" ? "Nominated" : r.status}</td>
                  <td className="px-6 py-4">{new Date(r.addedOn).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminAllVolunteerTable;