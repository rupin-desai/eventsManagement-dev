import React, { useState, useEffect } from "react";
import {
  getVolunteersByEventId,
  type Volunteer,
  updateVolunteerStatusList,
} from "../../api/admin/volunteerAdminApi";
import { getEventsByYear, type Event } from "../../api/eventApi";
import { AxiosError } from "axios";
import AdminPageHeader from "../../components/ui/admin/AdminPageHeader";
import AdminNotification from "../../components/ui/admin/AdminNotification";
import AdminVolunteerFilters from "../../components/admin/pages/adminVolunteer/AdminVolunteerFilters";
import AdminVolunteerEventSelection from "../../components/admin/pages/adminVolunteer/AdminVolunteerEventSelection";
import AdminVolunteerSelectedEventInfo from "../../components/admin/pages/adminVolunteer/AdminVolunteerSelectedEventInfo";
import AdminVolunteerStatusSummary from "../../components/admin/pages/adminVolunteer/AdminVolunteerStatusSummary";
import AdminVolunteerTable from "../../components/admin/pages/adminVolunteer/AdminVolunteerTable";
import AdminVolunteerBulkUpdateModal from "../../components/admin/pages/adminVolunteer/AdminVolunteerBulkUpdateModal";
import { Users, Edit2 } from "lucide-react";
import ExcelDownload from "../../components/ui/ExcelDownload";
import { getRelVolunteersByEventId } from "../../api/relationApi";
import AdminRelationVolunteerTable from "../../components/admin/pages/adminVolunteer/AdminRelationVolunteerTable";
import AdminAllVolunteerTable from "../../components/admin/pages/adminVolunteer/AdminAllVolunteerTable";



// ✅ Updated status options to support both codes and full names
export const STATUS_OPTIONS = [
  {
    value: "No Action",
    label: "No Action",
    code: "No Action",
    color: "bg-gray-100 text-gray-800",
  },
  {
    value: "Confirmed",
    label: "Confirmed",
    code: "C",
    color: "bg-green-100 text-green-800",
  },
  {
    value: "Attended",
    label: "Attended",
    code: "A",
    color: "bg-blue-100 text-blue-800",
  },
  {
    value: "Rejected",
    label: "Rejected",
    code: "R",
    color: "bg-red-100 text-red-800",
  },
  {
    value: "Not Attended",
    label: "Not Attended",
    code: "N",
    color: "bg-orange-100 text-orange-800",
  },
];

// ✅ Helper functions for status conversion

// Map display status to API code
const getApiStatus = (displayStatus: string): string => {
  switch (displayStatus) {
    case "Attended":
      return "A";
    case "Not Attended":
      return "X"; // <-- Send "X" for Not Attended
    case "Confirmed":
      return "C";
    case "Rejected":
      return "R";
    case "No Action":
      return "No Action";
    default:
      return displayStatus;
  }
};

