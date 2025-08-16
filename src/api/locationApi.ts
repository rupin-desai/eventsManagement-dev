// API file for location-related endpoints

import axios from 'axios';
import type { AxiosResponse } from 'axios';
import { API_BASE_URL, API_CREDENTIALS, API_TIMEOUT } from './config/ApiConfig';
import { attachTokenInterceptor } from './config/attachTokenInterceptor';

const locationApiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${btoa(`${API_CREDENTIALS.username}:${API_CREDENTIALS.password}`)}`
  }
});

attachTokenInterceptor(locationApiClient);

// Type definitions
export interface Location {
  locationId: number;
  locationName: string;
}

export interface EventLocationDate {
  date: string;
}

export interface EventLocation {
  eventLocationId: number;
  eventId: number;
  locationId: number;
  locationName: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  venue: string;
  status?: string;
  dateType?: "M" | "R" | ""; // <-- use dateType
}

/**
 * Get all locations
 * @returns Promise<AxiosResponse<Location[]>>
 */
export const getLocations = async (): Promise<AxiosResponse<Location[]>> => {
  try {
    const response = await locationApiClient.get('Location/GetLocations');
    return response;
  } catch (error) {
    console.error('Error fetching locations:', error);
    throw error;
  }
};

/**
 * Get event locations by event ID
 * @param eventId - The event ID
 * @returns Promise<AxiosResponse<EventLocation[]>>
 */
export const getEventLocationsByEventId = async (eventId: number): Promise<AxiosResponse<EventLocation[]>> => {
  try {
    const response = await locationApiClient.get(`EventLocation/GetEventLocationsByEventId?eventId=${eventId}`);
    return response;
  } catch (error) {
    console.error('Error fetching event locations by event ID:', error);
    throw error;
  }
};

/**
 * Get event locations by activity ID
 * @param activityId - The activity ID
 * @returns Promise<AxiosResponse<EventLocation[]>>
 */
export const getEventLocationsByActivityId = async (activityId: number): Promise<AxiosResponse<EventLocation[]>> => {
  try {
    const response = await locationApiClient.get(`EventLocation/GetEventLocationsByActivityId?activityId=${activityId}`);
    return response;
  } catch (error) {
    console.error('Error fetching event locations by activity ID:', error);
    throw error;
  }
};

// --- VolRelation Endpoints ---

/**
 * Get related volunteers by self and event
 */
export const getRelVolunteersBySelfNEvent = async (
  employeeId: number,
  eventId: number
): Promise<AxiosResponse<any>> => {
  try {
    const response = await locationApiClient.get(
      `/VolRelation/GetRelVolunteersBySelfNEvent`,
      {
        params: { employeeId, eventId },
        headers: { accept: "text/plain" }
      }
    );
    return response;
  } catch (error) {
    console.error('Error fetching related volunteers by self and event:', error);
    throw error;
  }
};

/**
 * Get related volunteers by eventId
 */
export const getRelVolunteersByEventId = async (
  eventId: number
): Promise<AxiosResponse<any>> => {
  try {
    const response = await locationApiClient.get(
      `/VolRelation/GetRelVolunteersByEventId`,
      {
        params: { eventId },
        headers: { accept: "text/plain" }
      }
    );
    return response;
  } catch (error) {
    console.error('Error fetching related volunteers by eventId:', error);
    throw error;
  }
};

// --- EventLocationDate Endpoints ---

export interface CreateEventLocationDateRequest {
  eventLocationId: number;
  createEventLocationDates: {
    date: string; // <-- "YYYY-MM-DD"
  }[];
}

/**
 * Create event location dates
 */
export const createEventLocationDate = async (
  data: CreateEventLocationDateRequest
): Promise<AxiosResponse<any>> => {
  try {
    const response = await locationApiClient.post(
      `/EventLocationDate/CreateEventLocationDate`,
      data,
      {
        headers: {
          accept: "*/*",
          "Content-Type": "application/json"
        }
      }
    );
    return response;
  } catch (error) {
    console.error('Error creating event location date:', error);
    throw error;
  }
};

/**
 * Delete event location date
 */
export const deleteEventLocationDate = async (
  eventLocationDateId: number
): Promise<AxiosResponse<any>> => {
  try {
    const response = await locationApiClient.post(
      `/EventLocationDate/DeleteEventLocationDate`,
      { eventLocationDateId },
      {
        headers: {
          accept: "*/*",
          "Content-Type": "application/json"
        }
      }
    );
    return response;
  } catch (error) {
    console.error('Error deleting event location date:', error);
    throw error;
  }
};

/**
 * Get event location dates by event location ID
 */
export const getEventLocationsDateByEventLocId = async (
  eventLocId: number
): Promise<AxiosResponse<any>> => {
  try {
    const response = await locationApiClient.get(
      `/EventLocationDate/GetEventLocationsDateByEventLocId`,
      {
        params: { eventLocId },
        headers: { accept: "text/plain" }
      }
    );
    return response;
  } catch (error) {
    console.error('Error fetching event location dates by eventLocId:', error);
    throw error;
  }
};

// Export the configured axios instance for direct use if needed
export { locationApiClient };

// Export API configuration
export const LOCATION_API_CONFIG = {
  BASE_URL: API_BASE_URL,
  CREDENTIALS: API_CREDENTIALS,
  ENDPOINTS: {
    GET_LOCATIONS: 'Location/GetLocations',
    GET_EVENT_LOCATIONS_BY_EVENT_ID: 'EventLocation/GetEventLocationsByEventId',
    GET_EVENT_LOCATIONS_BY_ACTIVITY_ID: 'EventLocation/GetEventLocationsByActivityId'
  }
};