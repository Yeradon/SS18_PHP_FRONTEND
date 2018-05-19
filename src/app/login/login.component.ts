import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../shared/authentication/authentication.service';
import { MessageService } from '../shared/message/message.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user = '';
  password = '';
  isLoading = false;
  showForm = 0;

  regUser = '';
  regPasswd = '';
  regPasswdRepeat = '';
  regName = '';
  regSurname = '';

  constructor(
    private authService: AuthenticationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {}

  login() {
    this.isLoading = true;
    this.authService.login(this.user, this.password).then(() => {
      this.isLoading = false;
    }, (err) => {
      this.isLoading = false;
    });
  }

  register() {

    if (this.regPasswd != this.regPasswdRepeat) {
      this.messageService.add('Das Passwort und die Wiederholung des Passworts stimmen nicht überein.');
      this.regPasswd = '';
      this.regPasswdRepeat = '';
      return;
    }

    this.isLoading = true;
    this.authService.register(this.regUser, this.regName, this.regSurname, this.regPasswd).then(() => {
      this.isLoading = false;
    }, (err) => {
      this.isLoading = false;
    });
  }

  public show(formId: number): void {
    this.showForm = formId;
  }
}
