import { useQuery } from "@tanstack/react-query";
import { eventApi } from "@/services/eventApi";
import type { EventListQueryParams } from "@/types/event.type";
import type { QueryConfig } from "@/types/core.type";
import { STALE_TIME } from "@/utils/config";

export const eventQueryKeys = {
  all: ["events"] as const,
  list: (params?: EventListQueryParams) => ["events", "list", params] as const,
  detail: (id: string) => ["events", "detail", id] as const,
  departures: (eventId: string) => ["events", "departures", eventId] as const,
  types: ["events", "types"] as const,
};

/**
 * Hook to retrieve live events list with filter and search
 */
export function useEventList(
  params?: EventListQueryParams,
  config?: QueryConfig
) {
  return useQuery({
    queryKey: eventQueryKeys.list(params),
    retry: config?.retry ?? false,
    staleTime: config?.staleTime ?? STALE_TIME,
    enabled: config?.enabled ?? true,
    ...config,
    queryFn: () => eventApi.list(params),
  });
}

/**
 * Hook to retrieve full event detail by event ID
 */
export function useEventDetail(
  eventId: string,
  config?: QueryConfig
) {
  return useQuery({
    queryKey: eventQueryKeys.detail(eventId),
    retry: config?.retry ?? false,
    staleTime: config?.staleTime ?? STALE_TIME,
    enabled: config?.enabled ?? Boolean(eventId),
    ...config,
    queryFn: () => eventApi.detail(eventId),
  });
}

/**
 * Hook to retrieve live departure dates & seat availability for an event
 */
export function useEventDepartures(
  eventId: string,
  params?: Record<string, any>,
  config?: QueryConfig
) {
  return useQuery({
    queryKey: eventQueryKeys.departures(eventId),
    retry: config?.retry ?? false,
    staleTime: config?.staleTime ?? STALE_TIME,
    enabled: config?.enabled ?? Boolean(eventId),
    ...config,
    queryFn: () => eventApi.departures(eventId, params),
  });
}

/**
 * Hook to retrieve event types / trip categories
 */
export function useEventTypes(config?: QueryConfig) {
  return useQuery({
    queryKey: eventQueryKeys.types,
    retry: config?.retry ?? false,
    staleTime: config?.staleTime ?? STALE_TIME,
    enabled: config?.enabled ?? true,
    ...config,
    queryFn: () => eventApi.types(),
  });
}
