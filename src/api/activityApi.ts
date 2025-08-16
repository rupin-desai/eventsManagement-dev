// API file for activity-related endpoints

import axios from 'axios';
import type { AxiosResponse } from 'axios';
import { API_BASE_URL, API_CREDENTIALS, API_TIMEOUT } from './config/ApiConfig';
import { attachTokenInterceptor } from './config/attachTokenInterceptor';

const activityApiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  withCredentials: true, // To receive HttpOnly cookies
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${btoa(`${API_CREDENTIALS.username}:${API_CREDENTIALS.password}`)}`
  }
});

attachTokenInterceptor(activityApiClient);

// Type definitions for Activity
export interface Activity {
  activityId: number;
  name: string;
  subName: string;
  description: string;
  status: string;
  type: string;
}

export interface ActivityDetails {
  name: string;
  subName: string;
  description: string;
  status: string;
  addedOn: string;
  addedBy: number;
  type: string;
}

// Type definition for Activity Image Response
export interface ActivityImageResponse {
  fileName: string;
  contentType: string;
  imgFile: string; // Base64 encoded image data
}

export type ActivityStatus = 'A' | 'D'; // Active,Deactivated

/**
 * Get activities by status
 * @param status - Activity status ('A' for Active, 'I' for Inactive, etc.)
 * @returns Promise<AxiosResponse<Activity[]>>
 */
export const getActivities = async (status: ActivityStatus = 'A'): Promise<AxiosResponse<Activity[]>> => {
  try {
    const response = await activityApiClient.post(`Activity/GetActivities?status=${status}`);
    return response;
  } catch (error) {
    console.error('Error fetching activities:', error);
    throw error;
  }
};

/**
 * Get all active activities (convenience method)
 * @returns Promise<AxiosResponse<Activity[]>>
 */
export const getActiveActivities = async (): Promise<AxiosResponse<Activity[]>> => {
  return getActivities('A');
};

/**
 * Get all deactivated activities
 * @returns Promise<AxiosResponse<Activity[]>>
 */
export const getDeactivatedActivities = async (): Promise<AxiosResponse<Activity[]>> => {
  return getActivities('D');
};

/**
 * Get activity by ID
 * @param activityId - The ID of the activity
 * @returns Promise<AxiosResponse<ActivityDetails>>
 */
export const getActivityById = async (activityId: number): Promise<AxiosResponse<ActivityDetails>> => {
  try {
    const response = await activityApiClient.get(`Activity/GetActivityById?ActivityId=${activityId}`);
    return response;
  } catch (error) {
    console.error('Error fetching activity by ID:', error);
    throw error;
  }
};

/**
 * Get only Year-Round activities
 * @returns Promise<AxiosResponse<Activity[]>>
 */
export const getYearRoundActivities = async (): Promise<AxiosResponse<Activity[]>> => {
  try {
    const response = await getActivities('A');
    // Filter only Year-Round activities
    const yearRoundActivities = response.data.filter(activity => activity.type === 'Year-Round');
    return {
      ...response,
      data: yearRoundActivities
    };
  } catch (error) {
    console.error('Error fetching year-round activities:', error);
    throw error;
  }
};

/**
 * Get activity image data from API
 * @param activityId - The ID of the activity
 * @returns Promise<AxiosResponse<ActivityImageResponse>>
 */
export const getActivityImage = async (activityId: number): Promise<AxiosResponse<ActivityImageResponse>> => {
  try {
    const response = await activityApiClient.get(`ActivityImage/GetActivityImage?activityId=${activityId}`);
    return response;
  } catch (error) {
    console.error('Error fetching activity image:', error);
    throw error;
  }
};

/**
 * Get activity image URL (deprecated - use getActivityImage instead)
 * @param activityId - The ID of the activity
 * @returns string - Image URL
 */
export const getActivityImageUrl = (activityId: number): string => {
  return `${API_BASE_URL}ActivityImage/GetActivityImage?activityId=${activityId}`;
};

/**
 * Convert base64 image data to data URL
 * @param imgFile - Base64 encoded image data
 * @param contentType - MIME type of the image
 * @returns string - Data URL for use in img src
 */
export const convertToDataUrl = (imgFile: string, contentType: string): string => {
  if (!imgFile || !contentType) {
    return '';
  }
  return `data:${contentType};base64,${imgFile}`;
};

/**
 * Get activities by type
 * @param type - Activity type
 * @param status - Activity status (default: 'A')
 * @returns Promise<AxiosResponse<Activity[]>>
 */
export const getActivitiesByType = async (type: string, status: ActivityStatus = 'A'): Promise<AxiosResponse<Activity[]>> => {
  try {
    const response = await activityApiClient.post(`Activity/GetActivities?status=${status}&type=${encodeURIComponent(type)}`);
    return response;
  } catch (error) {
    console.error('Error fetching activities by type:', error);
    throw error;
  }
};

// Export the configured axios instance for direct use if needed
export { activityApiClient };

// Export API configuration
export const ACTIVITY_API_CONFIG = {
  BASE_URL: API_BASE_URL,
  CREDENTIALS: API_CREDENTIALS,
  ENDPOINTS: {
    GET_ACTIVITIES: 'Activity/GetActivities',
    GET_ACTIVITY_BY_ID: 'Activity/GetActivityById',
    GET_ACTIVITY_IMAGE: 'ActivityImage/GetActivityImage'
  }
};