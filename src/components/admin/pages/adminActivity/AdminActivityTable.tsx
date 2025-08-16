import React from 'react';
import { Loader2, Edit2 } from 'lucide-react';
import type { Activity } from '../../../../api/activityApi';

interface AdminActivityTableProps {
  activities: Activity[];
  loading: boolean;
  searchTerm: string;
  onEditActivity: (activity: Activity) => void;
}

const AdminActivityTable: React.FC<AdminActivityTableProps> = ({
  activities,
  loading,
  searchTerm,
  onEditActivity,
}) => {
  // ✅ Function to strip HTML tags and truncate text
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

  return (
    <div
      className="bg-white rounded-lg shadow w-full"
      style={{
        maxWidth: '100vw',
        maxHeight: '100vh',
      }}
    >
      <div className="w-full" style={{ maxWidth: '100vw' }}>
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--brand-secondary)]" />
            <span className="ml-2 text-gray-600">Loading activities...</span>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center p-8 text-gray-500">
            {searchTerm
              ? 'No activities found matching your search.'
              : 'No activities available.'}
          </div>
        ) : (
          <>
            {/* Mobile: horizontally scrollable table with sticky header inside scroll */}
            <div className="block md:hidden relative" style={{ maxHeight: '100vh' }}>
              <div className="overflow-x-auto">
                <div className="min-w-[700px]">
                  <table className="w-full rounded-t-lg overflow-hidden table-fixed">
                    <colgroup>
                      <col className="w-[22%]" />
                      <col className="w-[14%]" />
                      <col className="w-[14%]" />
                      <col className="w-[34%]" />
                      <col className="w-[16%]" />
                    </colgroup>
                    <thead>
                      <tr>
                        <th className="px-4 py-3 align-middle text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">
                          Activity
                        </th>
                        <th className="px-4 py-3 align-middle text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">
                          Type
                        </th>
                        <th className="px-4 py-3 align-middle text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">
                          Status
                        </th>
                        <th className="px-4 py-3 align-middle text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">
                          Description
                        </th>
                        <th className="px-4 py-3 align-middle text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {activities.map((activity) => (
                        <tr key={activity.activityId} className="hover:bg-[var(--brand-primary-light)] transition-colors">
                          <td className="px-4 py-4 align-middle">
                            <div>
                              <div className="text-sm font-semibold text-[var(--brand-secondary-dark)]">
                                {activity.name}
                              </div>
                              {activity.subName && (
                                <div className="text-xs text-gray-500">
                                  {activity.subName}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4 align-middle whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full cursor-pointer select-none transition-transform`}
                              style={{
                                background:
                                  activity.type === 'Year-Round'
                                    ? 'var(--brand-primary-dark)'
                                    : 'var(--brand-secondary-light)',
                                color: '#fff',
                              }}
                              tabIndex={0}
                            >
                              {activity.type}
                            </span>
                          </td>
                          <td className="px-4 py-4 align-middle whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full cursor-pointer select-none transition-transform`}
                              style={
                                activity.status === 'A'
                                  ? {
                                      background: '#22c55e', // Tailwind green-500
                                      color: '#fff',
                                    }
                                  : activity.status === 'D'
                                  ? {
                                      background: '#f87171', // Tailwind red-400
                                      color: '#fff',
                                    }
                                  : {
                                      background: 'var(--brand-secondary-light)',
                                      color: '#fff',
                                    }
                              }
                              tabIndex={0}
                            >
                              {activity.status === 'A'
                                ? 'Active'
                                : activity.status === 'D'
                                ? 'Deactivated'
                                : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-4 py-4 align-middle">
                            <div
                              className="text-sm text-gray-900 max-w-xs"
                              title={stripHtmlAndTruncate(activity.description, 200)}
                            >
                              {stripHtmlAndTruncate(activity.description) || (
                                <em className="text-gray-300">No description</em>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4 align-middle whitespace-nowrap text-sm font-medium">
                            <div className="flex gap-2">
                              <button
                                onClick={() => onEditActivity(activity)}
                                className="flex items-center gap-1 px-3 py-1 rounded bg-[var(--brand-secondary)] text-white hover:bg-[var(--brand-secondary-dark)] transition-colors cursor-pointer active:scale-95"
                                style={{ transition: 'transform 0.1s' }}
                                type="button"
                              >
                                <Edit2 className="w-4 h-4" />
                                Edit
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
                  <col className="w-[22%]" />
                  <col className="w-[14%]" />
                  <col className="w-[14%]" />
                  <col className="w-[34%]" />
                  <col className="w-[16%]" />
                </colgroup>
                <thead>
                  <tr>
                    <th className="px-6 py-3 align-middle text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">
                      Activity
                    </th>
                    <th className="px-6 py-3 align-middle text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">
                      Type
                    </th>
                    <th className="px-6 py-3 align-middle text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">
                      Status
                    </th>
                    <th className="px-6 py-3 align-middle text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">
                      Description
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
                    <col className="w-[22%]" />
                    <col className="w-[14%]" />
                    <col className="w-[14%]" />
                    <col className="w-[34%]" />
                    <col className="w-[16%]" />
                  </colgroup>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {activities.map((activity) => (
                      <tr key={activity.activityId} className="hover:bg-[var(--brand-primary-light)] transition-colors">
                        <td className="px-6 py-4 align-middle">
                          <div>
                            <div className="text-sm font-semibold text-[var(--brand-secondary-dark)]">
                              {activity.name}
                            </div>
                            {activity.subName && (
                              <div className="text-xs text-gray-500">
                                {activity.subName}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 align-middle whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full cursor-pointer select-none transition-transform`}
                            style={{
                              background:
                                activity.type === 'Year-Round'
                                  ? 'var(--brand-primary-dark)'
                                  : 'var(--brand-secondary-light)',
                              color: '#fff',
                            }}
                            tabIndex={0}
                          >
                            {activity.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 align-middle whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full cursor-pointer select-none transition-transform`}
                            style={
                              activity.status === 'A'
                                ? {
                                    background: '#22c55e', // Tailwind green-500
                                    color: '#fff',
                                  }
                                : activity.status === 'D'
                                ? {
                                    background: '#f87171', // Tailwind red-400
                                    color: '#fff',
                                  }
                                : {
                                    background: 'var(--brand-secondary-light)',
                                    color: '#fff',
                                  }
                            }
                            tabIndex={0}
                          >
                            {activity.status === 'A'
                              ? 'Active'
                              : activity.status === 'D'
                              ? 'Deactivated'
                              : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 align-middle">
                          <div
                            className="text-sm text-gray-900 max-w-xs"
                            title={stripHtmlAndTruncate(activity.description, 200)}
                          >
                            {stripHtmlAndTruncate(activity.description) || (
                              <em className="text-gray-300">No description</em>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 align-middle whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <button
                              onClick={() => onEditActivity(activity)}
                              className="flex items-center gap-1 px-3 py-1 rounded bg-[var(--brand-secondary)] text-white hover:bg-[var(--brand-secondary-dark)] transition-colors cursor-pointer active:scale-95"
                              style={{ transition: 'transform 0.1s' }}
                              type="button"
                            >
                              <Edit2 className="w-4 h-4" />
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminActivityTable;