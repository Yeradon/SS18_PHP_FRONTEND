import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../shared/authentication/authentication.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: string = "";
  password: string = "";
  constructor(
    private authService: AuthenticationService
  ) { }

  ngOnInit() {
  }

  login() {
    this.authService.login(this.user, this.password);
  }
}
