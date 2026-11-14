import { Injectable, signal, computed } from '@angular/core';

export interface AppError {
  title: string;
  message: string;
  statusCode?: number;
  technicalDetails?: string;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  readonly currentError = signal<AppError | null>(null);
  readonly hasError = computed(() => this.currentError() !== null);

  showError(err: Partial<AppError> & { message: string }): void {
    this.currentError.set({
      title: err.title || 'An Error Occurred',
      message: err.message,
      statusCode: err.statusCode,
      technicalDetails: err.technicalDetails,
      timestamp: err.timestamp || new Date()
    });
  }

  clearError(): void {
    this.currentError.set(null);
  }
}
