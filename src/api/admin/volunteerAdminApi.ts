// Admin API file for volunteer management

import axios from 'axios';
import type { AxiosResponse } from 'axios';
import { API_BASE_URL, API_CREDENTIALS } from '../config/ApiConfig';
import { attachTokenInterceptor } from '../config/attachTokenInterceptor';

// Create axios instance with default configuration
const volunteerAdminApiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${btoa(`${API_CREDENTIALS.username}:${API_CREDENTIALS.password}`)}`
  }
});
attachTokenInterceptor(volunteerAdminApiClient);

// ✅ Updated Volunteer interface to exactly match API response
export interface Volunteer {
  volunteerId: number;
  eventLocationId: number;
  eventLocationName: string;
  employeeId: number;
  employeeName: string;
  employeeEmailId: string;
  employeeDesig: string;
  status: string;
  addedBy: number;
  addedOn: string;
  rating?: number; // Optional field for rating (not in current API response)
}

export interface VolunteerStatusUpdate {
  volunteerId: number;
  status: string;
}

export interface UpdateVolunteerStatusListRequest {
  volunteerList: VolunteerStatusUpdate[];
}

/**
 * Get volunteers by event ID
 * @param eventId - Event ID
 * @returns Promise<AxiosResponse<Volunteer[]>>
 */
export const getVolunteersByEventId = async (eventId: number): Promise<AxiosResponse<Volunteer[]>> => {
  try {
    console.log('🔗 Making API call to get volunteers for event:', eventId);
    const url = `Volunteer/GetVolunteersByEventId?EventId=${eventId}`;
    console.log('🔗 API URL:', API_BASE_URL + url);
    
    const response = await volunteerAdminApiClient.get(url);
    
    console.log('📡 API Response received:', {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      dataType: typeof response.data,
      isArray: Array.isArray(response.data),
      dataLength: response.data?.length
    });
    
    return response;
  } catch (error) {
    console.error('❌ Error fetching volunteers by event ID:', error);
    if (error instanceof axios.AxiosError) {
      console.error('❌ Axios error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        method: error.config?.method
      });
    }
    throw error;
  }
};

/**
 * Update volunteer status list
 * @param volunteerData - Volunteer status update data
 * @returns Promise<AxiosResponse>
 */
export const updateVolunteerStatusList = async (volunteerData: UpdateVolunteerStatusListRequest): Promise<AxiosResponse> => {
  try {
    console.log('🔗 Making API call to update volunteer status:', volunteerData);
    const response = await volunteerAdminApiClient.post('Volunteer/UpdateVolunteerStatusList', volunteerData);
    console.log('📡 Update response:', response);
    return response;
  } catch (error) {
    console.error('❌ Error updating volunteer status list:', error);
    throw error;
  }
};

// Export the configured axios instance for direct use if needed
export { volunteerAdminApiClient };

// Export API configuration
export const VOLUNTEER_ADMIN_API_CONFIG = {
  BASE_URL: API_BASE_URL,
  CREDENTIALS: API_CREDENTIALS,
  ENDPOINTS: {
    GET_VOLUNTEERS_BY_EVENT_ID: 'Volunteer/GetVolunteersByEventId',
    UPDATE_VOLUNTEER_STATUS_LIST: 'Volunteer/UpdateVolunteerStatusList'
  }
};