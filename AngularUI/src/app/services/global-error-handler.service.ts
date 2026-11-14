import { ErrorHandler, Injectable, Injector, NgZone } from '@angular/core';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandler implements ErrorHandler {
  constructor(
    private injector: Injector,
    private zone: NgZone
  ) {}

  handleError(error: any): void {
    const errorService = this.injector.get(ErrorService);

    // Extract human readable message
    const message = error?.message || (typeof error === 'string' ? error : 'An unexpected application error occurred.');
    const stack = error?.stack || '';

    console.error('[GlobalErrorHandler] Uncaught exception:', error);

    // Run inside Angular zone to ensure UI updates cleanly
    this.zone.run(() => {
      errorService.showError({
        title: 'Application Error',
        message: 'A problem occurred while running the application. Please try again.',
        technicalDetails: `${message}\n${stack}`
      });
    });
  }
}
