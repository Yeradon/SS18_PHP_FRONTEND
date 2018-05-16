import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpResponse
} from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import {AuthenticationService} from "./authentication.service";
import {catchError, throwError} from "rxjs/operators";
import {ErrorObservable} from "rxjs-compat/observable/ErrorObservable";

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
  constructor(private auth: AuthenticationService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(this.auth.isLoggedIn) {
      const newReq = req.clone({
        headers: req.headers.set('Authentication', this.auth.getToken())
      });
      return next.handle(newReq).pipe(catchError((err, caught) => {
        if(err instanceof HttpErrorResponse) {
          if(err.status == 401) {
            this.auth.logout();
          }
        }
        return throwError(err);
      }));
    }
    return next.handle(req);
  }
}
