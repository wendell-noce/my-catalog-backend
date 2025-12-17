import {
  ApiResponse,
  PaginatedResponse,
} from '../interfaces/api-response.interface';

export class ResponseHelper {
  static success<T>(
    data: T,
    message: string = 'Operation successful',
  ): ApiResponse<T> {
    return {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  static paginated<T>(
    data: T[],
    total: number,
    page: number,
    limit: number,
    message: string = 'Data retrieved successfully',
  ): PaginatedResponse<T> {
    return {
      success: true,
      message,
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      timestamp: new Date().toISOString(),
    };
  }

  static error(
    message: string,
    statusCode: number = 400,
  ): {
    success: boolean;
    message: string;
    statusCode: number;
    timestamp: string;
  } {
    return {
      success: false,
      message,
      statusCode,
      timestamp: new Date().toISOString(),
    };
  }
}
