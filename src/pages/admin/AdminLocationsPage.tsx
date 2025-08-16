import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  MapPin,
  Building2,
  Users,
  Calendar
} from 'lucide-react';
import { 
  getLocations, 
  type Location
} from '../../api/admin/locationAdminApi';
import { getEventsByYear, type Event } from '../../api/eventApi';
import { getEventLocationsByEventId, type EventLocation } from '../../api/locationApi';
import AdminPageHeader from '../../components/ui/admin/AdminPageHeader';
import AdminNotification from '../../components/ui/admin/AdminNotification';

const AdminLocationsPage: React.FC = () => {
  // State management
  const [locations, setLocations] = useState<Location[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [eventLocations, setEventLocations] = useState<EventLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [activeTab, setActiveTab] = useState<'all' | 'event-specific'>('all');
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Load data on component mount
  useEffect(() => {
    loadInitialData();
    // eslint-disable-next-line
  }, []);

  // Load events and their locations when year changes
  useEffect(() => {
    if (selectedYear) {
      loadEventsAndLocations();
    }
    // eslint-disable-next-line
  }, [selectedYear]);

  // Auto-hide notifications
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      await loadLocations();
      await loadEventsAndLocations();
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to load initial data' });
    } finally {
      setLoading(false);
    }
  };

  const loadLocations = async () => {
    try {
      const response = await getLocations();
      setLocations(response.data);
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to load locations' });
    }
  };

  // Load all events and all their locations for the selected year
  const loadEventsAndLocations = async () => {
    try {
      setLoading(true);
      const eventsResponse = await getEventsByYear(selectedYear);
      setEvents(eventsResponse.data);

      // Fetch locations for all events in parallel
      const allEventLocations: EventLocation[] = [];
      await Promise.all(
        eventsResponse.data.map(async (event: Event) => {
          try {
            const res = await getEventLocationsByEventId(event.eventId);
            if (Array.isArray(res.data)) {
              // Attach eventId to each location for filtering
              allEventLocations.push(
                ...res.data.map((loc: EventLocation) => ({
                  ...loc,
                  eventId: event.eventId,
                }))
              );
            }
          } catch {
            // ignore errors for individual events
          }
        })
      );
      setEventLocations(allEventLocations);
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to load events or event locations' });
    } finally {
      setLoading(false);
    }
  };

  const filteredLocations = locations.filter(location =>
    location.locationName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtered events for search
  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.subName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <title>Admin | Location Management - Alkem Smile</title>
      <meta name="description" content="Admin panel for managing event locations for Alkem Smile volunteering activities." />
      <meta name="keywords" content="alkem, admin, location management, volunteering, events, smile" />
      <div className="p-6 min-h-screen" style={{ background: 'var(--brand-primary)' }}>
        {/* Header */}
        <AdminPageHeader
          icon={<MapPin className="w-8 h-8 text-red-600" />}
          title="Location Management"
          description="View and manage SMILE locations"
        />

        {/* Notification */}
        <AdminNotification notification={notification} onClose={() => setNotification(null)} />

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex justify-start">
            <div className="inline-flex rounded-lg bg-white shadow border border-gray-200 overflow-hidden">
              <button
                onClick={() => setActiveTab('all')}
                className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold transition-colors duration-150 focus:outline-none cursor-pointer
                  ${activeTab === 'all'
                    ? 'bg-[var(--brand-secondary)] text-white shadow'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                style={{
                  borderRight: '1px solid #eee',
                  borderRadius: '8px 0 0 8px'
                }}
                type="button"
              >
                <Building2 className="w-4 h-4" />
                All Locations ({locations.length})
              </button>
              <button
                onClick={() => setActiveTab('event-specific')}
                className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold transition-colors duration-150 focus:outline-none cursor-pointer
                  ${activeTab === 'event-specific'
                    ? 'bg-[var(--brand-secondary)] text-white shadow'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                style={{
                  borderRadius: '0 8px 8px 0'
                }}
                type="button"
              >
                <Calendar className="w-4 h-4" />
                Event Locations
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={activeTab === 'all' ? 'Search locations...' : 'Search events or locations...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-black"
            />
          </div>
          {activeTab === 'event-specific' && (
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-black"
            >
              {Array.from({ length: 5 }, (_, i) => {
                const year = new Date().getFullYear() + i - 2;
                return (
                  <option key={year} value={year.toString()}>
                    {year}
                  </option>
                );
              })}
            </select>
          )}
        </div>

        {/* Content based on active tab */}
        {activeTab === 'all' ? (
          // --- Responsive Table (matches AdminActivityTable aesthetics) ---
          <div className="bg-white rounded-lg shadow w-full" style={{ maxWidth: '100vw', maxHeight: '100vh' }}>
            {/* Mobile: horizontally scrollable table with sticky header */}
            <div className="block md:hidden relative" style={{ maxHeight: '100vh' }}>
              <div className="overflow-x-auto">
                <div className="min-w-[600px]">
                  <table className="w-full rounded-t-lg overflow-hidden table-fixed">
                    <colgroup>
                      <col className="w-[20%]" />
                      <col className="w-[60%]" />
                      <col className="w-[20%]" />
                    </colgroup>
                    <thead>
                      <tr>
                        <th className="px-4 py-3 align-middle text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">
                          Location ID
                        </th>
                        <th className="px-4 py-3 align-middle text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">
                          Location Name
                        </th>
                        <th className="px-4 py-3 align-middle text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {loading ? (
                        <tr>
                          <td colSpan={3} className="text-center py-8 text-gray-600">Loading locations...</td>
                        </tr>
                      ) : filteredLocations.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="text-center py-8 text-gray-500">
                            {searchTerm ? 'No locations found matching your search.' : 'No locations available.'}
                          </td>
                        </tr>
                      ) : (
                        filteredLocations.map((location) => (
                          <tr key={location.locationId} className="hover:bg-[var(--brand-primary-light)] transition-colors">
                            <td className="px-4 py-4 align-middle text-sm font-medium text-gray-900">
                              {location.locationId}
                            </td>
                            <td className="px-4 py-4 align-middle">
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                                <span className="text-sm text-gray-900">{location.locationName}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4 align-middle">
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                Active
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            {/* Desktop: sticky header, vertical scroll only for tbody */}
            <div className="hidden md:block relative" style={{ maxHeight: '100vh' }}>
              <table className="w-full rounded-t-lg overflow-hidden table-fixed min-w-full">
                <colgroup>
                  <col className="w-[20%]" />
                  <col className="w-[60%]" />
                  <col className="w-[20%]" />
                </colgroup>
                <thead>
                  <tr>
                    <th className="px-6 py-3 align-middle text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">
                      Location ID
                    </th>
                    <th className="px-6 py-3 align-middle text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">
                      Location Name
                    </th>
                    <th className="px-6 py-3 align-middle text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10 bg-[var(--brand-secondary)]">
                      Status
                    </th>
                  </tr>
                </thead>
              </table>
              <div className="overflow-y-auto custom-scrollbar rounded-b-lg" style={{ maxHeight: 'calc(100vh - 48px)' }}>
                <table className="w-full table-fixed min-w-full">
                  <colgroup>
                    <col className="w-[20%]" />
                    <col className="w-[60%]" />
                    <col className="w-[20%]" />
                  </colgroup>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan={3} className="text-center py-8 text-gray-600">Loading locations...</td>
                      </tr>
                    ) : filteredLocations.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="text-center py-8 text-gray-500">
                          {searchTerm ? 'No locations found matching your search.' : 'No locations available.'}
                        </td>
                      </tr>
                    ) : (
                      filteredLocations.map((location) => (
                        <tr key={location.locationId} className="hover:bg-[var(--brand-primary-light)] transition-colors">
                          <td className="px-6 py-4 align-middle text-sm font-medium text-gray-900">
                            {location.locationId}
                          </td>
                          <td className="px-6 py-4 align-middle">
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-900">{location.locationName}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 align-middle">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              Active
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredEvents.length === 0 ? (
              <div className="text-gray-500 text-sm">No events available for {selectedYear}.</div>
            ) : (
              filteredEvents.map((event) => (
                <div
                  key={event.eventId}
                  className="bg-white rounded-lg shadow p-6"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Left: Event details and assigned locations */}
                    <div className="flex-1 min-w-0">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="w-5 h-5 text-red-500" />
                          <span className="font-semibold text-lg text-gray-900">{event.name}</span>
                        </div>
                        <div className="text-sm text-gray-500">{event.subName}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {event.tentativeMonth} {event.tentativeYear}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-4">
                        <Users className="w-5 h-5 text-green-600" />
                        <span className="text-sm text-gray-700 font-medium">
                          Assigned Locations: 
                          <span className="ml-1 text-green-700 font-bold">
                            {
                              eventLocations.filter(
                                (el) => el.eventId === event.eventId
                              ).length
                            }
                          </span>
                        </span>
                      </div>
                      <div className="mt-4">
                        <ul className="list-disc list-inside text-sm text-gray-700">
                          {eventLocations
                            .filter((el) => el.eventId === event.eventId)
                            .map((el) => (
                              <li key={el.eventLocationId}>
                                <span className="font-medium">{el.locationName}</span>
                                <span className="ml-2 text-xs text-gray-400">({el.locationId})</span>
                              </li>
                            ))}
                          {!loading && eventLocations.filter((el) => el.eventId === event.eventId).length === 0 && (
                            <li className="text-gray-400">No locations assigned to this event.</li>
                          )}
                          {loading && (
                            <li className="text-gray-400">Loading...</li>
                          )}
                        </ul>
                      </div>
                    </div>
                    {/* Right: Location table */}
                    <div className="flex-1 min-w-0">
                      <div className="w-full overflow-x-auto">
                        <table className="min-w-[350px] w-full table-fixed rounded-lg overflow-hidden">
                          <colgroup>
                            <col className="w-[60%]" />
                            <col className="w-[40%]" />
                          </colgroup>
                          <thead>
                            <tr>
                              <th className="px-4 py-3 align-middle text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10"
                                  style={{ background: '#FFD600', color: '#222' }}>
                                Location Name
                              </th>
                              <th className="px-4 py-3 align-middle text-left text-xs font-bold uppercase tracking-wider text-white sticky top-0 z-10"
                                  style={{ background: '#FFD600', color: '#222' }}>
                                Location ID
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                              <tr>
                                <td colSpan={2} className="text-center py-8 text-gray-600">Loading...</td>
                              </tr>
                            ) : (
                              eventLocations
                                .filter((el) => el.eventId === event.eventId)
                                .map((eventLocation) => (
                                  <tr key={eventLocation.eventLocationId} className="hover:bg-yellow-50 transition-colors">
                                    <td className="px-4 py-4 align-middle">
                                      <div className="flex items-center">
                                        <MapPin className="w-4 h-4 text-yellow-600 mr-2" />
                                        <span className="text-sm font-medium text-gray-900">
                                          {eventLocation.locationName}
                                        </span>
                                      </div>
                                    </td>
                                    <td className="px-4 py-4 align-middle">
                                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                        {eventLocation.locationId}
                                      </span>
                                    </td>
                                  </tr>
                                ))
                            )}
                            {!loading && eventLocations.filter((el) => el.eventId === event.eventId).length === 0 && (
                              <tr>
                                <td colSpan={2} className="text-center py-8 text-gray-500">
                                  No locations assigned to this event.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Summary Statistics */}
        <motion.div 
          className="mt-8 bg-white rounded-lg shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="font-semibold text-gray-900 mb-4">Location Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {locations.length}
              </div>
              <div className="text-sm text-gray-500">Total Locations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {events.length}
              </div>
              <div className="text-sm text-gray-500">Events ({selectedYear})</div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default AdminLocationsPage;