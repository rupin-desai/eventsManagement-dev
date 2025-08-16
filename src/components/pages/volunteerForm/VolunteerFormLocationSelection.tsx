import { MapPin, Loader2 } from "lucide-react";
import type { EventLocation } from "../../../api/locationApi";

interface VolunteerFormLocationSelectionProps {
  currentNomination: { eventLocationId: string };
  eventLocations: EventLocation[];
  loadingLocations: boolean;
  errors: Record<string, string>;
  loadingCurrentUser: boolean;
  loadingEmployeeDetails: boolean;
  onLocationChange: (value: string) => void;
}

const VolunteerFormLocationSelection = ({
  currentNomination,
  eventLocations,
  loadingLocations,
  errors,
  loadingCurrentUser,
  loadingEmployeeDetails,
  onLocationChange
}: VolunteerFormLocationSelectionProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Select Location *
      </label>
      
      {loadingLocations ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-yellow-500" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading locations...</span>
        </div>
      ) : eventLocations.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No locations available for this event</p>
        </div>
      ) : (
        <div className="space-y-2">
          {eventLocations.map((eventLocation) => (
            <label
              key={eventLocation.eventLocationId}
              className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 ${
                currentNomination.eventLocationId === eventLocation.eventLocationId.toString()
                  ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20"
                  : "border-gray-300 dark:border-gray-600"
              }`}
            >
              <input
                type="radio"
                name="eventLocation"
                value={eventLocation.eventLocationId}
                checked={currentNomination.eventLocationId === eventLocation.eventLocationId.toString()}
                onChange={(e) => onLocationChange(e.target.value)}
                className="sr-only"
                disabled={loadingCurrentUser || loadingEmployeeDetails}
              />
              <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                currentNomination.eventLocationId === eventLocation.eventLocationId.toString()
                  ? "border-yellow-500"
                  : "border-gray-300"
              }`}>
                {currentNomination.eventLocationId === eventLocation.eventLocationId.toString() && (
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-yellow-600" />
                <span className="text-gray-900 dark:text-white">
                  {eventLocation.locationName}
                </span>
              </div>
            </label>
          ))}
        </div>
      )}
      
      {errors.eventLocationId && (
        <p className="text-red-500 text-sm mt-1">
          {errors.eventLocationId}
        </p>
      )}
    </div>
  );
};

export default VolunteerFormLocationSelection;