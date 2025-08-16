// Admin API file for event location management

import axios from 'axios';
import type { AxiosResponse } from 'axios';
import { API_BASE_URL, API_CREDENTIALS } from '../config/ApiConfig';
import { attachTokenInterceptor } from '../config/attachTokenInterceptor';

// Create axios instance with default configuration
const eventLocationAdminApiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${btoa(`${API_CREDENTIALS.username}:${API_CREDENTIALS.password}`)}`
  }
});
attachTokenInterceptor(eventLocationAdminApiClient);

// Type definitions
export interface EventDate {
  year: number;
  month: number;
  day: number;
  dayOfWeek: number;
}

export interface EventTime {
  hour: number;
  minute: number;
}

export interface CreateEventLocationRequest {
  eventId: number;
  locationId: number;
  venue: string;
  eventDate: EventDate;
  startTime: EventTime;
  endTime: EventTime;
}

export interface UpdateEventLocationRequest {
  eventLocationId: number;
  venue: string;
  eventDate: EventDate;
  startTime: EventTime;
  endTime: EventTime;
}

/**
 * Create event location
 * @param eventLocationData - Event location creation data
 * @returns Promise<AxiosResponse>
 */
export const createEventLocation = async (eventLocationData: CreateEventLocationRequest): Promise<AxiosResponse> => {
  try {
    const response = await eventLocationAdminApiClient.post('EventLocation/CreateEventLocation', eventLocationData);
    return response;
  } catch (error) {
    console.error('Error creating event location:', error);
    throw error;
  }
};

/**
 * Update event location
 * @param eventLocationData - Event location update data
 * @returns Promise<AxiosResponse>
 */
export const updateEventLocation = async (eventLocationData: UpdateEventLocationRequest): Promise<AxiosResponse> => {
  try {
    const response = await eventLocationAdminApiClient.post('EventLocation/UpdateEventLocation', eventLocationData);
    return response;
  } catch (error) {
    console.error('Error updating event location:', error);
    throw error;
  }
};

/**
 * Delete event location
 * @param eventLocationId - Event location ID
 * @returns Promise<AxiosResponse>
 */
export const deleteEventLocation = async (eventLocationId: number): Promise<AxiosResponse> => {
  try {
    const response = await eventLocationAdminApiClient.delete(`EventLocation/DeleteEventLocation?eventLocationId=${eventLocationId}`);
    return response;
  } catch (error) {
    console.error('Error deleting event location:', error);
    throw error;
  }
};

// Export the configured axios instance for direct use if needed
export { eventLocationAdminApiClient };

// Export API configuration
export const EVENT_LOCATION_ADMIN_API_CONFIG = {
  BASE_URL: API_BASE_URL,
  CREDENTIALS: API_CREDENTIALS,
  ENDPOINTS: {
    CREATE_EVENT_LOCATION: 'EventLocation/CreateEventLocation',
    UPDATE_EVENT_LOCATION: 'EventLocation/UpdateEventLocation',
    DELETE_EVENT_LOCATION: 'EventLocation/DeleteEventLocation'
  }
};