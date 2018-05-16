import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from '../message/message.service';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {isNullOrUndefined} from "util";

@Injectable()
export class AuthenticationService {
  private _isLoggedIn = false;

  get isLoggedIn(): boolean {
    return !isNullOrUndefined(localStorage.getItem('auth'));
  }

  constructor(private router: Router, private messageService: MessageService, private http: HttpClient) {}

  login(user: string, password: string) {
    this.http.post(environment.BACKEND_URL + 'login',{username: user, password: password}, {responseType: "text"}).subscribe( (res: string) => {
      localStorage.setItem('auth', res);
      this._isLoggedIn = true;
      this.router.navigate(['']);
    }, (err) => {
      if(err instanceof HttpErrorResponse) {
        if(err.status >= 500) {
          this.messageService.add("Der Service ist momentan nicht verfügbar!");
        } else {
          if(err.status == 403) {
            this.messageService.add("Nutzername oder Passwort inkorrekt");
          } else {
            this.messageService.add("Fehler beim Login: " + err.message);
          }
        }
      }
    });
  }

  getToken(): string {
    return localStorage.getItem('auth');
  }

  logout() {
    localStorage.removeItem('auth');
    this.router.navigate(['login']);
  }
}
