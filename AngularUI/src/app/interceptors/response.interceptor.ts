import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs';

/**
 * Normalizes direct API responses from backend (e.g. direct Ok(data))
 * into { success: true, message: 'Success', data: ... } for Angular components.
 */
export const responseInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    map(event => {
      if (event instanceof HttpResponse && event.body !== null && event.body !== undefined) {
        const body = event.body;
        // If the body is already wrapped with success and data, leave it as is
        if (typeof body === 'object' && ('success' in body || 'data' in body)) {
          return event;
        }
        // Normalize direct responses
        return event.clone({
          body: {
            success: true,
            message: 'Success',
            data: body
          }
        });
      }
      return event;
    })
  );
};
