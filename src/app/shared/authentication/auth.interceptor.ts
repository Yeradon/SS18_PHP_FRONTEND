import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpResponse
} from '@angular/common/http';

import {AuthenticationService} from "./authentication.service";
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import {ErrorObservable} from "rxjs-compat/observable/ErrorObservable";
import { Observable } from 'rxjs/Rx';
import { MessageService } from '../message/message.service';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
  constructor(
    private auth: AuthenticationService,
    private message: MessageService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.auth.isLoggedIn) {
      const newReq = req.clone({
        headers: req.headers.set('Authentication', this.auth.getToken())
      });
      return next
        .handle(newReq)
        .pipe(
          catchError((err: HttpEvent<any>, caught) => {
            if (err instanceof HttpErrorResponse) {
              if (err.status == 401) {
                this.auth.logout();
                this.message.add('Deine Session ist abgelaufen');
              }
              return throwError(err);
            }
          })
        );
    }
    return next.handle(req);
  }
}
