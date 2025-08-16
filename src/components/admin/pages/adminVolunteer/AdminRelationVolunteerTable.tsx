import React from 'react';
import ExcelDownload from '../../../ui/ExcelDownload'; // Add this import

export interface RelationVolunteer {
  volRelationId: number;
  eventId: number;
  eventLocationId: number;
  eventLocationName: string;
  relationId: number;
  relationName: string;
  relationContact: number | null;
  status: string;
  addedOn: string;
  addedBy: number;
  addedName: string;
  addedDesig: string;
}

interface AdminRelationVolunteerTableProps {
  volunteers: RelationVolunteer[];
  loading: boolean;
}

const AdminRelationVolunteerTable: React.FC<AdminRelationVolunteerTableProps> = ({
  volunteers,
  loading,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="flex items-center justify-center p-8">
          <span className="ml-2 text-gray-600">Loading friends & family...</span>
        </div>
      </div>
    );
  }

  if (!Array.isArray(volunteers) || volunteers.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="text-center p-8 text-gray-500">
          No friends & family nominations found.
        </div>
      </div>
    );
  }

  // Prepare data for export
  const getExportData = async () =>
    volunteers.map((v) => ({
      volRelationId: v.volRelationId,
      eventId: v.eventId,
      eventLocationId: v.eventLocationId,
      eventLocationName: v.eventLocationName,
      relationId: v.relationId,
      relationName: v.relationName,
      relationContact: v.relationContact,
      status: v.status,
      addedOn: v.addedOn,
      addedBy: v.addedBy,
      addedName: v.addedName,
      addedDesig: v.addedDesig,
    }));

  return (
    <div className="bg-white rounded-lg shadow w-full" style={{ maxWidth: '100vw', maxHeight: '100vh' }}>
      {/* Export Button */}
      <div className="flex justify-end p-2">
        <ExcelDownload
          fileName="FriendsAndFamilyNominations.xlsx"
          buttonText="Export Friends & Family"
          columns={[
            { label: "Relation Name", key: "relationName" },
            { label: "Contact", key: "relationContact" },
            { label: "Location", key: "eventLocationName" },
            { label: "Added By", key: "addedName" },
            { label: "Designation", key: "addedDesig" },
            { label: "Status", key: "status" },
            { label: "Added On", key: "addedOn" },
          ]}
          getData={getExportData}
          disabled={loading || !volunteers.length}
        />
      </div>
      {/* Mobile: horizontally scrollable table with sticky header */}
      <div className="block md:hidden relative" style={{ maxHeight: '100vh' }}>
        <div className="overflow-x-auto">
          <div className="min-w-[700px]">
            <table className="w-full rounded-t-lg overflow-hidden table-fixed">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">Added By</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">Added On</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {volunteers.map(r => (
                  <tr key={r.volRelationId} className="hover:bg-[var(--brand-primary-light)] transition-colors">
                    <td className="p-2 text-sm font-medium">{r.relationName}</td>
                    <td className="p-2 text-sm break-all whitespace-normal">{r.relationContact ?? <span className="text-gray-400">—</span>}</td>
                    <td className="p-2 text-sm">{r.eventLocationName}</td>
                    <td className="p-2 text-sm">
                      {r.addedName} <span className="text-xs text-gray-500">({r.addedDesig})</span>
                    </td>
                    <td className="p-2 text-sm">{r.status === "N" ? "Nominated" : r.status}</td>
                    <td className="p-2 text-sm">{new Date(r.addedOn).toLocaleString()}</td>
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
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">Name</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">Contact</th>
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
              {volunteers.map(r => (
                <tr key={r.volRelationId} className="hover:bg-[var(--brand-primary-light)] transition-colors">
                  <td className="px-6 py-4">{r.relationName}</td>
                  <td className="px-6 py-4">{r.relationContact ?? <span className="text-gray-400">—</span>}</td>
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

export default AdminRelationVolunteerTable;