import axios from 'axios';
import type { AxiosResponse } from 'axios';
import { API_BASE_URL, API_CREDENTIALS, API_TIMEOUT } from './config/ApiConfig';
import { attachTokenInterceptor } from './config/attachTokenInterceptor';

// Create axios instance with default configuration
const certificateApiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${btoa(`${API_CREDENTIALS.username}:${API_CREDENTIALS.password}`)}`
  }
});

attachTokenInterceptor(certificateApiClient);

/**
 * Download certificate by volunteer ID
 * @param volunteerId - Volunteer ID
 * @returns Promise<AxiosResponse<any>>
 */
export const downloadCertificateByVolunteerId = async (
  volunteerId: string
): Promise<AxiosResponse<any>> => {
  try {
    const response = await certificateApiClient.get(
      `/Volunteer/DownloadCertificateByVId?volunteerId=${encodeURIComponent(volunteerId)}`,
      {
        responseType: 'blob', // If you expect a file (PDF, image, etc.)
        headers: {
          accept: '*/*'
        }
      }
    );
    return response;
  } catch (error) {
    console.error('Error downloading certificate:', error);
    throw error;
  }
};

// Export the configured axios instance for direct use if needed
export { certificateApiClient };

// Export API configuration
export const CERTIFICATE_API_CONFIG = {
  BASE_URL: API_BASE_URL,
  CREDENTIALS: API_CREDENTIALS,
  ENDPOINTS: {
    DOWNLOAD_CERTIFICATE_BY_VOLUNTEER_ID: '/Volunteer/DownloadCertificateByVId'
  }
};