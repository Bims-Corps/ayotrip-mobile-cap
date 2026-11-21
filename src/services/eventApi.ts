import { api } from "@/lib/axios";
import type { SuccessApiResponse, SuccessListApiResponse } from "@/types/core.type";
import type {
  EventListResponse,
  EventDetailResponse,
  EventDepartureListResponse,
  EventTypeListResponse,
  EventListQueryParams,
} from "@/types/event.type";

export interface EventAttributeItem {
  id: number;
  name: string;
  type: "HIGHLIGHT" | "FACILITY" | "EXCLUDE";
  logoUrl?: string;
  isActive: boolean;
}

export const eventApi = {
  /**
   * Fetch paginated list of public trips & events for mobile traveler
   * Calls real staging server GET /event
   */
  list: async (params?: EventListQueryParams) => {
    const cleanParams: Record<string, any> = {};
    if (params) {
      if (params.page) cleanParams.page = params.page;
      if (params.limit) cleanParams.limit = params.limit;
      if (params.search && params.search.trim()) cleanParams.search = params.search.trim();
      if (params.sort) cleanParams.sort = params.sort;
      if (params.sortTarget) cleanParams.sortTarget = params.sortTarget;
      if (params.tripType && params.tripType !== "ALL") cleanParams.tripType = params.tripType;
      if (params.regencyId) cleanParams.regencyId = params.regencyId;
      if (params.destinationId) cleanParams.destinationId = params.destinationId;
    }

    const { data } = await api.get<SuccessListApiResponse<EventListResponse[]>>(
      "/event",
      {
        params: cleanParams,
        paramsSerializer: { indexes: null },
      }
    );
    return data.body;
  },

  /**
   * Fetch full event detail by ID
   * Calls real staging server GET /event/:id
   */
  detail: async (id: string) => {
    const { data } = await api.get<SuccessApiResponse<EventDetailResponse>>(
      `/event/${id}`
    );
    return data.body;
  },

  /**
   * Fetch departures schedule for a specific event
   * Calls real staging server GET /event/:eventId/departure
   */
  departures: async (eventId: string, params?: Record<string, any>) => {
    const { data } = await api.get<SuccessListApiResponse<EventDepartureListResponse[]>>(
      `/event/${eventId}/departure`,
      {
        params,
        paramsSerializer: { indexes: null },
      }
    );
    return data.body;
  },

  /**
   * Fetch event categories / types
   * Calls real staging server GET /event/type
   */
  types: async (params?: Record<string, any>) => {
    const { data } = await api.get<SuccessListApiResponse<EventTypeListResponse[]>>(
      "/event/type",
      {
        params,
        paramsSerializer: { indexes: null },
      }
    );
    return data.body;
  },

  /**
   * Fetch master event attributes (facilities, includes, excludes)
   * Calls real staging server GET /event/attribute
   */
  attributes: async (params?: Record<string, any>) => {
    const { data } = await api.get<SuccessListApiResponse<EventAttributeItem[]>>(
      "/event/attribute",
      {
        params: { limit: 100, ...params },
        paramsSerializer: { indexes: null },
      }
    );
    return data.body;
  },
};

export default eventApi;
