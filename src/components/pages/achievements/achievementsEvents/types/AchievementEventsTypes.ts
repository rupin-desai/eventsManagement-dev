// Dummy ExistingVolunteer type
interface ExistingVolunteer {
  volunteerId: number;
  eventLocationId: number;
  eventLocationName: string;
  employeeId: number;
  employeeName: string;
  employeeEmailId: string;
  employeeDesig: string;
  status: string;
  addedBy: number;
  addedOn: string;
}

// ✅ Enhanced interface to combine volunteer data with event details
export interface VolunteerWithEventDetails extends ExistingVolunteer {
  eventName?: string;
  eventSubName?: string;
  tentativeMonth?: string;
  tentativeYear?: string;
  eventDate?: string;
  startTime?: string;
  endTime?: string;
  eventStime?: string;
  eventEtime?: string;
  venue?: string;
  enableConf?: string;
  enableComp?: string;
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

// ✅ Dummy data for testing
export const dummyVolunteerEvents: VolunteerWithEventDetails[] = [
  {
    volunteerId: 1,
    eventLocationId: 101,
    eventLocationName: "Mumbai",
    employeeId: 1001,
    employeeName: "John Doe",
    employeeEmailId: "john.doe@company.com",
    employeeDesig: "Software Engineer",
    status: "A",
    addedBy: 1,
    addedOn: "2025-06-01",
    eventName: "Tree Plantation Drive",
    eventSubName: "Environmental Initiative",
    tentativeMonth: "6",
    tentativeYear: "2025",
    eventDate: "2025-06-15",
    eventStime: "09:00:00",
    eventEtime: "13:00:00",
    venue: "City Park, Mumbai",
    enableConf: "true",
    enableComp: "true",
    rating: 5,
    detailsLoaded: true,
  },
  {
    volunteerId: 2,
    eventLocationId: 102,
    eventLocationName: "Delhi",
    employeeId: 1001,
    employeeName: "John Doe",
    employeeEmailId: "john.doe@company.com",
    employeeDesig: "Software Engineer",
    status: "A",
    addedBy: 1,
    addedOn: "2025-08-01",
    eventName: "Blood Donation Camp",
    eventSubName: "Health Initiative",
    tentativeMonth: "8",
    tentativeYear: "2025",
    eventDate: "2025-08-10",
    eventStime: "10:00:00",
    eventEtime: "16:00:00",
    venue: "Community Hall, Delhi",
    enableConf: "true",
    enableComp: "false",
    rating: 4,
    detailsLoaded: true,
  },
  {
    volunteerId: 3,
    eventLocationId: 103,
    eventLocationName: "Bangalore",
    employeeId: 1001,
    employeeName: "John Doe",
    employeeEmailId: "john.doe@company.com",
    employeeDesig: "Software Engineer",
    status: "R",
    addedBy: 1,
    addedOn: "2025-09-01",
    eventName: "Community Clean-Up",
    eventSubName: "Community Service",
    tentativeMonth: "9",
    tentativeYear: "2025",
    eventDate: "2025-09-20",
    eventStime: "08:00:00",
    eventEtime: "12:00:00",
    venue: "Local Park, Bangalore",
    enableConf: "true",
    enableComp: "true",
    rating: 0,
    detailsLoaded: true,
  }
];