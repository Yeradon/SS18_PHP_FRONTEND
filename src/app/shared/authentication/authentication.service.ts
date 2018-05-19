import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from '../message/message.service';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {isNullOrUndefined} from 'util';
import { Subject } from 'rxjs';
import { User } from '../user/user';

enum Authentication_EVENTS {
  LOGIN,
  LOGOUT
}
@Injectable()
export class AuthenticationService {
  private _isLoggedIn = false;

  public readonly eventObservable = new Subject<Authentication_EVENTS>();

  get isLoggedIn(): boolean {
    return !isNullOrUndefined(localStorage.getItem('auth'));
  }

  constructor(private router: Router, private messageService: MessageService, private http: HttpClient) {}

  async login(user: string, password: string) {
    localStorage.removeItem('user');
    return new Promise<void>((resolve, reject) => {
      this.http
        .post<any[]>(environment.BACKEND_URL + 'login', {
          username: user,
          password: password
        })
        .subscribe(
          res => {
            localStorage.setItem('user', JSON.stringify(res[0]));

            localStorage.setItem('auth', res[1].token);
            this._isLoggedIn = true;
            this.eventObservable.next(Authentication_EVENTS.LOGIN);
            this.router.navigate(['']);
            resolve();
          },
          err => {
            if (err instanceof HttpErrorResponse) {
              if (err.status >= 500) {
                this.messageService.add(
                  'Der Service ist momentan nicht verfügbar!'
                );
              } else {
                if (err.status == 403) {
                  this.messageService.add(
                    'Nutzername oder Passwort inkorrekt'
                  );
                } else {
                  this.messageService.add(
                    'Fehler beim Login: ' + err.message
                  );
                }
              }
            }
            reject(err);
          }
        );
    })
  }

  register(user: string, name: string, surname: string, passwd: string) {
    return new Promise<void>((resolve, reject) => {
      this.http
        .put<any[]>(environment.BACKEND_URL + 'user', {
          username: user,
          password: passwd,
          name: name,
          surname: surname
        })
        .subscribe(
          res => {
            this.login(user, passwd);
            resolve();
          },
          err => {
            if (err instanceof HttpErrorResponse) {
              if (err.status >= 500) {
                this.messageService.add(
                  'Der Service ist momentan nicht verfügbar!'
                );
              } else {
                if (err.status == 409) {
                  this.messageService.add(
                    'Benutzername bereits vorhanden.'
                  );
                } else {
                  this.messageService.add(
                    'Fehler beim Registrieren: ' + err.message
                  );
                }
              }
            }
            reject(err);
          }
        );
    }
  }

  getToken(): string {
    return localStorage.getItem('auth');
  }

  getUser(): User {
    return JSON.parse(localStorage.getItem('user'));
  }

  isAdmin(): boolean {
    if(!isNullOrUndefined(this.getUser()) && this.getUser().role == "1") {
      return true;
    } else {
      return false;
    }
  }

  logout() {
    localStorage.removeItem('auth');
    localStorage.removeItem('user');
    this.eventObservable.next(Authentication_EVENTS.LOGOUT);
    this.router.navigate(['login']);
  }
}
