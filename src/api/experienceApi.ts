import axios, { type AxiosResponse } from 'axios';
import { API_BASE_URL, API_CREDENTIALS, API_TIMEOUT } from './config/ApiConfig';
import { attachTokenInterceptor } from './config/attachTokenInterceptor';

// Define or import the ExperienceHub type
export interface ExperienceHub {
  suggestionId: number; // <-- Add this line
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
  // ...add any other fields your backend returns
}

const experienceApiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${btoa(`${API_CREDENTIALS.username}:${API_CREDENTIALS.password}`)}`
  }
});

attachTokenInterceptor(experienceApiClient);

/**
 * Get all approved experience hub entries
 * @returns Promise<AxiosResponse<ExperienceHub[]>>
 */
export const getExpHubApproved = async (): Promise<AxiosResponse<ExperienceHub[]>> => {
  try {
    const response = await experienceApiClient.get('Suggestion/GetExpHubApproved');
    return response;
  } catch (error) {
    console.error('Error fetching approved experience hub entries:', error);
    throw error;
  }
};

// API configuration constants
export const EXPERIENCE_API_CONFIG = {
  BASE_URL: API_BASE_URL,
  CREDENTIALS: API_CREDENTIALS,
  ENDPOINTS: {
    GET_EXP_HUB_APPROVED: 'Suggestion/GetExpHubApproved'
  }
};