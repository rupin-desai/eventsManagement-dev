import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  X,
  Calendar,
  Plus,
  Edit2,
  Trash2,
  MapPin,
  Clock,
  Loader2,
  Save,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

// Dummy types (replacing API types)
interface EventLocation {
  eventLocationId: number;
  locationId: number;
  locationName: string;
  venue: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  dateType?: "M" | "R" | "";
}

interface Location {
  locationId: number;
  locationName: string;
}

interface Event {
  eventId: number;
  name: string;
  subName: string;
  description: string;
  tentativeMonth: string;
  tentativeYear: string;
  type: string;
  enableCert: string;
  enableComp: string;
  enableConf: string;
  addedBy: number;
  activityId?: number;
}

// Dummy data
const dummyLocations: Location[] = [
  { locationId: 1, locationName: "Mumbai" },
  { locationId: 2, locationName: "Delhi" },
  { locationId: 3, locationName: "Bangalore" },
  { locationId: 4, locationName: "Chennai" },
  { locationId: 5, locationName: "Pune" },
];

const dummyEventLocations: EventLocation[] = [
  {
    eventLocationId: 1,
    locationId: 1,
    locationName: "Mumbai",
    venue: "Central Park, Mumbai",
    eventDate: "2025-08-15",
    startTime: "09:00",
    endTime: "17:00",
    dateType: "M",
  },
  {
    eventLocationId: 2,
    locationId: 2,
    locationName: "Delhi",
    venue: "Community Center, Delhi",
    eventDate: "2025-08-16",
    startTime: "10:00",
    endTime: "16:00",
    dateType: "R",
  },
];

// Helper to format time as HH:mm (24-hour) for API
// function formatEventTime(time: string): string {
//   // Accepts "HH:mm" or "HH:mm:ss", returns "HH:mm:ss"
//   if (!time) return "";
//   if (/^\d{2}:\d{2}$/.test(time)) {
//     return time + ":00";
//   }
//   if (/^\d{2}:\d{2}:\d{2}$/.test(time)) {
//     return time;
//   }
//   // fallback: try to parse and format
//   const d = new Date(`1970-01-01T${time}`);
//   if (!isNaN(d.getTime())) {
//     return d.toTimeString().slice(0, 8);
//   }
//   return time;
// }

// function formatEventDate(dateString: string): string {
//   if (!dateString) return "";
//   try {
//     const date = new Date(dateString);
//     return date.toISOString().split('T')[0];
//   } catch {
//     return dateString;
//   }
// }

export interface EventLocationFormData {
  eventLocationId?: number;
  locationId: number;
  locationName?: string;
  venue: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  datetype?: "M" | "R" | "";
  eventLocationDates?: { date: string }[];
}

export interface NotificationState {
  type: "success" | "error";
  message: string;
}

interface EventDetailModalProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
  onEventUpdated: () => void;
}

const MONTHS = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

// --- Toggle Switch ---
const ToggleSwitch: React.FC<{
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}> = ({ label, description, checked, onChange, disabled = false }) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
    <div className="flex-1">
      <h4 className="text-sm font-medium text-gray-900">{label}</h4>
      {description && (
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      )}
    </div>
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
        checked ? "bg-red-600" : "bg-gray-200"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  </div>
);

// --- Notification ---
const EventDetailModalNotification: React.FC<{
  notification: NotificationState;
}> = ({ notification }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`p-4 rounded-lg flex items-center gap-3 ${
      notification.type === "success"
        ? "bg-green-50 text-green-800 border border-green-200"
        : "bg-red-50 text-red-800 border border-red-200"
    }`}
  >
    {notification.type === "success" ? (
      <CheckCircle className="w-5 h-5" />
    ) : (
      <AlertCircle className="w-5 h-5" />
    )}
    <span>{notification.message}</span>
  </motion.div>
);

// --- Tabs ---
const EventDetailModalTabs: React.FC<{
  activeTab: "details" | "locations";
  setActiveTab: (tab: "details" | "locations") => void;
  eventLocationsCount: number;
}> = ({ activeTab, setActiveTab, eventLocationsCount }) => (
  <div className="flex space-x-2 mt-6">
    <button
      onClick={() => setActiveTab("details")}
      className={`px-5 py-2 text-sm font-semibold rounded-l-lg transition-colors duration-150 focus:outline-none cursor-pointer
        ${
          activeTab === "details"
            ? "bg-[var(--brand-secondary)] text-white shadow"
            : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
        }`}
      type="button"
    >
      Event Details
    </button>
    <button
      onClick={() => setActiveTab("locations")}
      className={`px-5 py-2 text-sm font-semibold rounded-r-lg transition-colors duration-150 focus:outline-none cursor-pointer
        ${
          activeTab === "locations"
            ? "bg-[var(--brand-secondary)] text-white shadow"
            : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
        }`}
      type="button"
    >
      Locations ({eventLocationsCount})
    </button>
  </div>
);

