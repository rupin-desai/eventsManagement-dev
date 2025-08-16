// Admin API file for event management

import axios from 'axios';
import type { AxiosResponse } from 'axios';
import { API_BASE_URL, API_CREDENTIALS } from '../config/ApiConfig';
import { attachTokenInterceptor } from '../config/attachTokenInterceptor';

const activityAdminApiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${btoa(`${API_CREDENTIALS.username}:${API_CREDENTIALS.password}`)}`
  }
});
attachTokenInterceptor(activityAdminApiClient);

// Type definitions
export interface CreateEventRequest {
  activityId: number;
  tentativeMonth: string;
  tentativeYear: string;
  addedBy: number;
  eventLocations: EventLocationRequest[];
}

export interface EventLocationRequest {
  locationId: string;
}

export interface UpdateEventStatusRequest {
  eventId: number;
  tentativeYear: string;
  tentativeMonth: string;
  certStatus: string;    // ✅ Now accepts "true" or "false"
  compStatus: string;    // ✅ Now accepts "true" or "false"
  confStatus: string;    // ✅ Now accepts "true" or "false"
}

export interface DeleteEventRequest {
  eventId: number;
}

export interface EventLocationDate {
  date: string; // "YYYY-MM-DD"
}

// ✅ Updated interfaces to match the API format (string instead of objects)
export interface CreateEventLocationRequest {
  eventLocationId?: number; // Optional for create
  eventId: number;
  locationId: number;
  locationName: string;
  eventDate: string;      // ✅ Changed to string format "YYYY-MM-DD"
  startTime: string;      // ✅ Changed to string format "HH:MM:SS"
  endTime: string;        // ✅ Changed to string format "HH:MM:SS"
  venue: string;
  datetype?: "M" | "R" | ""; // "M"=multiple, "R"=range, ""=single
  eventLocationDates?: EventLocationDate[];
}

export interface UpdateEventLocationRequest {
  eventLocationId: number;
  venue: string;
  eventDate: string;      // ✅ Changed to string format "YYYY-MM-DD"
  startTime: string;      // ✅ Changed to string format "HH:MM:SS"
  endTime: string;        // ✅ Changed to string format "HH:MM:SS"
  dateType?: "M" | "R" | "S" | ""; // "M"=multiple, "R"=range, "S"=single
}

export interface DeleteEventLocationRequest {
  eventLocationId: number;
}

// ✅ Updated helper functions to format strings correctly
export const formatEventDate = (dateString: string): string => {
  if (!dateString) return '';
  
  // Ensure the date is in YYYY-MM-DD format
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    console.warn('Invalid date:', dateString);
    return dateString;
  }
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

export const formatEventTime = (timeString: string): string => {
  if (!timeString) return '';
  
  // Convert HH:MM to HH:MM:SS format
  const timeParts = timeString.split(':');
  
  if (timeParts.length === 2) {
    // Add seconds if missing
    return `${timeParts[0].padStart(2, '0')}:${timeParts[1].padStart(2, '0')}:00`;
  } else if (timeParts.length === 3) {
    // Already has seconds
    return `${timeParts[0].padStart(2, '0')}:${timeParts[1].padStart(2, '0')}:${timeParts[2].padStart(2, '0')}`;
  }
  
  console.warn('Invalid time format:', timeString);
  return timeString;
};

// ✅ Helper function to format time for display (HH:MM)
export const formatTimeForDisplay = (timeString: string): string => {
  if (!timeString) return '';
  
  // Extract HH:MM from HH:MM:SS
  const timeParts = timeString.split(':');
  if (timeParts.length >= 2) {
    return `${timeParts[0].padStart(2, '0')}:${timeParts[1].padStart(2, '0')}`;
  }
  
  return timeString;
};

/**
 * Create a new event
 * @param eventData - Event creation data
 * @returns Promise<AxiosResponse<any>>
 */
export const createEvent = async (eventData: CreateEventRequest): Promise<AxiosResponse<any>> => {
  try {
    const response = await activityAdminApiClient.post('Event/CreateEvent', eventData);
    return response;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

/**
 * Update event status
 * @param statusData - Event status update data
 * @returns Promise<AxiosResponse<any>>
 */
export const updateEventStatus = async (statusData: UpdateEventStatusRequest): Promise<AxiosResponse<any>> => {
  try {
    const response = await activityAdminApiClient.post('Event/UpdateEventStatus', statusData);
    return response;
  } catch (error) {
    console.error('Error updating event status:', error);
    throw error;
  }
};

/**
 * Delete an event
 * @param deleteData - Event deletion data
 * @returns Promise<AxiosResponse<any>>
 */
export const deleteEvent = async (deleteData: DeleteEventRequest): Promise<AxiosResponse<any>> => {
  try {
    const response = await activityAdminApiClient.post('Event/DeleteEvent', deleteData);
    return response;
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

/**
 * ✅ Create a new event location with string format
 * @param locationData - Event location creation data
 * @returns Promise<AxiosResponse<any>>
 */
export const createEventLocation = async (locationData: CreateEventLocationRequest): Promise<AxiosResponse<any>> => {
  try {
    console.log('Creating event location with payload:', JSON.stringify(locationData, null, 2));
    const response = await activityAdminApiClient.post('EventLocation/CreateEventLocation', locationData);
    return response;
  } catch (error) {
    console.error('Error creating event location:', error);
    throw error;
  }
};

/**
 * ✅ Update an event location with string format
 * @param locationData - Event location update data
 * @returns Promise<AxiosResponse<any>>
 */
export const updateEventLocation = async (locationData: UpdateEventLocationRequest): Promise<AxiosResponse<any>> => {
  try {
    // ✅ Log the payload for debugging
    console.log('Updating event location with payload:', JSON.stringify(locationData, null, 2));
    
    const response = await activityAdminApiClient.post('EventLocation/UpdateEventLocation', locationData);
    return response;
  } catch (error) {
    console.error('Error updating event location:', error);
    throw error;
  }
};

/**
 * ✅ Delete an event location
 * @param deleteData - Event location deletion data
 * @returns Promise<AxiosResponse<any>>
 */
export const deleteEventLocation = async (deleteData: DeleteEventLocationRequest): Promise<AxiosResponse<any>> => {
  try {
    const response = await activityAdminApiClient.post('EventLocation/DeleteEventLocation', deleteData);
    return response;
  } catch (error) {
    console.error('Error deleting event location:', error);
    throw error;
  }
};

// Export the configured axios instance for direct use if needed
export { activityAdminApiClient };

// Export API configuration
export const EVENT_ADMIN_API_CONFIG = {
  BASE_URL: API_BASE_URL,
  CREDENTIALS: API_CREDENTIALS,
  ENDPOINTS: {
    CREATE_EVENT: 'Event/CreateEvent',
    UPDATE_EVENT_STATUS: 'Event/UpdateEventStatus',
    DELETE_EVENT: 'Event/DeleteEvent',
    CREATE_EVENT_LOCATION: 'EventLocation/CreateEventLocation',
    UPDATE_EVENT_LOCATION: 'EventLocation/UpdateEventLocation',
    DELETE_EVENT_LOCATION: 'EventLocation/DeleteEventLocation'
  }
};