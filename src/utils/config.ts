export const STALE_TIME = 1000 * 60 * 3;

export const API_ENDPOINT =
  (typeof import.meta !== "undefined" &&
    (import.meta.env?.VITE_API_ENDPOINT || import.meta.env?.VITE_API_URL)) ||
  "https://api-ayotrip.bmstudio.my.id";

export const WS_ENDPOINT =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_WS_ENDPOINT) ||
  "wss://api-ayotrip.bmstudio.my.id/socket";

export const ACCESS_TOKEN_EXPIRES_HOURS = Number(
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_ACCESS_TOKEN_EXPIRES_HOURS) || 1,
);

export const REFRESH_TOKEN_EXPIRES_DAYS = Number(
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_REFRESH_TOKEN_EXPIRES_DAYS) || 7,
);
