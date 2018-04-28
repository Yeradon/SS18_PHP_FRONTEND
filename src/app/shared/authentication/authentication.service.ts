import { Injectable } from '@angular/core';
import {Router} from "@angular/router";

@Injectable()
export class AuthenticationService {

  private _isLoggedIn = false;

  get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }

  constructor(
    private router: Router,
  ) {}

  login(user: string, password: string) {
    if(user === "test" && password === "test") {
      this._isLoggedIn = true;
    }
    this.router.navigate(['']);
  }

  logout() {
    this._isLoggedIn = false;
    this.router.navigate(['']);
  }
}
