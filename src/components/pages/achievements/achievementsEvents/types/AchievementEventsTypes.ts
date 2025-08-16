import type { ExistingVolunteer } from "../../../../../api/volunteerApi";

// ✅ Enhanced interface to combine volunteer data with event details
export interface VolunteerWithEventDetails extends ExistingVolunteer {
  eventName?: string;
  eventSubName?: string;
  tentativeMonth?: string;
  tentativeYear?: string;
  eventDate?: string;
  startTime?: string;
  endTime?: string;
  eventStime?: string; // <-- Add this line
  eventEtime?: string; // <-- Add this line
  venue?: string;
  enableConf?: string;
  enableComp?: string; // Added enableComp property
  rating?: number;
  detailsLoaded?: boolean;
}

// ✅ Interface for categorized events
export interface CategorizedEvents {
  upcoming: VolunteerWithEventDetails[];
  attended: VolunteerWithEventDetails[];
  other: VolunteerWithEventDetails[];
}

// ✅ Expanded sections state type
export interface ExpandedSections {
  upcoming: boolean;
  attended: boolean;
  other: boolean;
}