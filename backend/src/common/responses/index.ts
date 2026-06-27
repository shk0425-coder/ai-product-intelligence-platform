export interface SuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export const successResponse = <T>(data: T, message: string = ''): SuccessResponse<T> => {
  return {
    success: true,
    data,
    message,
  };
};

export const errorResponse = (code: string, message: string): ErrorResponse => {
  return {
    success: false,
    error: {
      code,
      message,
    },
  };
};
