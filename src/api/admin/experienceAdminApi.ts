import axios, { type AxiosResponse } from 'axios';
import { API_BASE_URL, API_CREDENTIALS } from '../config/ApiConfig';
import { attachTokenInterceptor } from '../config/attachTokenInterceptor';


const experienceAdminApiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${btoa(`${API_CREDENTIALS.username}:${API_CREDENTIALS.password}`)}`
  }
});
attachTokenInterceptor(experienceAdminApiClient);

// Experience Hub interface
export interface ExperienceHub {
  suggestionId: number;
  eventId: number;
  description: string;
  employeeId: number;
  employeeName: string;
  employeeEmailId: string;
  employeeDesig: string;
  volunteerId: number;
  status: string;
  addedOn: string;
  type?: string;
}

/**
 * Get all experience hub entries (Admin action)
 * @returns Promise<AxiosResponse<ExperienceHub[]>>
 */
export const getExpHubAll = async (): Promise<AxiosResponse<ExperienceHub[]>> => {
  try {
    const response = await experienceAdminApiClient.get('Suggestion/GetExpHubAll');
    return response;
  } catch (error) {
    console.error('Error fetching all experience hub entries:', error);
    throw error;
  }
};

// API configuration constants
export const EXPERIENCE_ADMIN_API_CONFIG = {
  BASE_URL: API_BASE_URL,
  CREDENTIALS: API_CREDENTIALS,
  ENDPOINTS: {
    GET_EXP_HUB_ALL: 'Suggestion/GetExpHubAll'
  }
};