import { Catch, RpcExceptionFilter, ArgumentsHost, HttpException } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Catch()
export class AllRpcExceptionsFilter implements RpcExceptionFilter {
  catch(exception: any, host: ArgumentsHost): Observable<any> {
    if (exception instanceof HttpException) {
      return throwError(() => new RpcException(exception.getResponse()));
    }
    return throwError(() => new RpcException(exception.message || exception));
  }
}
