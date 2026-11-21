export interface MetaListResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SuccessApiResponse<
  T,
  M extends MetaListResponse | void = void,
> {
  status: number;
  body: {
    isError: boolean;
    message: string;
    data: T;
    meta?: M;
  };
}

export interface SuccessListApiResponse<T>
  extends SuccessApiResponse<T, MetaListResponse> {}

export interface ErrorApiResponse {
  message: string;
  status: number;
}

export interface BackendValidationErrorDetail {
  code: string;
  message: string;
  path: string[];
  origin?: string;
  minimum?: number;
  inclusive?: boolean;
}

export interface BackendValidationErrorResponse {
  type: string;
  on: string;
  property?: string;
  message: string;
  found?: Record<string, unknown>;
  errors?: BackendValidationErrorDetail[];
}

export interface QueryConfig {
  enabled?: boolean;
  retry?: number | boolean;
  staleTime?: number;
}
