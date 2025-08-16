import axios from "axios";
import type { AxiosResponse } from "axios";
import { API_BASE_URL, API_CREDENTIALS, API_TIMEOUT } from "./config/ApiConfig";
import { attachTokenInterceptor } from './config/attachTokenInterceptor';

// Axios instance
const relationApiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Basic ${btoa(`${API_CREDENTIALS.username}:${API_CREDENTIALS.password}`)}`
  }
});

attachTokenInterceptor(relationApiClient);

// Create VolRelation
export interface CreateVolRelationRequest {
  eventId: number;
  eventLocationId: number;
  addedBy: number;
  createVolRelation: {
    relationId: number;
    relationName: string;
    relationContact: number;
  }[];
}

export const createVolRelations = async (
  data: CreateVolRelationRequest
): Promise<AxiosResponse<any>> => {
  return relationApiClient.post(
    "/VolRelation/CreateVolRelations",
    data,
    {
      headers: {
        accept: "text/plain"
      }
    }
  );
};

// Get related volunteers by self and event (now uses query params)
export interface GetRelVolunteersBySelfNEventRequest {
  eventId: number;
  employeeId: number;
}

export const getRelVolunteersBySelfNEvent = async (
  data: GetRelVolunteersBySelfNEventRequest
): Promise<AxiosResponse<any>> => {
  return relationApiClient.get(
    "/VolRelation/GetRelVolunteersBySelfNEvent",
    {
      params: {
        employeeId: data.employeeId,
        eventId: data.eventId
      },
      headers: {
        accept: "text/plain"
      }
    }
  );
};

// Get related volunteers by eventId (now uses query params)
export interface GetRelVolunteersByEventIdRequest {
  eventId: number;
}

export const getRelVolunteersByEventId = async (
  data: GetRelVolunteersByEventIdRequest
): Promise<AxiosResponse<any>> => {
  return relationApiClient.get(
    "/VolRelation/GetRelVolunteersByEventId",
    {
      params: {
        eventId: data.eventId
      },
      headers: {
        accept: "text/plain"
      }
    }
  );
};

export { relationApiClient };