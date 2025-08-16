// API file for employee-related endpoints

import axios from 'axios';
import type { AxiosResponse } from 'axios';
import { API_BASE_URL, API_CREDENTIALS, API_TIMEOUT } from './config/ApiConfig';
import { attachTokenInterceptor } from './config/attachTokenInterceptor';

// Create axios instance with default configuration
const employeeApiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${btoa(`${API_CREDENTIALS.username}:${API_CREDENTIALS.password}`)}`
  }
});

attachTokenInterceptor(employeeApiClient);

// ✅ Updated Employee interface to match API response
export interface Employee {
  employeeId: number;        // ✅ Now includes employeeId from API
  name: string;
  emailid: string;           // ✅ Note: API uses 'emailid' not 'emailId'
  mobileNo?: string;
  location: string;
  department: string;
  designation: string;
  status: string;
}

export interface EmployeeDetails {
  empcode: string;
  name: string;
  emailId: string;
  designation: string;
  department: string;
  location: string;
  mobileNo?: string;
  reportingManager?: string;
  dateOfJoining?: string;
  grade?: string;
  businessUnit?: string;
}

export interface EmployeeSmileLocation {
  empcode: string;
  locationId: number;
  locationName: string;
  isDefault: boolean;
}

/**
 * Get all active employees with name hint
 * @param hint - Name hint for employee search
 * @returns Promise<AxiosResponse<Employee[]>>
 */
export const getAllActiveEmployees = async (hint: string): Promise<AxiosResponse<Employee[]>> => {
  try {
    const response = await employeeApiClient.get(`Employee/GetAllActiveEmployees?hint=${encodeURIComponent(hint)}`);
    return response;
  } catch (error) {
    console.error('Error fetching active employees:', error);
    throw error;
  }
};

/**
 * Get employee details by employee code
 * @param empcode - Employee code
 * @returns Promise<AxiosResponse<EmployeeDetails>>
 */
export const getEmployeeDetailsById = async (empcode: string): Promise<AxiosResponse<EmployeeDetails>> => {
  try {
    const response = await employeeApiClient.get(`Employee/GetEmployeeDetailsById?empcode=${empcode}`);
    return response;
  } catch (error) {
    console.error('Error fetching employee details:', error);
    throw error;
  }
};

/**
 * Get employee's SMILE locations
 * @param empcode - Employee code
 * @returns Promise<AxiosResponse<EmployeeSmileLocation[]>>
 */
export const getEmployeesSmileLocation = async (empcode: string): Promise<AxiosResponse<EmployeeSmileLocation[]>> => {
  try {
    const response = await employeeApiClient.get(`Employee/GetEmployeesSmileLoc?empcode=${empcode}`);
    return response;
  } catch (error) {
    console.error('Error fetching employee SMILE locations:', error);
    throw error;
  }
};

// Export the configured axios instance for direct use if needed
export { employeeApiClient };

// Export API configuration
export const EMPLOYEE_API_CONFIG = {
  BASE_URL: API_BASE_URL,
  CREDENTIALS: API_CREDENTIALS,
  ENDPOINTS: {
    GET_ALL_ACTIVE_EMPLOYEES: 'Employee/GetAllActiveEmployees',
    GET_EMPLOYEE_DETAILS_BY_ID: 'Employee/GetEmployeeDetailsById',
    GET_EMPLOYEES_SMILE_LOCATION: 'Employee/GetEmployeesSmileLoc'
  }
};