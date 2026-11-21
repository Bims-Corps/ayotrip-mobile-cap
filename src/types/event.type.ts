export type TripType = "OPEN_TRIP" | "PRIVATE_TRIP" | "GENERAL";

export const EventAttributeType = ["HIGHLIGHT", "FACILITY", "EXCLUDE"] as const;
export type EventAttributeDataType = (typeof EventAttributeType)[number];

export interface EventDestinationSummary {
  id: string;
  coordinates: string;
  displayName: string;
}

export interface EventRegencySummary {
  id: string;
  name: string;
}

export interface EventProviderSummary {
  id: string;
  brandLegalName: string;
  brandName: string;
  logoUrl: string;
}

export interface EventListResponse {
  id: string;
  providerId: string;
  createdBy: string;
  destinationId: string;
  slug: string;
  name: string;
  dayDuration: number;
  seatCapacity: number;
  summary: string;
  description: string;
  isOnAir: boolean;
  isAllowAddon: boolean;
  attributesInclude: string[];
  attributesExclude: string[];
  tag: string[];
  regencyId: string;
  typeId: string;
  startPrice: string;
  tripType: string;
  createdAt: string;
  updatedAt: string;
  liked: number;
  attended: number;
  destination: EventDestinationSummary;
  eventRegency: EventRegencySummary;
  provider: EventProviderSummary;
  coverImage?: string;
}

export interface EventDepartureListResponse {
  id: string;
  eventId: string;
  tripType: string;
  seatAvailable: number;
  startDate: string;
  endDate: string;
  duration: number;
  isActive: boolean;
  isFull: boolean;
  price: string;
  createdAt: string;
  updatedAt: string;
  addons?: any[];
}

export interface DetailedDestination {
  id: string;
  slug: string;
  displayName: string;
  content: string;
  status: string;
  addressName: string;
  provinceId: string;
  regencyId: string;
  districtId: string;
  villageId: string;
  coordinates: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  village?: {
    id: string;
    districtId: string;
    name: string;
    createdAt: string;
  };
  district?: {
    id: string;
    regencyId: string;
    name: string;
    altName?: string;
    createdAt: string;
  };
  regency?: {
    id: string;
    provinceId: string;
    name: string;
    altName?: string;
    createdAt: string;
  };
  province?: {
    id: string;
    name: string;
    altName?: string;
    createdAt: string;
  };
  creator?: {
    id: string;
    profile: {
      displayName: string;
      avatarUrl?: string | null;
    };
  };
}

export interface EventDetailResponse {
  id: string;
  providerId: string;
  createdBy: string;
  destinationId: string;
  slug: string;
  name: string;
  dayDuration: number;
  seatCapacity: number;
  summary: string;
  description: string;
  isOnAir: boolean;
  isAllowAddon: boolean;
  attributesInclude: string[];
  attributesExclude: string[];
  tag: string[];
  regencyId: string;
  typeId: string;
  startPrice: string;
  tripType: string;
  createdAt: string;
  updatedAt: string;
  liked: number;
  attended: number;
  provider: {
    id?: string;
    brandName: string;
    brandLegalName: string;
    nibNumber?: string;
    logoUrl?: string;
  };
  creator?: {
    id: string;
    profile: {
      displayName: string;
      avatarUrl?: string | null;
    };
  };
  destination: DetailedDestination;
  timeline?: string | null;
  eventDepartures: EventDepartureListResponse[];
  coverImage?: string;
}

export interface EventTypeListResponse {
  id: string;
  slug: string;
  displayName: string;
  shortText: string;
  gallery: string[];
  updatedAt: string;
}

export interface EventListQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  searchTarget?: string;
  sort?: "asc" | "desc";
  sortTarget?: string;
  tripType?: TripType | "ALL";
  isOnAir?: boolean | "ALL" | "ACTIVE" | "INACTIVE";
  tag?: string;
  regencyId?: string;
  destinationId?: string;
  providerId?: string;
}
