// API file for volunteer-related endpoints

import axios from 'axios';
import type { AxiosResponse } from 'axios';
import { API_BASE_URL, API_CREDENTIALS, API_TIMEOUT } from './config/ApiConfig';
import { attachTokenInterceptor } from './config/attachTokenInterceptor';

// Create axios instance with default configuration
const volunteerApiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${btoa(`${API_CREDENTIALS.username}:${API_CREDENTIALS.password}`)}`
  }
});

// Attach token interceptor
attachTokenInterceptor(volunteerApiClient);

export interface CreateVolunteerRequest {
  eventId: number;
  addedBy: number;
  volunteers: {
    eventlocationId: number;
    employeeId: number;
  }[];
}

// ✅ Updated interface to match actual API response
export interface ExistingVolunteer {
  volunteerId: number;
  eventLocationId: number;
  eventLocationName: string;  // ✅ Correct field name from API
  employeeId: number;
  employeeName: string;
  employeeEmailId: string;    // ✅ Correct field name from API
  employeeDesig: string;      // ✅ Added designation field
  status: string;
  addedBy: number;
  addedOn: string;            // ✅ Correct field name from API
}

// ✅ Interface for volunteer status check
export interface VolunteerExistsResponse {
  exists: boolean;
  volunteerId?: number;
  message?: string;
}

// ✅ Interface for certificates
export interface Certificate {
  certificateId: number;
  employeeId: string;
  eventId: number;
  eventName: string;
  certificateUrl: string;
  issuedDate: string;
  status: string;
}

// ✅ Interface for volunteer status
export interface VolunteerStatus {
  employeeId: string;
  totalEvents: number;
  activeVolunteering: number;
  completedEvents: number;
  certificates: number;
  status: string;
}

// ✅ Interface for pending confirmations
export interface PendingConfirmation {
  confirmationId: number;
  employeeId: string;
  eventId: number;
  eventName: string;
  locationName: string;
  eventDate: string;
  status: string;
  requestedDate: string;
}

// ✅ Add new interface for upcoming volunteer events
export interface UpcomingVolunteerEvent {
  volunteerId: number;
  eventId: number;
  eventName: string;
  eventSubName?: string;
  eventLocationId: number;
  eventLocationName: string;
  eventDate: string;
  startTime?: string;
  endTime?: string;
  venue?: string;
  status: string;
  addedOn: string;
  tentativeMonth?: string;
  tentativeYear?: string;
}

// ✅ NEW: Interface for volunteer details by volunteer ID
export interface VolunteerDetails {
  volunteerId: number;
  employees: any; // Usually null in response
  employeeId: number;
  csrEvents: any; // Usually null in response
  eventId: number;
  eventLocations: any; // Usually null in response
  eventLocationId: number;
  status: string;
  addedOn: string;
  addedBy: number;
  nomiStatus: string;
  confStatus: string;
  certStatus: string;
  rating: number;
  volunteerTracks: any; // Usually null in response
}

// ✅ Updated interface for volunteer status - this might return volunteer events
export interface MyVolunteerStatusResponse {
  employeeId: string;
  totalEvents: number;
  activeVolunteering: number;
  completedEvents: number;
  certificates: number;
  status: string;
  volunteerEvents?: VolunteerWithEventInfo[]; // This might contain the actual events
}

// ✅ Interface for volunteer events from status API
export interface VolunteerWithEventInfo {
  volunteerId: number;
  eventId: number;
  eventName: string;
  eventSubName?: string;
  eventLocationId: number;
  eventLocationName: string;
  eventDate?: string;
  startTime?: string;
  endTime?: string;
  venue?: string;
  status: string;
  addedOn: string;
  addedBy: number;
  tentativeMonth?: string;
  tentativeYear?: string;
  enableConf?: string;
  rating?: number;
}

// Add near the other interfaces
export interface Volunteer {
  volunteerId: number;
  eventLocationId: number;
  eventLocationName: string;
  employeeId: number;
  employeeName: string;
  status: string;
  addedBy: number;
  addedOn: string;
}

/**
 * Create new volunteer nominations
 * @param volunteerData - Volunteer creation data
 * @returns Promise<AxiosResponse<any>>
 */
export const createVolunteer = async (volunteerData: CreateVolunteerRequest): Promise<AxiosResponse<any>> => {
  try {
    const response = await volunteerApiClient.post('Volunteer/CreateVolunteer', volunteerData);
    return response;
  } catch (error) {
    console.error('Error creating volunteer:', error);
    throw error;
  }
};

/**
 * Get volunteers by self and event
 * @param eventId - Event ID
 * @param addedBy - User ID who added the volunteers
 * @returns Promise<AxiosResponse<ExistingVolunteer[]>>
 */
export const getVolunteersBySelfNEvent = async (eventId: number, addedBy: number): Promise<AxiosResponse<ExistingVolunteer[]>> => {
  try {
    const response = await volunteerApiClient.get(`Volunteer/GetVolunteersBySelfNEvent?EventId=${eventId}&AddedBy=${addedBy}`);
    return response;
  } catch (error) {
    console.error('Error fetching volunteers by self and event:', error);
    throw error;
  }
};

/**
 * ✅ Get volunteers by self and event (alternative name for tests)
 * @param eventId - Event ID
 * @param employeeId - Employee ID who added the volunteers
 * @returns Promise<AxiosResponse<ExistingVolunteer[]>>
 */
export const getVolunteersBySelfAndEvent = async (eventId: number, employeeId: string): Promise<AxiosResponse<ExistingVolunteer[]>> => {
  try {
    const response = await volunteerApiClient.get(`Volunteer/GetVolunteersBySelfNEvent?EventId=${eventId}&AddedBy=${employeeId}`);
    return response;
  } catch (error) {
    console.error('Error fetching volunteers by self and event:', error);
    throw error;
  }
};

/**
 * ✅ Check if volunteer exists for event location
 * @param eventLocationId - Event Location ID
 * @param employeeId - Employee ID
 * @returns Promise<AxiosResponse<VolunteerExistsResponse>>
 */
export const checkVolunteerExists = async (eventLocationId: number, employeeId: string): Promise<AxiosResponse<VolunteerExistsResponse>> => {
  try {
    const response = await volunteerApiClient.get(`Volunteer/CheckVolunteerExists?eventLocationId=${eventLocationId}&employeeId=${employeeId}`);
    return response;
  } catch (error) {
    console.error('Error checking volunteer exists:', error);
    throw error;
  }
};

/**
 * ✅ Get my certificates
 * @param employeeId - Employee ID
 * @returns Promise<AxiosResponse<Certificate[]>>
 */
export const getMyCertificates = async (employeeId: string): Promise<AxiosResponse<Certificate[]>> => {
  try {
    const response = await volunteerApiClient.get(`Volunteer/GetMyCertificates?employeeId=${employeeId}`);
    return response;
  } catch (error) {
    console.error('Error fetching my certificates:', error);
    throw error;
  }
};

/**
 * ✅ Get my volunteer status and events - UPDATED
 * @param employeeId - Employee ID
 * @returns Promise<AxiosResponse<any>>
 */
export const getMyVolunteerStatus = async (employeeId: string): Promise<AxiosResponse<any>> => {
  try {
    const response = await volunteerApiClient.get(`Volunteer/GetMyVolunteerStatus?employeeId=${employeeId}`);
    return response;
  } catch (error) {
    console.error('Error fetching my volunteer status:', error);
    throw error;
  }
};

/**
 * ✅ Get pending confirmations by employee ID
 * @param employeeId - Employee ID
 * @returns Promise<AxiosResponse<PendingConfirmation[]>>
 */
export const getPendingConfirmationsByEmpId = async (employeeId: string): Promise<AxiosResponse<PendingConfirmation[]>> => {
  try {
    const response = await volunteerApiClient.get(`Volunteer/GetPendingConfByEmpId?employeeId=${employeeId}`);
    return response;
  } catch (error) {
    console.error('Error fetching pending confirmations:', error);
    throw error;
  }
};

/**
 * ✅ Get upcoming volunteer events by employee ID
 * @param employeeId - Employee ID
 * @returns Promise<AxiosResponse<UpcomingVolunteerEvent[]>>
 */
export const getUpcomingVolunteerEvents = async (employeeId: string): Promise<AxiosResponse<UpcomingVolunteerEvent[]>> => {
  try {
    const response = await volunteerApiClient.get(`Volunteer/GetUpcomingVolunteerEvents?employeeId=${employeeId}`);
    return response;
  } catch (error) {
    console.error('Error fetching upcoming volunteer events:', error);
    throw error;
  }
};

/**
 * ✅ Get all volunteer events by employee ID (including past and upcoming)
 * @param employeeId - Employee ID
 * @returns Promise<AxiosResponse<UpcomingVolunteerEvent[]>>
 */
export const getAllVolunteerEventsByEmployeeId = async (employeeId: string): Promise<AxiosResponse<UpcomingVolunteerEvent[]>> => {
  try {
    const response = await volunteerApiClient.get(`Volunteer/GetAllVolunteerEventsByEmployeeId?employeeId=${employeeId}`);
    return response;
  } catch (error) {
    console.error('Error fetching all volunteer events by employee ID:', error);
    throw error;
  }
};

/**
 * ✅ NEW: Get volunteer details by volunteer ID
 * @param volunteerId - Volunteer ID
 * @returns Promise<AxiosResponse<VolunteerDetails>>
 */
export const getVolunteerDetailsByVId = async (volunteerId: number): Promise<AxiosResponse<VolunteerDetails>> => {
  try {
    const response = await volunteerApiClient.get(`Volunteer/GetVolunteerDetailsByVId?volunteerId=${volunteerId}`);
    return response;
  } catch (error) {
    console.error('Error fetching volunteer details by volunteer ID:', error);
    throw error;
  }
};

/**
 * ✅ NEW: Update volunteer rating
 * @param volunteerId - Volunteer ID
 * @param rating - Rating value (1-5)
 * @returns Promise<AxiosResponse<any>>
 */
export const updateVolunteerRating = async (volunteerId: number, rating: number): Promise<AxiosResponse<any>> => {
  try {
    const response = await volunteerApiClient.post(`Volunteer/UpdateVolunteerRating?volunteerId=${volunteerId}&rating=${rating}`);
    return response;
  } catch (error) {
    console.error('Error updating volunteer rating:', error);
    throw error;
  }
};

/**
 * Get all volunteers for an event by EventId
 * @param eventId - Event ID
 * @returns Promise<AxiosResponse<Volunteer[]>>
 */
export const getVolunteersByEventId = async (eventId: number): Promise<AxiosResponse<Volunteer[]>> => {
  try {
    const response = await volunteerApiClient.get(`Volunteer/GetVolunteersByEventId?EventId=${eventId}`);
    return response;
  } catch (error) {
    console.error('Error fetching volunteers by event ID:', error);
    throw error;
  }
};

// Export the configured axios instance for direct use if needed
export { volunteerApiClient };

// Export API configuration
export const VOLUNTEER_API_CONFIG = {
  BASE_URL: API_BASE_URL,
  CREDENTIALS: API_CREDENTIALS,
  ENDPOINTS: {
    CREATE_VOLUNTEER: 'Volunteer/CreateVolunteer',
    GET_VOLUNTEERS_BY_SELF_AND_EVENT: 'Volunteer/GetVolunteersBySelfNEvent',
    CHECK_VOLUNTEER_EXISTS: 'Volunteer/CheckVolunteerExists',
    GET_MY_CERTIFICATES: 'Volunteer/GetMyCertificates',
    GET_MY_VOLUNTEER_STATUS: 'Volunteer/GetMyVolunteerStatus',
    GET_PENDING_CONFIRMATIONS_BY_EMP_ID: 'Volunteer/GetPendingConfByEmpId',
    GET_UPCOMING_VOLUNTEER_EVENTS: 'Volunteer/GetUpcomingVolunteerEvents',
    GET_ALL_VOLUNTEER_EVENTS_BY_EMPLOYEE_ID: 'Volunteer/GetAllVolunteerEventsByEmployeeId',
    GET_VOLUNTEER_DETAILS_BY_VID: 'Volunteer/GetVolunteerDetailsByVId',
    UPDATE_VOLUNTEER_RATING: 'Volunteer/UpdateVolunteerRating' // ✅ NEW endpoint
  }
};