// --- Details Tab ---
//@ts-ignore
const EventDetailModalDetailsTab: React.FC<{
  event: Event;
  loading: boolean;
  eventStatusForm: {
    tentativeMonth: string;
    tentativeYear: string;
    certStatus: string;
    compStatus: string;
    confStatus: string;
  };
  setEventStatusForm: React.Dispatch<
    React.SetStateAction<{
      tentativeMonth: string;
      tentativeYear: string;
      certStatus: string;
      compStatus: string;
      confStatus: string;
    }>
  >;
  showNotification: (type: "success" | "error", message: string) => void;
  onEventUpdated: () => void;
}> = ({
  event,
  loading,
  eventStatusForm,
  setEventStatusForm,
  showNotification,
  onEventUpdated,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [originalFormData, setOriginalFormData] = useState<{
    tentativeMonth: string;
    tentativeYear: string;
    certStatus: string;
    compStatus: string;
    confStatus: string;
  } | null>(null);

  const convertStatusToBooleanString = (status: string): string => {
    return status === "A" || status === "true" ? "true" : "false";
  };

  const getMonthNumber = (monthValue: string): string => {
    if (!monthValue) return "1";
    const numericMonth = parseInt(monthValue);
    if (!isNaN(numericMonth) && numericMonth >= 1 && numericMonth <= 12) {
      return numericMonth.toString();
    }
    const month = MONTHS.find(
      (m) => m.label.toLowerCase() === monthValue.toLowerCase()
    );
    return month ? month.value : "1";
  };

  useEffect(() => {
    if (event) {
      const initialData = {
        tentativeMonth: getMonthNumber(event.tentativeMonth),
        tentativeYear: event.tentativeYear,
        certStatus: convertStatusToBooleanString(event.enableCert || "I"),
        compStatus: convertStatusToBooleanString(event.enableComp || "I"),
        confStatus: convertStatusToBooleanString(event.enableConf || "I"),
      };
      setOriginalFormData(initialData);
      setEventStatusForm(initialData);
    }
    // eslint-disable-next-line
  }, [event]);

  const hasChanges = originalFormData
    ? eventStatusForm.tentativeMonth !== originalFormData.tentativeMonth ||
      eventStatusForm.tentativeYear !== originalFormData.tentativeYear ||
      eventStatusForm.certStatus !== originalFormData.certStatus ||
      eventStatusForm.compStatus !== originalFormData.compStatus ||
      eventStatusForm.confStatus !== originalFormData.confStatus
    : false;

  const handleResetForm = () => {
    if (originalFormData) {
      setEventStatusForm({ ...originalFormData });
    }
  };

  const handleUpdateEventStatus = async () => {
    try {
      setIsUpdating(true);
      
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      showNotification("success", "Event status updated successfully");
      setOriginalFormData({ ...eventStatusForm });
      onEventUpdated();
    } catch (error: any) {
      showNotification("error", "Failed to update event status");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tentative Month *
          </label>
          <select
            value={eventStatusForm.tentativeMonth}
            onChange={(e) =>
              setEventStatusForm({
                ...eventStatusForm,
                tentativeMonth: e.target.value,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            disabled={loading || isUpdating}
          >
            {MONTHS.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tentative Year *
          </label>
          <select
            value={eventStatusForm.tentativeYear}
            onChange={(e) =>
              setEventStatusForm({
                ...eventStatusForm,
                tentativeYear: e.target.value,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            disabled={loading || isUpdating}
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
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
          Event Features
        </h3>
        <div className="space-y-3">
          <ToggleSwitch
            label="Nomination Confirmation"
            description="Require participants to confirm their nomination for this event"
            checked={eventStatusForm.confStatus === "true"}
            onChange={(checked) =>
              setEventStatusForm({
                ...eventStatusForm,
                confStatus: checked ? "true" : "false",
              })
            }
            disabled={loading || isUpdating}
          />
          
          <ToggleSwitch
            label="Event Complete"
            description="Mark this event as completed and finalize all activities"
            checked={eventStatusForm.compStatus === "true"}
            onChange={(checked) =>
              setEventStatusForm({
                ...eventStatusForm,
                compStatus: checked ? "true" : "false",
              })
            }
            disabled={loading || isUpdating}
          />
          <ToggleSwitch
            label="Certificate Access"
            description="Enable participants to download certificates after event completion"
            checked={eventStatusForm.certStatus === "true"}
            onChange={(checked) =>
              setEventStatusForm({
                ...eventStatusForm,
                certStatus: checked ? "true" : "false",
              })
            }
            disabled={loading || isUpdating}
          />
        </div>
      </div>
      {hasChanges && (
        <div className="my-4 pt-4 border-t border-gray-200">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-yellow-800 font-medium">
                  You have unsaved changes
                </span>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={handleResetForm}
                  disabled={isUpdating}
                  className="px-3 py-1.5 cursor-pointer text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Reset
                </button>
                <button
                  onClick={handleUpdateEventStatus}
                  disabled={isUpdating}
                  className="flex items-center cursor-pointer gap-2 px-4 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white text-sm rounded-md transition-colors"
                >
                  {isUpdating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {isUpdating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Location Form ---
const EventDetailModalLocationForm: React.FC<{
  event: Event;
  locationForm: EventLocationFormData;
  setLocationForm: React.Dispatch<React.SetStateAction<EventLocationFormData>>;
  availableLocations: Location[];
  editingLocation: EventLocation | null;
  resetLocationForm: () => void;
  showNotification: (type: "success" | "error", message: string) => void;
  loadEventData: () => Promise<void>;
  dateType: "M" | "R" | "";
  setDateType: React.Dispatch<React.SetStateAction<"M" | "R" | "">>;
  multiDates: string[];
  setMultiDates: React.Dispatch<React.SetStateAction<string[]>>;
  rangeStart: string;
  setRangeStart: React.Dispatch<React.SetStateAction<string>>;
  rangeEnd: string;
  setRangeEnd: React.Dispatch<React.SetStateAction<string>>;
}> = ({
  locationForm,
  setLocationForm,
  availableLocations,
  editingLocation,
  resetLocationForm,
  showNotification,
  loadEventData,
  dateType,
  setDateType,
  multiDates,
  setMultiDates,
  rangeStart,
  setRangeStart,
  rangeEnd,
  setRangeEnd,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dateIdMap, setDateIdMap] = useState<Record<string, number[]>>({});
  const [deletingDate, setDeletingDate] = useState<string | null>(null);

  // Simulate fetching dateIdMap when editingLocation or dateType changes
  useEffect(() => {
    if (
      editingLocation &&
      (editingLocation.eventLocationId || editingLocation.eventLocationId === 0) &&
      (dateType === "M" || dateType === "R")
    ) {
      // Simulate API call with timeout
      const simulateFetchDates = async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Generate dummy date IDs
        const map: Record<string, number[]> = {};
        if (dateType === "M") {
          multiDates.forEach((date, index) => {
            map[date] = [index + 1];
          });
        } else if (dateType === "R" && rangeStart && rangeEnd) {
          const start = new Date(rangeStart);
          const end = new Date(rangeEnd);
          let id = 1;
          for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            const dateKey = d.toISOString().slice(0, 10);
            map[dateKey] = [id++];
          }
        }
        setDateIdMap(map);
      };
      
      simulateFetchDates();
    } else {
      setDateIdMap({});
    }
  }, [editingLocation, dateType, multiDates, rangeStart, rangeEnd]);

  const handleCreateEventLocation = async () => {
    if (
      !locationForm.locationId ||
      !locationForm.venue.trim() ||
      !locationForm.eventDate ||
      !locationForm.startTime ||
      !locationForm.endTime
    ) {
      showNotification("error", "Please fill in all required fields");
      return;
    }
    try {
      setIsSubmitting(true);
      
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      showNotification("success", "Event location created successfully");
      resetLocationForm();
      await loadEventData();
    } catch (error: any) {
      showNotification("error", "Failed to create event location");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateEventLocation = async () => {
    if (
      !editingLocation ||
      !locationForm.venue.trim() ||
      !locationForm.eventDate ||
      !locationForm.startTime ||
      !locationForm.endTime
    ) {
      showNotification("error", "Please fill in all required fields");
      return;
    }
    try {
      setIsSubmitting(true);

      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 2000));

      showNotification("success", "Event location updated successfully");
      resetLocationForm();
      await loadEventData();
    } catch (error: any) {
      showNotification("error", "Failed to update event location");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="rounded-lg border p-6 mb-6"
      style={{
        background: "var(--neutral-gray-50)",
        borderColor: "var(--brand-primary-light)",
      }}
    >
      <h4
        className="text-lg font-bold mb-4"
        style={{ color: "var(--brand-secondary)" }}
      >
        {editingLocation ? "Edit Location" : "Add New Location"}
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {!editingLocation && (
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--brand-secondary-dark)" }}
            >
              Location *
            </label>
            <select
              value={locationForm.locationId}
              onChange={(e) =>
                setLocationForm({
                  ...locationForm,
                  locationId: parseInt(e.target.value),
                })
              }
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--brand-secondary)] focus:border-transparent"
              style={{
                borderColor: "var(--brand-primary)",
                background: "var(--neutral-white)",
                color: "var(--brand-secondary-dark)",
              }}
            >
              <option value={0}>Select a location</option>
              {availableLocations.map((location) => (
                <option key={location.locationId} value={location.locationId}>
                  {location.locationName}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className={editingLocation ? "md:col-span-2" : ""}>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--brand-secondary-dark)" }}
          >
            Venue *
          </label>
          <textarea
            value={locationForm.venue}
            onChange={(e) =>
              setLocationForm({
                ...locationForm,
                venue: e.target.value,
              })
            }
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--brand-secondary)] focus:border-transparent"
            style={{
              borderColor: "var(--brand-primary)",
              background: "var(--neutral-white)",
              color: "var(--brand-secondary-dark)",
            }}
            rows={3}
            placeholder="Enter venue details..."
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--brand-secondary-dark)" }}
          >
            Date *
          </label>
          <input
            type="date"
            value={locationForm.eventDate}
            onChange={(e) =>
              setLocationForm({
                ...locationForm,
                eventDate: e.target.value,
              })
            }
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--brand-secondary)] focus:border-transparent"
            style={{
              borderColor: "var(--brand-primary)",
              background: "var(--neutral-white)",
              color: "var(--brand-secondary-dark)",
            }}
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--brand-secondary-dark)" }}
          >
            Start Time *
          </label>
          <input
            type="time"
            value={locationForm.startTime}
            onChange={(e) =>
              setLocationForm({
                ...locationForm,
                startTime: e.target.value,
              })
            }
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--brand-secondary)] focus:border-transparent"
            style={{
              borderColor: "var(--brand-primary)",
              background: "var(--neutral-white)",
              color: "var(--brand-secondary-dark)",
            }}
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--brand-secondary-dark)" }}
          >
            End Time *
          </label>
          <input
            type="time"
            value={locationForm.endTime}
            onChange={(e) =>
              setLocationForm({
                ...locationForm,
                endTime: e.target.value,
              })
            }
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--brand-secondary)] focus:border-transparent"
            style={{
              borderColor: "var(--brand-primary)",
              background: "var(--neutral-white)",
              color: "var(--brand-secondary-dark)",
            }}
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2" style={{ color: "var(--brand-secondary-dark)" }}>
          Date Type *
        </label>
        <select
          value={dateType || "S"}
          onChange={async (e) => {
            const newType = e.target.value as "M" | "R" | "S" | "";
            // Only show confirm if editing and there are dates to delete
            if (
              editingLocation &&
              dateType &&
              dateType !== newType &&
              ((dateType === "M" && multiDates.length > 0) ||
                (dateType === "R" && (rangeStart || rangeEnd)))
            ) {
              if (
                window.confirm(
                  "Changing date type will delete all current dates for this location. Continue?"
                )
              ) {
                // Simulate deletion
                await new Promise(resolve => setTimeout(resolve, 500));
                setMultiDates([]);
                setRangeStart("");
                setRangeEnd("");
                setDateType(newType === "S" ? "" : newType);
              }
              // If cancelled, do not change
              return;
            }
            setDateType(newType === "S" ? "" : newType);
          }}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--brand-secondary)] focus:border-transparent"
          style={{
            borderColor: "var(--brand-primary)",
            background: "var(--neutral-white)",
            color: "var(--brand-secondary-dark)",
          }}
        >
          <option value="S">Single</option>
          <option value="M">Multiple Dates</option>
          <option value="R">Date Range</option>
        </select>
      </div>
      {/* Multiple Dates Picker */}
      {dateType === "M" && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" style={{ color: "var(--brand-secondary-dark)" }}>
            Select Dates *
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {multiDates.map((date) => (
              <span key={date} className="inline-flex items-center bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                {date}
                <button
                  type="button"
                  className="ml-1 text-red-500 hover:text-red-700 cursor-pointer active:scale-95"
                  disabled={deletingDate === date}
                  onClick={async () => {
                    // Simulate deletion
                    if (editingLocation && dateIdMap[date]) {
                      setDeletingDate(date);
                      try {
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        setMultiDates(multiDates.filter((d) => d !== date));
                        setDateIdMap((prev) => {
                          const newMap = { ...prev };
                          delete newMap[date];
                          return newMap;
                        });
                      } catch {
                        // Optionally show error
                      } finally {
                        setDeletingDate(null);
                      }
                    } else {
                      // Not editing, just remove locally
                      setMultiDates(multiDates.filter((d) => d !== date));
                    }
                  }}
                  title="Remove date"
                >
                  {deletingDate === date ? <Loader2 className="w-3 h-3 animate-spin" /> : "×"}
                </button>
              </span>
            ))}
          </div>
          <input
            type="date"
            value=""
            onChange={e => {
              if (e.target.value && !multiDates.includes(e.target.value)) {
                setMultiDates([...multiDates, e.target.value]);
              }
            }}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
      )}

      {/* Range Picker */}
      {dateType === "R" && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" style={{ color: "var(--brand-secondary-dark)" }}>
            Select Date Range *
          </label>
          <div className="flex gap-2">
            <input
              type="date"
              value={rangeStart}
              onChange={e => setRangeStart(e.target.value)}
              className="w-1/2 px-3 py-2 border rounded-lg"
            />
            <input
              type="date"
              value={rangeEnd}
              onChange={e => setRangeEnd(e.target.value)}
              className="w-1/2 px-3 py-2 border rounded-lg"
            />
          </div>
        </div>
      )}
      <div className="flex justify-end gap-3">
        <button
          onClick={resetLocationForm}
          className="px-4 py-2 text-[var(--brand-secondary-dark)] border rounded-lg hover:bg-[var(--brand-primary-light)] transition-colors"
          style={{ borderColor: "var(--brand-primary)" }}
        >
          Cancel
        </button>
        <button
          onClick={
            editingLocation
              ? handleUpdateEventLocation
              : handleCreateEventLocation
          }
          disabled={isSubmitting}
          className="flex cursor-pointer  hover:bg-[var(--brand-primary-dark)] items-center gap-2 px-4 py-2 rounded-lg transition-colors"
          style={{
            background: "var(--brand-secondary)",
            color: "var(--neutral-white)",
            opacity: isSubmitting ? 0.7 : 1,
          }}
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isSubmitting ? "Saving..." : editingLocation ? "Update" : "Add"}
        </button>
      </div>
    </div>
  );
};

