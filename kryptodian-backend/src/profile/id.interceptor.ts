import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import * as slugid from 'slugid';

@Injectable()
export class IdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<object> {
    console.log('Before...');
    const request = context.switchToHttp().getRequest();
    return next.handle().pipe(
        map((data) => { 
            return request;
        }),
      );
    }
  }