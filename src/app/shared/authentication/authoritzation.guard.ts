import { AuthenticationService } from './authentication.service';
import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}
  canActivate() {
    console.log(this.authService.getUser());
    if (this.authService.isAdmin()) {
      return true;
    }
    return false;
  }
}