// --- Locations List ---
const EventDetailModalLocationsList: React.FC<{
  eventLocations: EventLocation[];
  loading: boolean;
  setEditingLocation: React.Dispatch<
    React.SetStateAction<EventLocation | null>
  >;
  setLocationForm: React.Dispatch<React.SetStateAction<EventLocationFormData>>;
  setShowLocationForm: React.Dispatch<React.SetStateAction<boolean>>;
  showNotification: (type: "success" | "error", message: string) => void;
  loadEventData: () => Promise<void>;
  editingLocation: EventLocation | null;
  setDateType: React.Dispatch<React.SetStateAction<"M" | "R" | "">>;
  setMultiDates: React.Dispatch<React.SetStateAction<string[]>>;
  setRangeStart: React.Dispatch<React.SetStateAction<string>>;
  setRangeEnd: React.Dispatch<React.SetStateAction<string>>;
}> = ({
  eventLocations,
  loading,
  setEditingLocation,
  setLocationForm,
  setShowLocationForm,
  showNotification,
  loadEventData,
  editingLocation,
  setDateType,
  setMultiDates,
  setRangeStart,
  setRangeEnd,
}) => {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [locationDates, setLocationDates] = useState<Record<number, string[]>>({});
  const [loadingDates, setLoadingDates] = useState<Record<number, boolean>>({});

  useEffect(() => {
    eventLocations.forEach((loc) => {
      if (loc.eventLocationId && !locationDates[loc.eventLocationId]) {
        fetchDates(loc.eventLocationId, loc);
      }
    });
    // eslint-disable-next-line
  }, [eventLocations]);

  const fetchDates = async (
    eventLocationId: number,
    eventLocation: EventLocation
  ) => {
    setLoadingDates((prev) => ({ ...prev, [eventLocationId]: true }));
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate dummy dates based on dateType
      let dates: string[] = [];
      if (eventLocation.dateType === "M") {
        dates = ["2025-08-15", "2025-08-16", "2025-08-17"];
      } else if (eventLocation.dateType === "R") {
        dates = ["2025-08-15", "2025-08-16", "2025-08-17", "2025-08-18"];
      } else {
        dates = [eventLocation.eventDate];
      }
      
      setLocationDates((prev) => ({
        ...prev,
        [eventLocationId]: dates,
      }));
    } catch {
      setLocationDates((prev) => ({
        ...prev,
        [eventLocationId]: [],
      }));
    } finally {
      setLoadingDates((prev) => ({ ...prev, [eventLocationId]: false }));
    }
  };

  // Use dateType (or datetype fallback) and string[] dates
  const formatDateRange = (eventLocation: EventLocation) => {
    const dates = locationDates[eventLocation.eventLocationId];
    const dateType = eventLocation.dateType || "";
    if (loadingDates[eventLocation.eventLocationId]) {
      return <span className="text-xs text-gray-400">Loading dates...</span>;
    }
    return formatEventLocationDates(dateType, dates, eventLocation.eventDate);
  };

  const handleDeleteEventLocation = async (eventLocation: EventLocation) => {
    if (!window.confirm("Are you sure you want to delete this location?")) return;
    setDeletingId(eventLocation.eventLocationId);
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      showNotification("success", "Location deleted successfully");
      await loadEventData();
    } catch (error: any) {
      showNotification("error", "Failed to delete location");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading && eventLocations.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-[var(--brand-secondary)]" />
        <span className="ml-2 text-gray-600">Loading locations...</span>
      </div>
    );
  }

  if (eventLocations.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 font-medium">
        No locations added for this event yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {eventLocations.map((eventLocation) => (
        <div
          key={eventLocation.eventLocationId}
          className={`
            bg-[var(--neutral-white)] border border-[var(--brand-primary-light)] rounded-xl p-4 transition-shadow
            ${
              editingLocation &&
              editingLocation.eventLocationId === eventLocation.eventLocationId
                ? "ring-2 ring-[var(--brand-secondary)] border-[var(--brand-secondary)] bg-yellow-50"
                : "hover:shadow-lg hover:bg-gray-50 cursor-pointer"
            }
          `}
          onClick={() => {
            setEditingLocation(eventLocation);
            setLocationForm({
              eventLocationId: eventLocation.eventLocationId,
              locationId: eventLocation.locationId,
              venue: eventLocation.venue,
              eventDate: eventLocation.eventDate,
              startTime: eventLocation.startTime,
              endTime: eventLocation.endTime,
            });
            setShowLocationForm(true);

            // Simulate fetching dates
            const simulateFetchDates = async () => {
              await new Promise(resolve => setTimeout(resolve, 500));
              
              const dates: string[] = locationDates[eventLocation.eventLocationId] || [];
              const dateType = eventLocation.dateType || "";
              setDateType(dateType);
              if (dateType === "M") {
                setMultiDates(dates);
                setRangeStart("");
                setRangeEnd("");
              } else if (dateType === "R") {
                setMultiDates([]);
                setRangeStart(dates[0] || "");
                setRangeEnd(dates[dates.length - 1] || "");
              } else {
                setMultiDates([]);
                setRangeStart("");
                setRangeEnd("");
              }
            };
            
            simulateFetchDates();
          }}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-[var(--brand-secondary)]" />
                <h4 className="font-semibold text-[var(--brand-secondary-dark)]">
                  {eventLocation.locationName}
                </h4>
              </div>
              <p className="text-gray-700 mb-3 whitespace-pre-line">
                {eventLocation.venue}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDateRange(eventLocation)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>
                    {eventLocation.startTime} - {eventLocation.endTime}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 ml-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingLocation(eventLocation);
                  setLocationForm({
                    eventLocationId: eventLocation.eventLocationId,
                    locationId: eventLocation.locationId,
                    venue: eventLocation.venue,
                    eventDate: eventLocation.eventDate,
                    startTime: eventLocation.startTime,
                    endTime: eventLocation.endTime,
                  });
                  setShowLocationForm(true);

                  // Simulate fetching dates
                  const simulateFetchDates = async () => {
                    await new Promise(resolve => setTimeout(resolve, 500));
                    
                    const dates: string[] = locationDates[eventLocation.eventLocationId] || [];
                    const dateType = eventLocation.dateType || "";
                    setDateType(dateType);
                    if (dateType === "M") {
                      setMultiDates(dates);
                      setRangeStart("");
                      setRangeEnd("");
                    } else if (dateType === "R") {
                      setMultiDates([]);
                      setRangeStart(dates[0] || "");
                      setRangeEnd(dates[dates.length - 1] || "");
                    } else {
                      setMultiDates([]);
                      setRangeStart("");
                      setRangeEnd("");
                    }
                  };
                  
                  simulateFetchDates();
                }}
                className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                title="Edit Location"
                type="button"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteEventLocation(eventLocation);
                }}
                disabled={deletingId === eventLocation.eventLocationId}
                className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 cursor-pointer"
                title="Delete Location"
                type="button"
              >
                {deletingId === eventLocation.eventLocationId ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// --- Locations Tab ---
const EventDetailModalLocationsTab: React.FC<{
  event: Event;
  loading: boolean;
  locationForm: EventLocationFormData;
  setLocationForm: React.Dispatch<React.SetStateAction<EventLocationFormData>>;
  eventLocations: EventLocation[];
  availableLocations: Location[];
  editingLocation: EventLocation | null;
  setEditingLocation: React.Dispatch<
    React.SetStateAction<EventLocation | null>
  >;
  showLocationForm: boolean;
  setShowLocationForm: React.Dispatch<React.SetStateAction<boolean>>;
  resetLocationForm: () => void;
  showNotification: (type: "success" | "error", message: string) => void;
  loadEventData: () => Promise<void>;
  dateType: "M" | "R" | "";
  setDateType: React.Dispatch<React.SetStateAction<"M" | "R" | "">>;
  multiDates: string[];
  setMultiDates: React.Dispatch<React.SetStateAction<string[]>>;
  rangeStart: string;
  setRangeStart: React.Dispatch<React.SetStateAction<string>>;
  rangeEnd: string;
  setRangeEnd: React.Dispatch<React.SetStateAction<string>>;
}> = ({
  event,
  loading,
  locationForm,
  setLocationForm,
  eventLocations,
  availableLocations,
  editingLocation,
  setEditingLocation,
  showLocationForm,
  setShowLocationForm,
  resetLocationForm,
  showNotification,
  loadEventData,
  dateType,
  setDateType,
  multiDates,
  setMultiDates,
  rangeStart,
  setRangeStart,
  rangeEnd,
  setRangeEnd,
}) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h3
        className="text-lg font-bold"
        style={{ color: "var(--brand-secondary)" }}
      >
        Event Locations
      </h3>
      <button
        onClick={() => {
          setEditingLocation(null);
          setLocationForm({
            locationId: 0,
            venue: "",
            eventDate: "",
            startTime: "",
            endTime: "",
          });
          setDateType("");
          setMultiDates([]);
          setRangeStart("");
          setRangeEnd("");
          setShowLocationForm(true);
        }}
        type="button"
        className="
    flex items-center gap-2 px-4 py-2 rounded-lg font-semibold cursor-pointer
    transition-all duration-150 ease-in-out
    bg-[var(--brand-secondary)] text-[var(--neutral-white)]
    hover:bg-[var(--brand-secondary-dark)]
    active:scale-95
  "
      >
        <Plus className="w-4 h-4" />
        Add Location
      </button>
    </div>
    {/* Responsive two-column layout: list left, form right */}
    <div className="flex flex-col md:flex-row gap-6">
      {/* Left: Locations List */}
      <div className="md:w-1/2 w-full">
        <EventDetailModalLocationsList
          eventLocations={eventLocations}
          loading={loading}
          setEditingLocation={setEditingLocation}
          setLocationForm={setLocationForm}
          setShowLocationForm={setShowLocationForm}
          showNotification={showNotification}
          loadEventData={loadEventData}
          editingLocation={editingLocation}
          setDateType={setDateType}
          setMultiDates={setMultiDates}
          setRangeStart={setRangeStart}
          setRangeEnd={setRangeEnd}
        />
      </div>
      {/* Right: Edit/Add Location Form */}
      <div className="md:w-1/2 w-full">
        {showLocationForm && (
          <div className="sticky top-6">
            <EventDetailModalLocationForm
              event={event}
              locationForm={locationForm}
              setLocationForm={setLocationForm}
              availableLocations={availableLocations}
              editingLocation={editingLocation}
              resetLocationForm={resetLocationForm}
              showNotification={showNotification}
              loadEventData={loadEventData}
              dateType={dateType}
              setDateType={setDateType}
              multiDates={multiDates}
              setMultiDates={setMultiDates}
              rangeStart={rangeStart}
              setRangeStart={setRangeStart}
              rangeEnd={rangeEnd}
              setRangeEnd={setRangeEnd}
            />
          </div>
        )}
      </div>
    </div>
  </div>
);

