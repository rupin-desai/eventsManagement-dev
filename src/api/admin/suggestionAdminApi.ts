// Admin API file for suggestion management

import axios from 'axios';
import type { AxiosResponse } from 'axios';
import { API_BASE_URL, API_CREDENTIALS } from '../config/ApiConfig';
import { attachTokenInterceptor } from '../config/attachTokenInterceptor';

// Create axios instance with default configuration
const suggestionAdminApiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${btoa(`${API_CREDENTIALS.username}:${API_CREDENTIALS.password}`)}`
  }
});
attachTokenInterceptor(suggestionAdminApiClient);

// Type definitions
export interface Suggestion {
  suggestionId: number;
  eventId: number;
  description: string;
  employeeId: number;
  employeeName?: string;
  employeeDesig?: string;
  employeeEmailId?: string;
  volunteerId?: number;
  status: string;
  addedOn: string;
  type?: string; // Added type property
  filePath?: string; // Added filePath property
}

export interface ApproveSuggestionRequest {
  suggestionId: number;
  status: string;
  approvedBy: number;
  description: string; // Added description field
}

/**
 * Get suggestions by event ID (Admin view)
 * @param eventId - Event ID
 * @returns Promise<AxiosResponse<Suggestion[]>>
 */
export const getSuggestionByEventId = async (eventId: number): Promise<AxiosResponse<Suggestion[]>> => {
  try {
    const response = await suggestionAdminApiClient.get(`Suggestion/GetSuggestionByEventId?eventId=${eventId}`);
    return response;
  } catch (error) {
    console.error('Error fetching suggestions by event ID:', error);
    throw error;
  }
};

// Add this function after the getSuggestionByEventId function
/**
 * Approve/Update suggestion status (Admin action)
 * @param request - Suggestion approval request
 * @returns Promise<AxiosResponse<any>>
 */
export const approveSuggestion = async (request: ApproveSuggestionRequest): Promise<AxiosResponse<any>> => {
  try {
    const response = await suggestionAdminApiClient.post('Suggestion/ApproveSuggestion', request);
    return response;
  } catch (error) {
    console.error('Error approving suggestion:', error);
    throw error;
  }
};

// Export the configured axios instance for direct use if needed
export { suggestionAdminApiClient };

// Export API configuration
export const SUGGESTION_ADMIN_API_CONFIG = {
  BASE_URL: API_BASE_URL,
  CREDENTIALS: API_CREDENTIALS,
  ENDPOINTS: {
    GET_SUGGESTION_BY_EVENT_ID: 'Suggestion/GetSuggestionByEventId',
    APPROVE_SUGGESTION: 'Suggestion/ApproveSuggestion'
  }
};