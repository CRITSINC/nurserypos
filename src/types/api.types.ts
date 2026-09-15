
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  count?: number;
  error?: string | null;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
  };
}