// --- Main Modal ---
const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  isOpen,
  onClose,
  onEventUpdated,
}) => {
  const [loading, setLoading] = useState(false);
  const [eventLocations, setEventLocations] = useState<EventLocation[]>([]);
  const [availableLocations, setAvailableLocations] = useState<Location[]>([]);
  const [activeTab, setActiveTab] = useState<"details" | "locations">(
    "details"
  );
  const [editingLocation, setEditingLocation] = useState<EventLocation | null>(
    null
  );
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [notification, setNotification] = useState<NotificationState | null>(
    null
  );
  const [eventImageUrl, setEventImageUrl] = useState<string | null>(null);
  const [dateType, setDateType] = useState<"M" | "R" | "">("");
  const [multiDates, setMultiDates] = useState<string[]>([]);
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");
  const [eventStatusForm, setEventStatusForm] = useState({
    tentativeMonth: "",
    tentativeYear: "",
    certStatus: "false",
    compStatus: "false",
    confStatus: "false",
  });

  const [locationForm, setLocationForm] = useState<EventLocationFormData>({
    locationId: 0,
    venue: "",
    eventDate: "",
    startTime: "",
    endTime: "",
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && event) {
      loadEventData();
    }
    // eslint-disable-next-line
  }, [isOpen, event]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    // Simulate fetching event image
    if (isOpen && event?.activityId) {
      const simulateImageFetch = async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Set dummy image based on activity ID
        const dummyImages = [
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1464207687429-7505649dae38?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80"
        ];
        
        const imageIndex = (event.activityId ?? 0) % dummyImages.length;
        setEventImageUrl(dummyImages[imageIndex]);
      };
      
      simulateImageFetch();
    } else {
      setEventImageUrl(null);
    }
  }, [isOpen, event]);

  const loadEventData = async () => {
    try {
      setLoading(true);
      
      // Simulate API calls with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Use dummy data
      setEventLocations(dummyEventLocations);
      setAvailableLocations(dummyLocations);

      const getMonthNumber = (monthValue: string): string => {
        if (!monthValue) return "1";
        const numericMonth = parseInt(monthValue);
        if (!isNaN(numericMonth) && numericMonth >= 1 && numericMonth <= 12) {
          return numericMonth.toString();
        }
        const month = MONTHS.find(
          (m) => m.label.toLowerCase() === monthValue.toLowerCase()
        );
        return month ? month.value : "1";
      };

      const convertStatusToBooleanString = (status: string): string => {
        return status === "A" || status === "true" ? "true" : "false";
      };

      const initialFormData = {
        tentativeMonth: getMonthNumber(event.tentativeMonth),
        tentativeYear: event.tentativeYear,
        certStatus: convertStatusToBooleanString(event.enableCert || "I"),
        compStatus: convertStatusToBooleanString(event.enableComp || "I"),
        confStatus: convertStatusToBooleanString(event.enableConf || "I"),
      };

      setEventStatusForm(initialFormData);
    } catch (error) {
      setNotification({ type: "error", message: "Failed to load event data" });
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
  };

  const resetLocationForm = () => {
    setLocationForm({
      locationId: 0,
      venue: "",
      eventDate: "",
      startTime: "",
      endTime: "",
    });
    setEditingLocation(null);
    setShowLocationForm(false);
  };

  // --- ADD THIS: Render the details tab content with toggles ---
  const renderDetailsTab = () => (
    <>
      <div className="mb-6">
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
          Description
        </label>
        <div
          className="bg-gray-50 rounded border p-2 text-sm text-gray-700"
          dangerouslySetInnerHTML={{
            __html:
              event.description ||
              '<em class="text-gray-400">No description available</em>',
          }}
        />
      </div>
      {eventImageUrl && (
        <div className="mb-6 flex justify-center">
          <img
            src={eventImageUrl}
            alt="Event"
            className="max-h-64 rounded-lg shadow"
          />
        </div>
      )}
      {/* --- Event Status Toggles --- */}
      <EventDetailModalDetailsTab
        event={event}
        loading={loading}
        eventStatusForm={eventStatusForm}
        setEventStatusForm={setEventStatusForm}
        showNotification={showNotification}
        onEventUpdated={onEventUpdated}
      />
    </>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4"
      style={{ overscrollBehavior: "none" }}
    >
      <motion.div
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.98, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-[1200px] h-[96vh] flex flex-col border border-[var(--brand-primary)] custom-scrollbar overflow-y-auto"
        style={{
          background: "var(--neutral-white)",
        }}
      >
        {/* Header and tabs */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 mr-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-1">
                <Calendar className="w-6 h-6 text-red-600 flex-shrink-0" />
                <span className="truncate">
                  {event.name} - {event.subName}
                </span>
              </h2>
              <p className="text-xs text-gray-400">Event ID: {event.eventId}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors flex-shrink-0"
              title="Close Modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          {notification && (
            <div className="mb-2">
              <EventDetailModalNotification notification={notification} />
            </div>
          )}
          <EventDetailModalTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            eventLocationsCount={eventLocations.length}
          />
        </div>
        <div className="flex-1 min-h-0 p-6">
          {activeTab === "details" && renderDetailsTab()}
          {activeTab === "locations" && (
            <EventDetailModalLocationsTab
              event={event}
              loading={loading}
              locationForm={locationForm}
              setLocationForm={setLocationForm}
              eventLocations={eventLocations}
              availableLocations={availableLocations}
              editingLocation={editingLocation}
              setEditingLocation={setEditingLocation}
              showLocationForm={showLocationForm}
              setShowLocationForm={setShowLocationForm}
              resetLocationForm={resetLocationForm}
              showNotification={showNotification}
              loadEventData={loadEventData}
              dateType={dateType}
              setDateType={setDateType}
              multiDates={multiDates}
              setMultiDates={setMultiDates}
              rangeStart={rangeStart}
              setRangeStart={setRangeStart}
              rangeEnd={rangeEnd}
              setRangeEnd={setRangeEnd}
            />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

function formatEventLocationDates(
  dateType: string | undefined,
  dates: string[] | undefined,
  fallbackDate: string
) {
  if (!dates || dates.length === 0) return fallbackDate;
  const sorted = [...dates].sort();
  if (dateType === "M" && sorted.length > 1) {
    return sorted.join(", ");
  }
  if (dateType === "R" && sorted.length > 1) {
    return `${sorted[0]} - ${sorted[sorted.length - 1]}`;
  }
  return sorted[0];
}

export default EventDetailModal;
