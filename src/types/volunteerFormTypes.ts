import type { Employee, EmployeeDetails } from "../api/employeeApi";

export interface Nomination {
  id: string;
  type: "alkemite" | "relation"; // <-- Add this line
  empcode?: string;
  employeeId?: number;
  employeeName?: string;
  employeeEmail?: string;
  eventLocationId: number;
  locationName: string;
  addedAt: Date;
  // For relation nominations:
  relationId?: number;
  relationName?: string;
  relationContact?: number;
}

export interface EventDetails {
  eventId: number;
  name: string;
  description: string;
  tentativeMonth: string;
  tentativeYear: string;
}

export interface CurrentUserDetails {
  employeeId: number;
  empcode: string;
  name: string;
  emailId: string;
  mobileNo: string;
  location: string;
  department: string;
  designation: string;
  reportingManager: string;
  dateOfJoining: string;
  grade: string;
  businessUnit: string;
  status: string;
}

export interface UserClaim {
  type: string;
  value: string;
}

// ✅ Updated to use employeeId directly from API response
export interface SelectedEmployeeDetails extends Employee {
  // employeeId is already in Employee interface from API
  fullDetails?: EmployeeDetails; // Made optional since we don't always need full details
}