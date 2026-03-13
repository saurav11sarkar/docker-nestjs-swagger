import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable()
export class UtilsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const res = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map((response: any) => {
        if (
          res &&
          typeof response === 'object' &&
          ('data' in response || 'message' in response)
        ) {
          return {
            statusCode: res.statusCode,
            success: res.statusCode >= 200 && res.statusCode < 300,
            message: (response as { message?: string }).message ?? null,
            meta: (response as { meta?: any }).meta,
            data: (response as { data?: any }).data,
          };
        } else {
          return {
            statusCode: res.statusCode,
            success: true,
            message:
              (response as { meta?: string }).meta ??
              `Request successfully completed`,
            meta: undefined,
            data: response,
          };
        }
      }),
      catchError((error) => {
        return throwError(() => error);
      }),
    );
  }
}
