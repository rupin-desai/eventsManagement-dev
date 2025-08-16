import React from 'react';
import { motion } from 'framer-motion';
import { Save, X, Loader2, Plus, X as XIcon } from 'lucide-react';
import type { Activity } from '../../../../api/activityApi';
import type { Location } from '../../../../api/locationApi';

interface EventFormData {
  activityId: number;
  tentativeMonth: string;
  tentativeYear: string;
  selectedLocations: string[];
}

interface AdminEventsCreateFormProps {
  isOpen: boolean;
  formData: EventFormData;
  setFormData: React.Dispatch<React.SetStateAction<EventFormData>>;
  activities: Activity[];
  locations: Location[];
  formLoading: boolean;
  onSubmit: () => void;
  onClose: () => void;
  onLocationToggle: (locationId: string) => void;
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

const AdminEventsCreateForm: React.FC<AdminEventsCreateFormProps> = ({
  isOpen,
  formData,
  setFormData,
  activities,
  locations,
  formLoading,
  onSubmit,
  onClose,
  onLocationToggle,
}) => {
  if (!isOpen) return null;

  // --- Disable background scroll when modal is open ---
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // --- Location search state ---
  const [locationSearch, setLocationSearch] = React.useState("");
  const [locationResults, setLocationResults] = React.useState<Location[]>([]);

  // Show search results as we type
  React.useEffect(() => {
    if (locationSearch.trim() === "") {
      setLocationResults([]);
      return;
    }
    const results = locations.filter((loc) =>
      loc.locationName.toLowerCase().includes(locationSearch.trim().toLowerCase())
    );
    setLocationResults(results);
  }, [locationSearch, locations]);

  // Add location to selected
  const handleSelectLocation = (loc: Location) => {
    if (!formData.selectedLocations.includes(loc.locationId.toString())) {
      setFormData({
        ...formData,
        selectedLocations: [...formData.selectedLocations, loc.locationId.toString()],
      });
    }
    setLocationSearch("");
    setLocationResults([]);
  };

  // Remove location from selected
  const handleRemoveLocation = (id: string) => {
    setFormData({
      ...formData,
      selectedLocations: formData.selectedLocations.filter((l) => l !== id),
    });
  };

  // Get selected location objects for display
  const selectedLocationObjs = locations.filter(loc =>
    formData.selectedLocations.includes(loc.locationId.toString())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4"
      style={{ overscrollBehavior: "none" }}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[95vh] overflow-hidden flex flex-col"
        style={{
          background: "var(--neutral-white)",
        }}
      >
        <div
          className="p-4 sm:p-6 border-b"
          style={{ borderColor: "var(--brand-primary)" }}
        >
          <div className="flex items-center justify-between">
            <h2
              className="text-lg sm:text-xl font-bold"
              style={{ color: "var(--brand-secondary)" }}
            >
              Create New Event
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 cursor-pointer hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Activity Selection */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--brand-secondary-dark)' }}>
                  Activity *
                </label>
                <select
                  value={formData.activityId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      activityId: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--brand-secondary)] focus:border-transparent cursor-pointer"
                  style={{
                    borderColor: 'var(--brand-primary)',
                    background: 'var(--neutral-white)',
                    color: 'var(--brand-secondary-dark)',
                  }}
                >
                  <option value={0}>Select an activity</option>
                  {activities.map((activity) => (
                    <option
                      key={activity.activityId}
                      value={activity.activityId}
                    >
                      {activity.name} - {activity.subName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tentative Month */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--brand-secondary-dark)' }}>
                  Tentative Month *
                </label>
                <select
                  value={formData.tentativeMonth}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tentativeMonth: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--brand-secondary)] focus:border-transparent cursor-pointer"
                  style={{
                    borderColor: 'var(--brand-primary)',
                    background: 'var(--neutral-white)',
                    color: 'var(--brand-secondary-dark)',
                  }}
                >
                  <option value="">Select a month</option>
                  {MONTHS.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tentative Year */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--brand-secondary-dark)' }}>
                  Tentative Year *
                </label>
                <select
                  value={formData.tentativeYear}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tentativeYear: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--brand-secondary)] focus:border-transparent cursor-pointer"
                  style={{
                    borderColor: 'var(--brand-primary)',
                    background: 'var(--neutral-white)',
                    color: 'var(--brand-secondary-dark)',
                  }}
                >
                  {Array.from({ length: 5 }, (_, i) => {
                    const year = new Date().getFullYear() + i;
                    return (
                      <option key={year} value={year.toString()}>
                        {year}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Location Selection with Search */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--brand-secondary-dark)' }}>
                  Locations * (Select one or more)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--brand-secondary)] focus:border-transparent"
                    placeholder="Search location..."
                  />
                </div>
                {/* Search Results */}
                {locationResults.length > 0 && (
                  <div className="border rounded bg-white shadow p-2 mb-2 max-h-40 overflow-y-auto">
                    {locationResults.map((loc) => (
                      <div
                        key={loc.locationId}
                        className="flex items-center justify-between py-1 px-2 hover:bg-gray-100 rounded cursor-pointer"
                        onClick={() => handleSelectLocation(loc)}
                      >
                        <span>{loc.locationName}</span>
                        <Plus className="w-4 h-4 text-green-600" />
                      </div>
                    ))}
                  </div>
                )}
                {/* Selected Locations */}
                {selectedLocationObjs.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedLocationObjs.map((loc) => (
                      <span
                        key={loc.locationId}
                        className="flex items-center bg-[var(--brand-primary-light)] text-[var(--brand-secondary-dark)] px-3 py-1 rounded-full text-xs"
                      >
                        {loc.locationName}
                        <button
                          type="button"
                          onClick={() => handleRemoveLocation(loc.locationId.toString())}
                          className="ml-1 text-red-500 hover:text-red-700"
                          title="Remove"
                        >
                          <XIcon className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                {/* All Locations List (checkboxes) */}
                <div
                  className="max-h-40 overflow-y-auto border rounded-lg p-3 space-y-2 custom-scrollbar bg-[var(--neutral-gray-50)] mt-2"
                  style={{ borderColor: 'var(--brand-primary)' }}
                >
                  {locations.map((location) => (
                    <label
                      key={location.locationId}
                      className="flex items-center cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.selectedLocations.includes(
                          location.locationId.toString()
                        )}
                        onChange={() =>
                          onLocationToggle(location.locationId.toString())
                        }
                        className="mr-2 accent-[var(--brand-primary)] cursor-pointer"
                      />
                      <span className="text-sm" style={{ color: 'var(--brand-secondary-dark)' }}>
                        {location.locationName}
                      </span>
                    </label>
                  ))}
                </div>
                <p className="text-xs mt-1" style={{ color: 'var(--brand-secondary)' }}>
                  Selected: {formData.selectedLocations.length} location(s)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div
          className="p-4 sm:p-6 border-t"
          style={{
            background: "var(--brand-primary-light)",
            borderColor: "var(--brand-primary)",
          }}
        >
          <div className="flex flex-row justify-end gap-2 sm:gap-3">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none min-w-0 px-3 py-2 sm:px-4 sm:py-2 cursor-pointer text-[var(--brand-secondary-dark)] border rounded-lg hover:bg-[var(--brand-primary)] transition-colors text-center text-base sm:text-left"
              style={{ borderColor: "var(--brand-primary)", fontSize: "1rem" }}
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              disabled={formLoading}
              className="flex-1 sm:flex-none min-w-0 flex items-center justify-center cursor-pointer gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-colors text-center text-base sm:text-left"
              style={{
                background: "var(--brand-secondary)",
                color: "var(--neutral-white)",
                opacity: formLoading ? 0.7 : 1,
                fontSize: "1rem",
              }}
            >
              {formLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {formLoading ? "Creating..." : "Create Event"}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminEventsCreateForm;