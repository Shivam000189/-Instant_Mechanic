export class ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };

  constructor(success: boolean, payload: T | { code: string; message: string; details?: Record<string, unknown> }) {
    this.success = success;
    if (success) {
      this.data = payload as T;
    } else {
      this.error = payload as { code: string; message: string; details?: Record<string, unknown> };
    }
  }
}