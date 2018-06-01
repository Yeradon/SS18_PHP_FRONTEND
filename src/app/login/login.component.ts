import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../shared/authentication/authentication.service';
import { MessageService } from '../shared/message/message.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
  /*
   * Klasse zur Verwaltung der Komponente "Login"
   */
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

    /*
     * Initialisiert eine neue Komponente
     */
  constructor(
    private authService: AuthenticationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {}

    /*
     * Schickt einen Login-Request an den Server
     */
  login() {
    this.isLoading = true;
    this.authService.login(this.user, this.password).then(() => {
      this.isLoading = false;
    }, (err) => {
      this.isLoading = false;
    });
  }

    /*
     * Schickt einen Register-Request an den Server
     */
  register() {

    if (this.regPasswd != this.regPasswdRepeat) {
      // Passwörter stimmen nicht überein - Request wird nicht gesendet
      this.messageService.add('Das Passwort und die Wiederholung des Passworts stimmen nicht überein.');
      this.regPasswd = '';
      this.regPasswdRepeat = '';
      return;
    }

    // Request senden
    this.isLoading = true;
    this.authService.register(this.regUser, this.regName, this.regSurname, this.regPasswd).then(() => {
      this.isLoading = false;
    }, (err) => {
      this.isLoading = false;
    });
  }

    /*
     * Zeigt ein bestimmtes Formular an.
     * 0: Login
     * 1: Registrieren
     * 2: Passwort vergessen
     */
  public show(formId: number): void {
    this.showForm = formId;
  }
}
