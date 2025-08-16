// API file for feedback-related endpoints

import axios from 'axios';
import type { AxiosResponse } from 'axios';
import { API_BASE_URL, API_CREDENTIALS, API_TIMEOUT } from './config/ApiConfig';
import { attachTokenInterceptor } from './config/attachTokenInterceptor';

const feedbackApiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${btoa(`${API_CREDENTIALS.username}:${API_CREDENTIALS.password}`)}`
  }
});

// Attach token interceptor
attachTokenInterceptor(feedbackApiClient);

// Type definitions
export interface FeedbackDetails {
  volunteerId: number;
  eventName: string;
  eventSubName: string;
  suggestionId: number;
  description: string;
  feedbackDate: string;
  rating: number;
}

/**
 * Get feedback details by volunteer ID and type (optional)
 * @param volunteerId - Volunteer ID
 * @param type - Suggestion type (e.g., "F"), optional
 * @returns Promise<AxiosResponse<FeedbackDetails[]>>
 */
export const getFeedbackDetails = async (
  volunteerId: number,
  type?: string
): Promise<AxiosResponse<FeedbackDetails[]>> => {
  try {
    const params: Record<string, any> = { volunteerId };
    if (type) params.type = type;
    const response = await feedbackApiClient.get(
      `Volunteer/GetFeedbackDetails`,
      { params }
    );
    return response;
  } catch (error) {
    console.error('Error fetching feedback details:', error);
    throw error;
  }
};

// Export the configured axios instance for direct use if needed
export { feedbackApiClient };

// Export API configuration
export const FEEDBACK_API_CONFIG = {
  BASE_URL: API_BASE_URL,
  CREDENTIALS: API_CREDENTIALS,
  ENDPOINTS: {
    GET_FEEDBACK_DETAILS: 'Volunteer/GetFeedbackDetails'
  }
};