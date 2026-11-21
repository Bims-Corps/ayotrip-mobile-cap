import { eventApi } from "@/services/eventApi";
import type {
  EventListResponse,
  EventDetailResponse,
  EventDepartureListResponse,
  TripType,
  EventListQueryParams,
} from "@/types/event.type";

export type {
  EventListResponse as EventItem,
  EventDetailResponse as EventDetail,
  EventDepartureListResponse as EventDeparture,
  TripType,
};

export type EventFilterParams = EventListQueryParams & {
  sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'duration' | 'capacity' | 'popular';
};

export interface EventMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface EventApiResponse {
  status: number;
  body: {
    isError: boolean;
    message: string;
    data: EventListResponse[];
    meta: EventMeta;
  };
}

export interface EventDetailApiResponse {
  status: number;
  body: {
    isError: boolean;
    message: string;
    data: EventDetailResponse;
  };
}

// Fallback image helper if backend doesn't provide coverImage directly
export const getEventCoverImage = (item: { coverImage?: string; tag?: string[]; name?: string }): string => {
  if (item.coverImage) return item.coverImage;
  const nameLower = (item.name || '').toLowerCase();
  if (nameLower.includes('kawah') || nameLower.includes('putih')) {
    return 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=800&q=80';
  }
  if (nameLower.includes('sepatu') || nameLower.includes('roda') || nameLower.includes('bandung')) {
    return 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80';
  }
  if (nameLower.includes('borobudur') || nameLower.includes('candi')) {
    return 'https://images.unsplash.com/photo-1605649487212-47bdab064df8?auto=format&fit=crop&w=800&q=80';
  }
  if (nameLower.includes('bromo')) {
    return 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80';
  }
  return 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80';
};

// Local storage key for user favorites
const LIKES_KEY = 'ayotrip_event_likes';

const getStoredLikes = (): Record<string, number> => {
  try {
    const raw = localStorage.getItem(LIKES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

export const eventService = {
  /**
   * Fetch events list from real staging server with query parameters
   */
  getEvents: async (params?: EventFilterParams): Promise<EventApiResponse> => {
    try {
      const responseBody = await eventApi.list({
        search: params?.search,
        page: params?.page || 1,
        limit: params?.limit || 20,
        tripType: params?.tripType,
        sort: params?.sortBy === 'price_desc' ? 'desc' : 'asc',
        sortTarget: params?.sortBy === 'price_asc' || params?.sortBy === 'price_desc' ? 'startPrice' : undefined,
      });

      // Enhance items with cover images & local likes
      const storedLikes = getStoredLikes();
      const enhancedData = (responseBody.data || []).map((item) => ({
        ...item,
        coverImage: getEventCoverImage(item),
        liked: (item.liked || 0) + (storedLikes[item.id] ? 1 : 0),
      }));

      return {
        status: 200,
        body: {
          isError: responseBody.isError,
          message: responseBody.message,
          data: enhancedData,
          meta: responseBody.meta || {
            total: enhancedData.length,
            page: 1,
            limit: 20,
            totalPages: 1,
          },
        },
      };
    } catch (networkError) {
      console.warn("Koneksi staging API /event gagal:", networkError);
      throw networkError;
    }
  },

  /**
   * Fetch event detail by ID or Slug from real staging server
   */
  getEventDetailById: async (id: string): Promise<EventDetailApiResponse> => {
    try {
      const responseBody = await eventApi.detail(id);
      const eventDetail = responseBody.data;

      // If eventDepartures is empty in detail response, fetch departures endpoint directly
      if (!eventDetail.eventDepartures || eventDetail.eventDepartures.length === 0) {
        try {
          const departureBody = await eventApi.departures(eventDetail.id);
          eventDetail.eventDepartures = departureBody.data || [];
        } catch {
          eventDetail.eventDepartures = [];
        }
      }

      // Automatically map numeric attribute IDs to human-readable names if necessary
      const hasNumericIncludes = eventDetail.attributesInclude?.some((a) => !isNaN(Number(a)));
      const hasNumericExcludes = eventDetail.attributesExclude?.some((a) => !isNaN(Number(a)));

      if (hasNumericIncludes || hasNumericExcludes) {
        try {
          const attrRes = await eventApi.attributes();
          const attrMap = new Map((attrRes.data || []).map((a) => [String(a.id), a.name]));
          if (eventDetail.attributesInclude) {
            eventDetail.attributesInclude = eventDetail.attributesInclude.map(
              (a) => attrMap.get(String(a)) || a
            );
          }
          if (eventDetail.attributesExclude) {
            eventDetail.attributesExclude = eventDetail.attributesExclude.map(
              (a) => attrMap.get(String(a)) || a
            );
          }
        } catch {
          // If master attributes lookup fails, proceed with raw values
        }
      }

      eventDetail.coverImage = getEventCoverImage(eventDetail);

      return {
        status: 200,
        body: {
          isError: responseBody.isError,
          message: responseBody.message,
          data: eventDetail,
        },
      };
    } catch (networkError) {
      console.warn(`Koneksi staging API /event/${id} gagal:`, networkError);
      throw networkError;
    }
  },

  /**
   * Toggle like state for an event locally
   */
  toggleLike: (id: string): { liked: boolean; count: number } => {
    const storedLikes = getStoredLikes();
    let isLiked = false;
    if (storedLikes[id]) {
      delete storedLikes[id];
      isLiked = false;
    } else {
      storedLikes[id] = 1;
      isLiked = true;
    }
    try {
      localStorage.setItem(LIKES_KEY, JSON.stringify(storedLikes));
      window.dispatchEvent(new Event('ayotrip_likes_updated'));
    } catch (e) {
      console.error(e);
    }
    return { liked: isLiked, count: isLiked ? 1 : 0 };
  },

  isEventLiked: (id: string): boolean => {
    const storedLikes = getStoredLikes();
    return Boolean(storedLikes[id]);
  },
};
