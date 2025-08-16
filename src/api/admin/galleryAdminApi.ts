// API file for admin gallery-related endpoints

import { galleryApiClient, GALLERY_API_CONFIG } from '../galleryApi';
import type { AxiosResponse } from 'axios';

/**
 * Upload an image to the gallery (with thumbfile, ActivityId, Description)
 * POST /Gallery/upload
 */
export async function uploadGalleryImage(params: {
  file: File;
  thumbfile?: File;
  addedBy: string;
  activityId?: string | number;
  description?: string;
}): Promise<AxiosResponse<any>> {
  const formData = new FormData();
  formData.append("file", params.file);
  if (params.thumbfile) formData.append("thumbfile", params.thumbfile);
  formData.append("AddedBy", params.addedBy);
  if (params.activityId) formData.append("ActivityId", String(params.activityId));
  if (params.description) formData.append("Description", params.description);

  try {
    const response = await galleryApiClient.post(
      GALLERY_API_CONFIG.ENDPOINTS.UPLOAD_GALLERY, // This is 'Gallery/upload'
      formData,
      {
        headers: {
          accept: "*/*",
          "Content-Type": "multipart/form-data",
        }
      }
    );
    return response;
  } catch (error) {
    console.error('Error uploading gallery image:', error);
    throw error;
  }
}

/**
 * Update a gallery image (with file, thumbfile, Id, AddedBy, Status, ActivityId, Description)
 * POST /Gallery/UpdateGallery
 */
export async function updateGalleryImage(params: {
  file?: File;
  thumbfile?: File;
  id: string | number;
  addedBy: string;
  status: string;
  activityId?: string | number;
  description?: string;
}): Promise<AxiosResponse<any>> {
  const formData = new FormData();
  if (params.file) formData.append('file', params.file);
  if (params.thumbfile) formData.append('thumbfile', params.thumbfile);
  formData.append('Id', String(params.id));
  formData.append('AddedBy', params.addedBy);
  formData.append('Status', params.status);
  if (params.activityId) formData.append('ActivityId', String(params.activityId));
  if (params.description) formData.append('Description', params.description);

  try {
    const response = await galleryApiClient.post(
      GALLERY_API_CONFIG.ENDPOINTS.UPDATE_GALLERY,
      formData,
      {
        headers: {
          accept: "*/*"
        }
      }
    );
    return response;
  } catch (error) {
    console.error('Error updating gallery image:', error);
    throw error;
  }
}

// If you use a custom axios instance for admin, do this:
import { API_BASE_URL, API_CREDENTIALS } from '../config/ApiConfig';
import { attachTokenInterceptor } from '../config/attachTokenInterceptor';
import axios from 'axios';

const galleryAdminApiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${btoa(`${API_CREDENTIALS.username}:${API_CREDENTIALS.password}`)}`
  }
});
attachTokenInterceptor(galleryAdminApiClient);
// If you just use galleryApiClient from galleryApi.ts, ensure that file uses the interceptor.