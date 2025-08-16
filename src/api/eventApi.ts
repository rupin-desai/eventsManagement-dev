// API file for event-related endpoints

import axios from 'axios';
import type { AxiosResponse } from 'axios';
import { API_BASE_URL, API_CREDENTIALS } from './config/ApiConfig';
import { attachTokenInterceptor } from './config/attachTokenInterceptor';

// Create axios instance with default configuration
const eventApiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${btoa(`${API_CREDENTIALS.username}:${API_CREDENTIALS.password}`)}`
  }
});

// Attach the token interceptor
attachTokenInterceptor(eventApiClient);

// Type definitions for Event
export interface Event {
  activityId: number;
  eventId: number;
  name: string;
  subName: string;
  description: string;
  tentativeMonth: string;
  tentativeYear: string;
  type: string;
  status: string;
  enableConf: string;
  enableCert: string;
  enableComp: string;
  finYear: string;
}

/**
 * Get distinct event years
 * @returns Promise<AxiosResponse<string[]>>
 */
export const getDistinctEventYears = async (): Promise<AxiosResponse<string[]>> => {
  try {
    const response = await eventApiClient.get('Event/GetDistinctEventYear');
    return response;
  } catch (error) {
    console.error('Error fetching distinct event years:', error);
    throw error;
  }
};

/**
 * Get events by year
 * @param year - The year to filter events
 * @returns Promise<AxiosResponse<Event[]>>
 */
export const getEventsByYear = async (year: number | string): Promise<AxiosResponse<Event[]>> => {
  try {
    const response = await eventApiClient.get(`Event/GetEventsByYear?year=${year}`);
    return response;
  } catch (error) {
    console.error('Error fetching events by year:', error);
    throw error;
  }
};

// Export the configured axios instance for direct use if needed
export { eventApiClient };

// Export API configuration
export const EVENT_API_CONFIG = {
  BASE_URL: API_BASE_URL,
  CREDENTIALS: API_CREDENTIALS,
  ENDPOINTS: {
    GET_DISTINCT_YEARS: 'Event/GetDistinctEventYear',
    GET_EVENTS_BY_YEAR: 'Event/GetEventsByYear'
  }
};