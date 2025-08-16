// Dummy Employee type (replaces API type)
export interface Employee {
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

// Dummy EmployeeDetails type (replaces API type)
export interface EmployeeDetails extends Employee {
  address?: string;
  emergencyContact?: string;
  profilePicture?: string;
  skills?: string[];
  certifications?: string[];
}

export interface Nomination {
  id: string;
  type: "alkemite" | "relation";
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

// ✅ Updated to use local Employee interface
export interface SelectedEmployeeDetails extends Employee {
  fullDetails?: EmployeeDetails; // Made optional since we don't always need full details
}

// Dummy data for testing
export const dummyEmployees: Employee[] = [
  {
    employeeId: 1001,
    empcode: "EMP001",
    name: "John Doe",
    emailId: "john.doe@company.com",
    mobileNo: "9876543210",
    location: "Mumbai",
    department: "IT",
    designation: "Software Engineer",
    reportingManager: "Jane Smith",
    dateOfJoining: "2023-01-15",
    grade: "E2",
    businessUnit: "Technology",
    status: "Active"
  },
  {
    employeeId: 1002,
    empcode: "EMP002",
    name: "Jane Smith",
    emailId: "jane.smith@company.com",
    mobileNo: "9876543211",
    location: "Delhi",
    department: "HR",
    designation: "HR Manager",
    reportingManager: "Mike Johnson",
    dateOfJoining: "2022-03-10",
    grade: "M1",
    businessUnit: "Human Resources",
    status: "Active"
  },
  {
    employeeId: 1003,
    empcode: "EMP003",
    name: "Mike Johnson",
    emailId: "mike.johnson@company.com",
    mobileNo: "9876543212",
    location: "Bangalore",
    department: "Finance",
    designation: "Finance Director",
    reportingManager: "Sarah Wilson",
    dateOfJoining: "2021-05-20",
    grade: "D1",
    businessUnit: "Finance",
    status: "Active"
  }
];

export const dummyCurrentUser: CurrentUserDetails = {
  employeeId: 1001,
  empcode: "EMP001",
  name: "John Doe",
  emailId: "john.doe@company.com",
  mobileNo: "9876543210",
  location: "Mumbai",
  department: "IT",
  designation: "Software Engineer",
  reportingManager: "Jane Smith",
  dateOfJoining: "2023-01-15",
  grade: "E2",
  businessUnit: "Technology",
  status: "Active"
};