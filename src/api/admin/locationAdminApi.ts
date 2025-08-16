// Admin API file for location management

import axios from 'axios';
import type { AxiosResponse } from 'axios';
import { API_BASE_URL, API_CREDENTIALS } from '../config/ApiConfig';
import { attachTokenInterceptor } from '../config/attachTokenInterceptor';

// Create axios instance with default configuration
const locationAdminApiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${btoa(`${API_CREDENTIALS.username}:${API_CREDENTIALS.password}`)}`
  }
});
attachTokenInterceptor(locationAdminApiClient);

// Type definitions
export interface Location {
  locationId: number;
  locationName: string;
}

/**
 * Get all locations (inherited from main location API)
 * @returns Promise<AxiosResponse<Location[]>>
 */
export const getLocations = async (): Promise<AxiosResponse<Location[]>> => {
  try {
    const response = await locationAdminApiClient.get('Location/GetLocations');
    return response;
  } catch (error) {
    console.error('Error fetching locations:', error);
    throw error;
  }
};

/**
 * Get non-added locations by event ID
 * @param eventId - Event ID
 * @returns Promise<AxiosResponse<Location[]>>
 */
export const getNonAddedLocationsByEventId = async (eventId: number): Promise<AxiosResponse<Location[]>> => {
  try {
    const response = await locationAdminApiClient.get(`Location/GetNonAddedLocationsByEventId?eventId=${eventId}`);
    return response;
  } catch (error) {
    console.error('Error fetching non-added locations by event ID:', error);
    throw error;
  }
};

// Export the configured axios instance for direct use if needed
export { locationAdminApiClient };

// Export API configuration
export const LOCATION_ADMIN_API_CONFIG = {
  BASE_URL: API_BASE_URL,
  CREDENTIALS: API_CREDENTIALS,
  ENDPOINTS: {
    GET_LOCATIONS: 'Location/GetLocations',
    GET_NON_ADDED_LOCATIONS_BY_EVENT_ID: 'Location/GetNonAddedLocationsByEventId'
  }
};