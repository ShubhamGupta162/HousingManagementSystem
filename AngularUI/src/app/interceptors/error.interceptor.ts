import { HttpInterceptorFn, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError, of } from 'rxjs';
import { ErrorService } from '../services/error.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorService = inject(ErrorService);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        // Any 2xx status means the HTTP operation succeeded on the server.
        // Angular wraps it in an error only if the server returned plain text or empty body instead of JSON.
        if (error.status >= 200 && error.status < 300) {
          const rawText = error.error?.text || (typeof error.error === 'string' ? error.error : 'Success');
          return of(new HttpResponse({
            status: error.status,
            statusText: error.statusText || 'OK',
            body: {
              success: true,
              message: rawText,
              data: rawText
            }
          }));
        }

        let title = 'Server Communication Error';
        let userMessage = 'An unexpected error occurred while communicating with the server.';

        if (error.status === 0) {
          title = 'Network / Connection Offline';
          userMessage = 'Unable to reach the server. Please verify that the API Gateway (http://localhost:5000) and your network connection are active.';
        } else if (error.status === 400) {
          title = 'Invalid Request';
          userMessage = error.error?.message || 'The data provided was invalid or failed validation criteria.';
        } else if (error.status === 401) {
          title = 'Authentication Required';
          userMessage = 'Your session has expired or you are not authorized. Please log in.';
        } else if (error.status === 403) {
          title = 'Access Denied';
          userMessage = 'You do not have administrative or role-based permission for this action.';
        } else if (error.status === 404) {
          title = 'Resource Not Found';
          userMessage = error.error?.message || 'The requested resource could not be found on the server.';
        } else if (error.status === 409) {
          title = 'Conflict';
          userMessage = error.error?.message || 'A conflict occurred. A record with these unique details may already exist.';
        } else if (error.status >= 500) {
          title = 'Internal Server Error';
          userMessage = error.error?.message || 'The server encountered an error processing your request. Please try again shortly.';
        }

        const technical = typeof error.error === 'string' 
          ? error.error 
          : JSON.stringify(error.error || error.message);

        // Only display modal if not a background/offline fallback route
        errorService.showError({
          title,
          message: userMessage,
          statusCode: error.status,
          technicalDetails: technical
        });
      } else {
        errorService.showError({
          title: 'Client Runtime Error',
          message: 'An unexpected application error occurred.'
        });
      }

      return throwError(() => error);
    })
  );
};
