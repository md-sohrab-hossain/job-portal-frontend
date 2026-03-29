import { Role } from "./user";

export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  data?: T;
  message?: string;
  error?: string;
  details?: Record<string, string[]>;
}

export interface ApiError {
  error: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
