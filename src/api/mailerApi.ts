import axios, { type AxiosResponse } from "axios";
import { API_BASE_URL, API_CREDENTIALS, API_TIMEOUT } from './config/ApiConfig';
import { attachTokenInterceptor } from './config/attachTokenInterceptor';

const volunteerApiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${btoa(`${API_CREDENTIALS.username}:${API_CREDENTIALS.password}`)}`
  }
});

attachTokenInterceptor(volunteerApiClient);

// Volunteer Rating Mail API
export interface UpdateVolunteerRatingMailRequest {
  volunteerId: number;
  rating: number;
  encVolunteerId: string;
}

export const updateVolunteerRatingMail = async (
  data: UpdateVolunteerRatingMailRequest
): Promise<AxiosResponse<any>> => {
  return volunteerApiClient.post(
    "Volunteer/UpdateVolunteerRatingMail",
    data,
    {
      headers: {
        Accept: "text/plain",
      },
    }
  );
};

// Suggestion/Experience Mail API
export interface CreateSuggestionMailRequest {
  file?: File | null;
  EventId?: number;
  Description: string;
  EmployeeId?: number;
  VolunteerId?: number;
  Type?: string;
  encVolunteerId?: string;
}

export const createSuggestionMail = async (
  data: CreateSuggestionMailRequest
): Promise<AxiosResponse<any>> => {
  const formData = new FormData();
  if (data.file) formData.append("file", data.file);
  if (data.EventId !== undefined) formData.append("EventId", String(data.EventId));
  if (data.Description) formData.append("Description", data.Description);
  if (data.EmployeeId !== undefined) formData.append("EmployeeId", String(data.EmployeeId));
  if (data.VolunteerId !== undefined) formData.append("VolunteerId", String(data.VolunteerId));
  if (data.Type) formData.append("Type", data.Type);
  if (data.encVolunteerId) formData.append("encVolunteerId", data.encVolunteerId);

  return volunteerApiClient.post(
    "Suggestion/CreateSuggestionMail",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "text/plain",
      },
    }
  );
};

// Fetch Volunteer Details By Encrypted Volunteer ID
export interface VolunteerDetailsResponse {
  volunteerId: number;
  employeeId?: number;
  eventId?: number;
  // Add other fields if needed
}

export const getVolunteerDetailsByVIdMail = async (
  encVolunteerId: string
): Promise<VolunteerDetailsResponse | null> => {
  try {
    const response = await volunteerApiClient.get(
      `Volunteer/GetVolunteerDetailsByVIdMail`,
      {
        params: { EncpvolunteerId: encVolunteerId },
        headers: {
          Accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching volunteer details:", error);
    return null;
  }
};

// Fetch Feedback Details By Encrypted Volunteer ID
export interface FeedbackDetailsResponse {
  volunteerId: number;
  // Add other fields if needed
}

export const getFeedbackDetailsMail = async (
  encVolunteerId: string
): Promise<FeedbackDetailsResponse | null> => {
  try {
    const response = await volunteerApiClient.get(
      `Volunteer/GetFeedbackDetailsMail`,
      {
        params: { EncpvolunteerId: encVolunteerId },
        headers: {
          Accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching feedback details:", error);
    return null;
  }
};

// Fetch Activity By EventId using Encrypted Volunteer ID
export interface ActivityByEventIdResponse {
  activityId: number;
  eventId: number;
  name: string;
  description?: string;
  subName?: string;
  // Add other fields as per your backend response
}

export const getActivityByEventIdMail = async (
  encVolunteerId: string
): Promise<ActivityByEventIdResponse | null> => {
  try {
    const response = await volunteerApiClient.get(
      `Activity/GetActivityByEventIdMail`,
      {
        params: { EncpvolunteerId: encVolunteerId },
        headers: {
          Accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching activity by event id:", error);
    return null;
  }
};

// Fetch Activity By EventId using eventId (not EncpvolunteerId)
export const getActivityByEventIdMailByEventId = async (
  eventId: number
): Promise<ActivityByEventIdResponse | null> => {
  try {
    const response = await volunteerApiClient.get(
      `Activity/GetActivityByEventIdMail`,
      {
        params: { eventId },
        headers: {
          Accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching activity by event id:", error);
    return null;
  }
};

export { volunteerApiClient };