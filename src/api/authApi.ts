// Simple API file for authentication using Axios

import axios, { type AxiosResponse } from 'axios';
import { API_BASE_URL, API_CREDENTIALS, API_TIMEOUT } from './config/ApiConfig';
import { attachTokenInterceptor } from './config/attachTokenInterceptor';

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${btoa(`${API_CREDENTIALS.username}:${API_CREDENTIALS.password}`)}`
  }
});

// Attach the token interceptor
attachTokenInterceptor(apiClient);

// Type definitions
export interface LoginResponse {
  token: string;
  employeeId: string;
  employeeName: string;
  message: string;
  success: boolean;
}

export interface UserClaims {
  employeeId: string;
  employeeName: string;
  emailId: string;
  designation: string;
  department: string;
  location: string;
  roles: string[];
}

/**
 * Login with employee code
 * @param empcode - Employee code for authentication
 * @returns Promise<AxiosResponse<LoginResponse>>
 */
export const loginWithEmployeeCode = async (enc_empcode: string): Promise<AxiosResponse<LoginResponse>> => {
  try {
    // Send enc_empcode in the request body instead of as a query parameter
    const response = await apiClient.post('Auth/LoginLink', { enc_empcode });
    return response;
  } catch (error) {
    throw error;
  }
};  

/**
 * Get user details/claims
 * @returns Promise<AxiosResponse<UserClaims>>
 */
export const getUser = async (): Promise<AxiosResponse<UserClaims>> => {
  try {
    const response = await apiClient.get('Auth/GetUser');
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Logout user
 * @returns Promise<AxiosResponse>
 */
export const logout = async (): Promise<AxiosResponse> => {
  try {
    // Call backend to clear HttpOnly cookie/session
    const response = await apiClient.post('Auth/Logout');

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

/**
 * Check if user is authenticated (if this endpoint exists)
 * @returns Promise<AxiosResponse>
 */
export const verifyAuth = async (): Promise<AxiosResponse> => {
  try {
    const response = await apiClient.get('Auth/verify');
    return response;
  } catch (error) {
    throw error;
  }
};

// Export API configuration for use in other files
export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  CREDENTIALS: API_CREDENTIALS,
  ENDPOINTS: {
    LOGIN: 'Auth/login',
    GET_USER: 'Auth/GetUser',
    LOGOUT: 'Auth/Logout',
    VERIFY: 'Auth/verify'
  }
};

// Export the configured axios instance for direct use if needed
export { apiClient };