interface RelationVolunteer {
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

const AdminVolunteerPage: React.FC = () => {
  // State management
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>(
    new Date().getFullYear().toString()
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [showBulkUpdate, setShowBulkUpdate] = useState(false);
  const [selectedVolunteers, setSelectedVolunteers] = useState<number[]>([]);
  const [bulkStatus, setBulkStatus] = useState<string>("Confirmed");
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [relationVolunteers, setRelationVolunteers] = useState<RelationVolunteer[]>([]);
  const [relationLoading, setRelationLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'alkemites' | 'relations' | 'all'>('alkemites');

  // Load data on component mount
  useEffect(() => {
    loadEvents();
  }, [selectedYear]);

  // Load volunteers when event is selected
  useEffect(() => {
    if (selectedEvent) {
      loadVolunteers();
    }
  }, [selectedEvent]);

  // Load relation volunteers when event is selected
  useEffect(() => {
    if (selectedEvent) {
      setRelationLoading(true);
      getRelVolunteersByEventId({ eventId: selectedEvent.eventId })
        .then(res => setRelationVolunteers(res.data))
        .finally(() => setRelationLoading(false));
    } else {
      setRelationVolunteers([]);
    }
  }, [selectedEvent]);

  // Auto-hide notifications
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const response = await getEventsByYear(selectedYear);
      setEvents(response.data);
    } catch (error) {
      console.error("❌ Error loading events:", error);
      showNotification("error", "Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const loadVolunteers = async () => {
    if (!selectedEvent) return;

    try {
      setLoading(true);
      const response = await getVolunteersByEventId(selectedEvent.eventId);

      // ✅ Normalize volunteer statuses for display
      if (response.data && Array.isArray(response.data)) {
        const normalizedVolunteers = response.data.map((volunteer) => ({
          ...volunteer,
          // status remains as API code ("A", "N", etc.)
          originalStatus: volunteer.status, // Keep original for debugging
        }));

        setVolunteers(normalizedVolunteers);
      } else {
        console.warn("⚠️ API response is not an array:", response.data);
        setVolunteers([]);
      }
    } catch (error) {
      console.error("❌ Error loading volunteers:", error);
      if (error instanceof AxiosError) {
        console.error("❌ Axios error details:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message,
        });
      }
      showNotification("error", "Failed to load volunteers");
      setVolunteers([]);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
  };

  const handleEventSelect = (event: Event) => {
    setSelectedEvent(event);
    setVolunteers([]);
    setSelectedVolunteers([]);
  };

  const handleVolunteerSelect = (volunteerId: number) => {
    setSelectedVolunteers((prev) =>
      prev.includes(volunteerId)
        ? prev.filter((id) => id !== volunteerId)
        : [...prev, volunteerId]
    );
  };

  const handleSelectAll = () => {
    if (selectedVolunteers.length === filteredVolunteers.length) {
      setSelectedVolunteers([]);
    } else {
      setSelectedVolunteers(filteredVolunteers.map((v) => v.volunteerId));
    }
  };

  const handleBulkStatusUpdate = async () => {
    if (selectedVolunteers.length === 0) {
      showNotification("error", "Please select volunteers to update");
      return;
    }

    try {
      setFormLoading(true);

      const apiStatus = getApiStatus(bulkStatus);
      await updateVolunteerStatusList({
        volunteerList: selectedVolunteers.map((volunteerId) => ({
          volunteerId,
          status: apiStatus,
        })),
      });

      showNotification(
        "success",
        `Successfully updated ${selectedVolunteers.length} volunteer(s) to ${bulkStatus}`
      );

      setSelectedVolunteers([]);
      setShowBulkUpdate(false);
      loadVolunteers(); // Reload volunteers
    } catch (error) {
      console.error("❌ Error updating volunteer status:", error);
      let errorMessage = "Failed to update volunteer status";

      if (error instanceof AxiosError) {
        console.error("❌ Bulk update error details:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        errorMessage =
          error.response?.data?.message || error.message || errorMessage;
      }

      showNotification("error", errorMessage);
    } finally {
      setFormLoading(false);
    }
  };

  const handleIndividualStatusUpdate = async (
    volunteer: Volunteer,
    newStatusDisplay: string // e.g. "Attended" or "Not Attended"
  ) => {
    try {
      const newStatusCode = getApiStatus(newStatusDisplay); // Convert to "A" or "N"
      await updateVolunteerStatusList({
        volunteerList: [{ volunteerId: volunteer.volunteerId, status: newStatusCode }]
      });

      showNotification(
        "success",
        `Updated ${volunteer.employeeName} status to ${newStatusDisplay}`
      );
      loadVolunteers(); // Reload volunteers
    } catch (error) {
      console.error("❌ Error updating individual volunteer status:", error);
      let errorMessage = "Failed to update volunteer status";

      if (error instanceof AxiosError) {
        console.error("❌ Individual update error details:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        errorMessage =
          error.response?.data?.message || error.message || errorMessage;
      }

      showNotification("error", errorMessage);
    }
  };

  const getStatusBadge = (status: string) => {
    // For null, undefined, or empty status, show nothing (no badge)
    if (status == null || status === "") {
      return null;
    }

    const normalizedStatus = status;
    const statusConfig = STATUS_OPTIONS.find(
      (option) => option.value === normalizedStatus
    );

    if (!statusConfig) {
      return (
        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
          {normalizedStatus}
        </span>
      );
    }

    return (
      <span
        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusConfig.color}`}
      >
        {statusConfig.label}
      </span>
    );
  };

  const filteredEvents = events.filter(
    (event) =>
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.subName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ Improved filtering with better error handling
  const filteredVolunteers = volunteers.filter((volunteer) => {
    if (!searchTerm.trim()) return true; // Show all if no search term

    try {
      const searchLower = searchTerm.toLowerCase();

      return (
        volunteer.employeeName?.toLowerCase().includes(searchLower) ||
        volunteer.employeeId?.toString().includes(searchTerm) ||
        volunteer.employeeEmailId?.toLowerCase().includes(searchLower) ||
        volunteer.employeeDesig?.toLowerCase().includes(searchLower) ||
        volunteer.eventLocationName?.toLowerCase().includes(searchLower) ||
        volunteer.status?.toLowerCase().includes(searchLower)
      );
    } catch (error) {
      console.warn("Filter error for volunteer:", volunteer, error);
      return true;
    }
  });

  // Generate dynamic file name based on event and date
  const getExcelFileName = () => {
    if (!selectedEvent) return "Nominations.xlsx";
    const eventName = selectedEvent.name?.replace(/\s+/g, "_") || "Event";
    const month = selectedEvent.tentativeMonth || "";
    const year = selectedEvent.tentativeYear || "";
    return `Nominations_${eventName}_${month}_${year}.xlsx`;
  };

  // Prepare data for export
  const getExportData = async () => {
    return filteredVolunteers.map((v) => ({
      id: v.volunteerId,
      locationId: v.eventLocationId,
      LocationName: v.eventLocationName,
      employeeId: v.employeeId,
      employeeEmailId: v.employeeEmailId,
      employeeName: v.employeeName,
      status: v.status,
    }));
  };

  const isEventComplete = selectedEvent?.enableComp === "true" || selectedEvent?.enableComp === "1";

  return (
    <>
      <title>Admin | Volunteer Management - Alkem Smile</title>
      <meta
        name="description"
        content="Admin panel for managing volunteers, attendance, and status for Alkem Smile events."
      />
      <meta
        name="keywords"
        content="alkem, admin, volunteer management, attendance, status, events, smile"
      />
      <div
        className="p-6 min-h-screen"
        style={{ background: "var(--brand-primary)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <AdminPageHeader
            icon={<Users className="w-8 h-8 text-red-600" />}
            title="Volunteer Management"
            description="Manage volunteers for SMILE events"
            buttonLabel={
              selectedVolunteers.length > 0
                ? `Update Selected (${selectedVolunteers.length})`
                : undefined
            }
            buttonIcon={
              selectedVolunteers.length > 0 ? (
                <Edit2 className="w-5 h-5" />
              ) : undefined
            }
            onButtonClick={
              selectedVolunteers.length > 0
                ? () => setShowBulkUpdate(true)
                : undefined
            }
            buttonStyle={
              selectedVolunteers.length > 0
                ? {
                    background: "var(--brand-secondary)",
                    color: "var(--neutral-white)",
                  }
                : {}
            }
          />
          <ExcelDownload
            fileName={getExcelFileName()}
            buttonText="Export Nominations"
            columns={[
              { label: "id", key: "id" },
              { label: "locationId", key: "locationId" },
              { label: "LocationName", key: "LocationName" },
              { label: "employeeId", key: "employeeId" },
              { label: "employeeEmailId", key: "employeeEmailId" },
              { label: "employeeName", key: "employeeName" },
              { label: "status", key: "status" },
            ]}
            getData={getExportData}
            disabled={!selectedEvent}
          />
        </div>

        {/* Notification */}
        <AdminNotification
          notification={notification}
          onClose={() => setNotification(null)}
        />

        {/* Search and Filters */}
        <AdminVolunteerFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          selectedEvent={selectedEvent}
        />

        {/* Event Selection or Volunteer Management */}
        {!selectedEvent ? (
          <AdminVolunteerEventSelection
            events={filteredEvents}
            loading={loading}
            selectedYear={selectedYear}
            onEventSelect={handleEventSelect}
            //@ts-ignore
            getStatusBadge={getStatusBadge}
          />
        ) : (
          <div className="space-y-6">
            {/* Selected Event Info */}
            <AdminVolunteerSelectedEventInfo
              selectedEvent={selectedEvent}
              volunteersCount={volunteers.length}
              onChangeEvent={() => setSelectedEvent(null)}
            />

            {/* Status Summary */}
            <AdminVolunteerStatusSummary
              volunteers={volunteers}
              statusOptions={STATUS_OPTIONS}
            />

            {/* Update Selected Button above the table */}
            {selectedVolunteers.length > 0 && (
              <div className="flex justify-end mb-2">
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--brand-secondary)] text-white font-semibold hover:bg-[var(--brand-secondary-dark)] transition-all"
                  onClick={() => setShowBulkUpdate(true)}
                  style={{
                    background: "var(--brand-secondary)",
                    color: "var(--neutral-white)",
                  }}
                >
                  <Edit2 className="w-5 h-5" />
                  {`Update Selected (${selectedVolunteers.length})`}
                </button>
              </div>
            )}

            {/* Volunteers Table */}
            <div className="flex gap-2 mb-4">
              <button
                className={`px-4 py-2 rounded-lg cursor-pointer font-semibold ${activeTab === 'alkemites' ? 'bg-[var(--brand-secondary)] text-white' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => setActiveTab('alkemites')}
              >
                Alkemites
              </button>
              <button
                className={`px-4 py-2 rounded-lg cursor-pointer font-semibold ${activeTab === 'relations' ? 'bg-[var(--brand-secondary)] text-white' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => setActiveTab('relations')}
              >
                Friends & Family
              </button>
              <button
                className={`px-4 py-2 rounded-lg cursor-pointer font-semibold ${activeTab === 'all' ? 'bg-[var(--brand-secondary)] text-white' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => setActiveTab('all')}
              >
                All
              </button>
            </div>

            {activeTab === 'alkemites' && (
              <AdminVolunteerTable
                volunteers={filteredVolunteers}
                loading={loading}
                searchTerm={searchTerm}
                selectedVolunteers={selectedVolunteers}
                statusOptions={STATUS_OPTIONS}
                onVolunteerSelect={handleVolunteerSelect}
                onSelectAll={handleSelectAll}
                onStatusUpdate={handleIndividualStatusUpdate}
                getStatusBadge={getStatusBadge}
                isEventComplete={isEventComplete} // <-- add this
              />
            )}

            {activeTab === 'relations' && (
              <AdminRelationVolunteerTable
                volunteers={relationVolunteers}
                loading={relationLoading}
              />
            )}

            {activeTab === 'all' && (
              <AdminAllVolunteerTable
                alkemites={filteredVolunteers}
                relations={relationVolunteers}
                loading={loading || relationLoading}
                getStatusBadge={getStatusBadge}
              />
            )}
          </div>
        )}

        {/* Bulk Update Modal */}
        <AdminVolunteerBulkUpdateModal
          isOpen={showBulkUpdate}
          selectedCount={selectedVolunteers.length}
          bulkStatus={bulkStatus}
          setBulkStatus={setBulkStatus}
          statusOptions={[
            { value: "Attended", label: "Attended", color: "bg-blue-100 text-blue-800" },
            { value: "Not Attended", label: "Not Attended", color: "bg-orange-100 text-orange-800" },
          ]} // <-- Only these two options
          formLoading={formLoading}
          onSubmit={handleBulkStatusUpdate}
          onClose={() => setShowBulkUpdate(false)}
        />
      </div>
    </>
  );
};

export default AdminVolunteerPage;
