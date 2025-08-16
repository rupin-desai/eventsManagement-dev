// API file for suggestion-related endpoints

import axios from 'axios';
import type { AxiosResponse } from 'axios';
import { API_BASE_URL, API_CREDENTIALS, API_TIMEOUT } from './config/ApiConfig';
import { attachTokenInterceptor } from './config/attachTokenInterceptor';

const suggestionApiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT, // Use config timeout
  withCredentials: true,
  headers: {
    'Authorization': `Basic ${btoa(`${API_CREDENTIALS.username}:${API_CREDENTIALS.password}`)}`
  }
});

// Attach token interceptor
attachTokenInterceptor(suggestionApiClient);

// Type definitions
export interface CreateSuggestionRequest {
  eventId: number;
  description: string;
  employeeId: number;
  volunteerId: number;
  type: string; // S: Suggestion, F: Feedback, E: Experience
  file?: File; // Added optional file field
}

export interface Suggestion {
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
  type?: string; // Added optional type field to existing interface
}

// Export suggestion type constants for easy reference
export const SUGGESTION_TYPES = {
  SUGGESTION: 'S',
  FEEDBACK: 'F',
  EXPERIENCE: 'E'
} as const;

// Export type for TypeScript type checking
export type SuggestionType = typeof SUGGESTION_TYPES[keyof typeof SUGGESTION_TYPES];

/**
 * Create a new suggestion with optional file upload
 * @param suggestionData - Suggestion data
 * @returns Promise<AxiosResponse>
 */
export const createSuggestion = async (suggestionData: CreateSuggestionRequest): Promise<AxiosResponse> => {
  try {
    // Create FormData object for multipart/form-data
    const formData = new FormData();
    
    // Add file if provided
    if (suggestionData.file) {
      formData.append('file', suggestionData.file);
    }
    
    // Add other fields
    formData.append('EventId', suggestionData.eventId.toString());
    formData.append('Description', suggestionData.description);
    formData.append('EmployeeId', suggestionData.employeeId.toString());
    formData.append('VolunteerId', suggestionData.volunteerId.toString());
    formData.append('Type', suggestionData.type);

    console.log('📤 Sending suggestion with FormData:');
    console.log('- EventId:', suggestionData.eventId);
    console.log('- Description:', suggestionData.description);
    console.log('- EmployeeId:', suggestionData.employeeId);
    console.log('- VolunteerId:', suggestionData.volunteerId);
    console.log('- Type:', suggestionData.type);
    console.log('- File:', suggestionData.file ? suggestionData.file.name : 'No file');

    const response = await suggestionApiClient.post('Suggestion/CreateSuggestion', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'accept': 'text/plain'
      }
    });

    console.log('✅ Suggestion created successfully:', response.data);
    return response;
  } catch (error) {
    console.error('❌ Error creating suggestion:', error);
    throw error;
  }
};

/**
 * Create suggestion without file (for backward compatibility)
 * @param suggestionData - Suggestion data without file
 * @returns Promise<AxiosResponse>
 */
export const createSuggestionWithoutFile = async (suggestionData: Omit<CreateSuggestionRequest, 'file'>): Promise<AxiosResponse> => {
  return createSuggestion(suggestionData);
};

/**
 * Get suggestions by self and event
 * @param eventId - Event ID
 * @param employeeId - Employee ID
 * @returns Promise<AxiosResponse<Suggestion[]>>
 */
export const getSuggestionBySelfAndEvent = async (eventId: number, employeeId: number): Promise<AxiosResponse<Suggestion[]>> => {
  try {
    const response = await suggestionApiClient.get(`Suggestion/GetSuggestionBySelfNEvent?eventId=${eventId}&employeeId=${employeeId}`);
    return response;
  } catch (error) {
    console.error('Error fetching suggestions by self and event:', error);
    throw error;
  }
};

/**
 * Get suggestions by event ID
 * @param eventId - Event ID
 * @returns Promise<AxiosResponse<Suggestion[]>>
 */
export const getSuggestionByEventId = async (eventId: number): Promise<AxiosResponse<Suggestion[]>> => {
  try {
    const response = await suggestionApiClient.get(`Suggestion/GetSuggestionByEventId?eventId=${eventId}`);
    return response;
  } catch (error) {
    console.error('Error fetching suggestions by event ID:', error);
    throw error;
  }
};

/**
 * Fetches the experience image for a given suggestionId.
 * @param suggestionId - The suggestion ID for which to fetch the image.
 * @returns Promise<Blob> - The image as a Blob.
 */
export const getExperienceImage = async (suggestionId: number): Promise<Blob> => {
  try {
    const response = await suggestionApiClient.get(
      `Suggestion/GetExpImage?suggestionId=${suggestionId}`,
      {
        headers: { accept: '*/*' },
        responseType: 'blob'
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching experience image:', error);
    throw error;
  }
};

// Export the configured axios instance for direct use if needed
export { suggestionApiClient };

// Export API configuration
export const SUGGESTION_API_CONFIG = {
  BASE_URL: API_BASE_URL,
  CREDENTIALS: API_CREDENTIALS,
  ENDPOINTS: {
    CREATE_SUGGESTION: 'Suggestion/CreateSuggestion',
    GET_SUGGESTION_BY_SELF_AND_EVENT: 'Suggestion/GetSuggestionBySelfNEvent',
    GET_SUGGESTION_BY_EVENT_ID: 'Suggestion/GetSuggestionByEventId'
  }
};

// Helper function to validate file types
export const validateFileType = (file: File): boolean => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  return allowedTypes.includes(file.type);
};

// Helper function to validate file size (max 5MB)
export const validateFileSize = (file: File, maxSizeInMB: number = 5): boolean => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};

// Helper function to validate file
export const validateFile = (file: File): { isValid: boolean; error?: string } => {
  if (!validateFileType(file)) {
    return { isValid: false, error: 'Invalid file type. Please upload an image (JPEG, PNG, GIF, WebP).' };
  }
  
  if (!validateFileSize(file)) {
    return { isValid: false, error: 'File size too large. Please upload a file smaller than 5MB.' };
  }
  
  return { isValid: true };
};