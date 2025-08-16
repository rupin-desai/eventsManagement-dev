// Admin API file for activity management

import axios from 'axios';
import type { AxiosResponse } from 'axios';
import { attachTokenInterceptor } from '../config/attachTokenInterceptor';

const API_BASE_URL = 'https://www.alkemites.com/SmileAPI/';
const API_CREDENTIALS = {
  username: 'alkemSmile',
  password: 'Smile@345Jun'
};


// Create axios instance with default configuration
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
export interface CreateActivityRequest {
  name: string;
  subName: string;
  type: boolean; // true: Year-Round, false: Annual
  description: string;
  addedBy: number;
  certificate: boolean;
}

export interface UpdateActivityRequest {
  activityId: number;
  name: string;
  subName: string;
  type: string;
  description: string;
  certificate: boolean;
}

/**
 * Create a new activity
 * @param activityData - Activity creation data
 * @returns Promise<AxiosResponse>
 */
export const createActivity = async (activityData: CreateActivityRequest): Promise<AxiosResponse> => {
  try {
    const response = await activityAdminApiClient.post('Activity/CreateActivity', activityData);
    return response;
  } catch (error) {
    console.error('Error creating activity:', error);
    throw error;
  }
};

/**
 * Update an existing activity
 * @param activityData - Activity update data
 * @returns Promise<AxiosResponse>
 */
export const updateActivity = async (activityData: UpdateActivityRequest): Promise<AxiosResponse> => {
  try {
    const response = await activityAdminApiClient.post('Activity/UpdateActivity', activityData);
    return response;
  } catch (error) {
    console.error('Error updating activity:', error);
    throw error;
  }
};

/**
 * Create activity image
 * @param file - Image file
 * @param activityId - Activity ID
 * @returns Promise<AxiosResponse>
 */
export const createActivityImage = async (file: File, activityId: number): Promise<AxiosResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('activityId', activityId.toString());

    const response = await axios.post(
      `${API_BASE_URL}ActivityImage/CreateActivityImage`,
      formData,
      {
        timeout: 10000,
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Basic ${btoa(`${API_CREDENTIALS.username}:${API_CREDENTIALS.password}`)}`
        }
      }
    );
    return response;
  } catch (error) {
    console.error('Error creating activity image:', error);
    throw error;
  }
};

/**
 * Update activity status
 * @param params - { activityId: number, status: string, addedBy: number }
 * @returns Promise<AxiosResponse>
 */
export const updateActivityStatus = async (params: {
  activityId: number;
  status: string;
  addedBy: number;
}): Promise<AxiosResponse> => {
  try {
    const response = await activityAdminApiClient.post(
      'Activity/UpdateActivityStatus',
      params,
      {
        headers: {
          accept: 'text/plain',
          'Content-Type': 'application/json',
        },
      }
    );
    return response;
  } catch (error) {
    console.error('Error updating activity status:', error);
    throw error;
  }
};

// Export the configured axios instance for direct use if needed
export { activityAdminApiClient };

// Export API configuration
export const ACTIVITY_ADMIN_API_CONFIG = {
  BASE_URL: API_BASE_URL,
  CREDENTIALS: API_CREDENTIALS,
  ENDPOINTS: {
    CREATE_ACTIVITY: 'Activity/CreateActivity',
    UPDATE_ACTIVITY: 'Activity/UpdateActivity',
    CREATE_ACTIVITY_IMAGE: 'ActivityImage/CreateActivityImage',
    UPDATE_ACTIVITY_STATUS: 'Activity/UpdateActivityStatus'
  }
};