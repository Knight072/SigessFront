import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(
    (source) => new (source.constructor as any)((subscriber: any) =>
      source.subscribe({
        next: (v: any) => subscriber.next(v),
        complete: () => subscriber.complete(),
        error: (err: HttpErrorResponse) => {
          const msg =
            err?.error?.message ||
            err?.error?.error ||
            err.message ||
            'Error inesperado';

          subscriber.error(new Error(msg));
        }
      })
    )
  );
