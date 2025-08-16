import React from 'react';
import { Loader2, Clock, Eye, Trash2 } from 'lucide-react';
import type { Event } from '../../../../api/eventApi';

interface AdminEventsTableProps {
  events: Event[];
  loading: boolean;
  searchTerm: string;
  selectedYear: string;
  onViewDetails: (event: Event) => void;
  onDelete: (event: Event) => void;
}

const AdminEventsTable: React.FC<AdminEventsTableProps> = ({
  events,
  loading,
  searchTerm,
  selectedYear,
  onViewDetails,
  onDelete,
}) => {
  // Function to strip HTML tags and truncate text
  const stripHtmlAndTruncate = (html: string, maxLength: number = 80): string => {
    if (!html) return '';
    const textOnly = html.replace(/<[^>]*>/g, '');
    const decoded = textOnly
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&hellip;/g, '...');
    const trimmed = decoded.trim();
    if (trimmed.length <= maxLength) return trimmed;
    const truncated = trimmed.substring(0, maxLength);
    const lastSpaceIndex = truncated.lastIndexOf(' ');
    if (lastSpaceIndex > maxLength * 0.8) {
      return truncated.substring(0, lastSpaceIndex) + '...';
    }
    return truncated + '...';
  };

  // Status badge
  const getStatusBadge = (status: string | undefined, label: string) => {
    const isEnabled = status === "A" || status === "true";
    return (
      <span
        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full select-none ${
          isEnabled
            ? "bg-green-100 text-green-800 border border-green-200"
            : "bg-red-100 text-red-800 border border-red-200"
        }`}
      >
        {label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="flex items-center justify-center p-8">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--brand-secondary)]" />
          <span className="ml-2 text-gray-600">Loading events...</span>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="text-center p-8 text-gray-500">
          {searchTerm
            ? "No events found matching your search."
            : `No events available for ${selectedYear}.`}
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-lg shadow w-full"
      style={{
        maxWidth: '100vw',
        maxHeight: '100vh',
      }}
    >
      <div className="w-full" style={{ maxWidth: '100vw' }}>
        {/* Mobile: horizontally scrollable table with sticky header inside scroll */}
        <div className="block md:hidden relative" style={{ maxHeight: '100vh' }}>
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              <table className="w-full rounded-t-lg overflow-hidden table-fixed">
                <colgroup>
                  <col className="w-[24%]" />
                  <col className="w-[16%]" />
                  <col className="w-[14%]" />
                  <col className="w-[22%]" />
                  <col className="w-[24%]" />
                </colgroup>
                <thead>
                  <tr>
                    <th className="px-4 py-3 align-middle text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">
                      Event
                    </th>
                    <th className="px-4 py-3 align-middle text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">
                      Schedule
                    </th>
                    <th className="px-4 py-3 align-middle text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">
                      Type
                    </th>
                    <th className="px-4 py-3 align-middle text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">
                      Status
                    </th>
                    <th className="px-4 py-3 align-middle text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {events.map((event) => (
                    <tr key={event.eventId} className="hover:bg-[var(--brand-primary-light)] transition-colors">
                      <td className="px-4 py-4 align-middle">
                        <div>
                          <div className="text-sm font-semibold text-[var(--brand-secondary-dark)]">
                            {event.name}
                          </div>
                          {event.subName && (
                            <div className="text-xs text-gray-500">
                              {event.subName}
                            </div>
                          )}
                          <div
                            className="text-xs text-gray-400 mt-1 max-w-xs"
                            title={stripHtmlAndTruncate(event.description, 200)}
                          >
                            {stripHtmlAndTruncate(event.description) || (
                              <em className="text-gray-300">No description</em>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 align-middle whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-1" />
                          {event.tentativeMonth} {event.tentativeYear}
                        </div>
                      </td>
                      <td className="px-4 py-4 align-middle whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full select-none`}
                          style={{
                            background:
                              event.type === 'Year-Round'
                                ? 'var(--brand-primary-dark)'
                                : 'var(--brand-secondary-light)',
                            color: '#fff',
                          }}
                          tabIndex={0}
                        >
                          {event.type}
                        </span>
                      </td>
                      <td className="px-4 py-4 align-middle">
                        <div className="flex flex-wrap gap-1">
                          {getStatusBadge(event.enableCert, "Certificate")}
                          {getStatusBadge(event.enableComp, "Complete")}
                          {getStatusBadge(event.enableConf, "Confirmation")}
                        </div>
                      </td>
                      <td className="px-4 py-4 align-middle whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => onViewDetails(event)}
                            className="flex items-center gap-1 px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer active:scale-95"
                            style={{ transition: 'transform 0.1s' }}
                            type="button"
                            title="View & Edit Details"
                          >
                            <Eye className="w-4 h-4" />
                            Details
                          </button>
                          <button
                            onClick={() => onDelete(event)}
                            className="flex items-center gap-1 px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer active:scale-95"
                            style={{ transition: 'transform 0.1s' }}
                            type="button"
                            title="Delete Event"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
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
              <col className="w-[24%]" />
              <col className="w-[16%]" />
              <col className="w-[14%]" />
              <col className="w-[22%]" />
              <col className="w-[24%]" />
            </colgroup>
            <thead>
              <tr>
                <th className="px-6 py-3 align-middle text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">
                  Event
                </th>
                <th className="px-6 py-3 align-middle text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">
                  Schedule
                </th>
                <th className="px-6 py-3 align-middle text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">
                  Type
                </th>
                <th className="px-6 py-3 align-middle text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">
                  Status
                </th>
                <th className="px-6 py-3 align-middle text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">
                  Actions
                </th>
              </tr>
            </thead>
          </table>
          <div className="overflow-y-auto custom-scrollbar rounded-b-lg" style={{ maxHeight: 'calc(100vh - 48px)' }}>
            <table className="w-full table-fixed min-w-full">
              <colgroup>
                <col className="w-[24%]" />
                <col className="w-[16%]" />
                <col className="w-[14%]" />
                <col className="w-[22%]" />
                <col className="w-[24%]" />
              </colgroup>
              <tbody className="bg-white divide-y divide-gray-200">
                {events.map((event) => (
                  <tr key={event.eventId} className="hover:bg-[var(--brand-primary-light)] transition-colors">
                    <td className="px-6 py-4 align-middle">
                      <div>
                        <div className="text-sm font-semibold text-[var(--brand-secondary-dark)]">
                          {event.name}
                        </div>
                        {event.subName && (
                          <div className="text-xs text-gray-500">
                            {event.subName}
                          </div>
                        )}
                        <div
                          className="text-xs text-gray-400 mt-1 max-w-xs"
                          title={stripHtmlAndTruncate(event.description, 200)}
                        >
                          {stripHtmlAndTruncate(event.description) || (
                            <em className="text-gray-300">No description</em>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-middle whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-1" />
                        {event.tentativeMonth} {event.tentativeYear}
                      </div>
                    </td>
                    <td className="px-6 py-4 align-middle whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full select-none`}
                        style={{
                          background:
                            event.type === 'Year-Round'
                              ? 'var(--brand-primary-dark)'
                              : 'var(--brand-secondary-light)',
                          color: '#fff',
                        }}
                        tabIndex={0}
                      >
                        {event.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <div className="flex flex-wrap gap-1">
                        {getStatusBadge(event.enableCert, "Certificate")}
                        {getStatusBadge(event.enableComp, "Complete")}
                        {getStatusBadge(event.enableConf, "Confirmation")}
                      </div>
                    </td>
                    <td className="px-6 py-4 align-middle whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => onViewDetails(event)}
                          className="flex items-center gap-1 px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer active:scale-95"
                          style={{ transition: 'transform 0.1s' }}
                          type="button"
                          title="View & Edit Details"
                        >
                          <Eye className="w-4 h-4" />
                          Details
                        </button>
                        <button
                          onClick={() => onDelete(event)}
                          className="flex items-center gap-1 px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer active:scale-95"
                          style={{ transition: 'transform 0.1s' }}
                          type="button"
                          title="Delete Event"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEventsTable;