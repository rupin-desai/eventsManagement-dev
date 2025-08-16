import axios from 'axios';
import type { AxiosResponse } from 'axios';
import { API_BASE_URL, API_CREDENTIALS, API_TIMEOUT } from './config/ApiConfig';
import { attachTokenInterceptor } from './config/attachTokenInterceptor';

const galleryApiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  withCredentials: true,
  headers: {
    'Authorization': `Basic ${btoa(`${API_CREDENTIALS.username}:${API_CREDENTIALS.password}`)}`
  }
});

attachTokenInterceptor(galleryApiClient);

export const GALLERY_API_CONFIG = {
  BASE_URL: API_BASE_URL,
  CREDENTIALS: API_CREDENTIALS,
  ENDPOINTS: {
    GET_GALLERY: 'Gallery/GetGallery',
    UPLOAD_GALLERY: 'Gallery/upload',
    UPDATE_GALLERY: 'Gallery/UpdateGallery'
  }
};

/**
 * Get all gallery images (GET)
 * @returns Promise<AxiosResponse<any>>
 */
export async function getGallery(): Promise<AxiosResponse<any>> {
  try {
    const response = await galleryApiClient.get(
      GALLERY_API_CONFIG.ENDPOINTS.GET_GALLERY,
      { headers: { accept: 'application/json' } }
    );
    return response;
  } catch (error) {
    console.error('Error fetching gallery:', error);
    throw error;
  }
}

export { galleryApiClient };