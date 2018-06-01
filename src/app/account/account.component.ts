import { Component, OnInit } from '@angular/core';
import { User } from '../shared/user/user';
import { UserService } from '../shared/user/user.service';
import { AuthenticationService } from '../shared/authentication/authentication.service';
import { MessageService } from '../shared/message/message.service';
import { HttpErrorResponse } from '@angular/common/http';

const TEXT_CHANGE_PASSWD: string = 'Passwort ändern';
const TEXT_DELETE_ACCOUNT: string = 'Konto löschen';
const TEXT_CANCEL: string = 'Abbrechen';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
/*
 * Klasse zur Verwaltung der Komponente "Account"
 */
export class AccountComponent implements OnInit {
  public user: User;
  public showChangePassword: boolean = false;
  public showDeleteAccount: boolean = false;
  public textChangePassword: string = TEXT_CHANGE_PASSWD;
  public textDeleteAccount: string = TEXT_DELETE_ACCOUNT;
  public oldPasswd: string = '';
  public newPasswd: string = '';
  public newPasswdRepeat: string = '';
  public isLoading: boolean = false;

  /*
   * Initialisiert eine neue Komponente.
   */
  constructor(private userService: UserService, private authService: AuthenticationService, private messageService: MessageService) {}

  /*
   * Laedt das eigene User-Objekt
   */
  ngOnInit() {
    this.userService.loadUser().then((user) => {
      this.user = user;
    });
  }

  /*
   * Zeigt oder versteckt den Bereich zum Aendern des Passworts.
   */
  toggleChangePassword(): void {
    this.showChangePassword = !this.showChangePassword;
    this.textChangePassword = this.showChangePassword
      ? TEXT_CANCEL
      : TEXT_CHANGE_PASSWD;
  }

  /*
   * Zeigt oder verbirgt den Bereich zum Loeschen des Accounts.
   */
  toggleDeleteAccount(): void {
    this.showDeleteAccount = !this.showDeleteAccount;
    this.textDeleteAccount = this.showDeleteAccount
      ? TEXT_CANCEL
      : TEXT_DELETE_ACCOUNT;
  }

  /*
   * Aktualisiert den Account auf dem Server.
   */
  updateAccount() {

    console.log('updateAccount: START');
    let data = {};

    if (this.showChangePassword) {
      // Aenderung des Passworts angefordert
      if (this.newPasswd != this.newPasswdRepeat) {
        // Aenderung des Passworts abgelehnt
        this.messageService.add('Das neue Passwort und die Wiederholung des neuen Passworts stimmen nicht überein.');
        return;
      } else {
        // Aenderung des Passworts Initialisieren
        data = {
          name: this.user.name,
          surname: this.user.surname,
          oldPassword: this.oldPasswd,
          newPassword: this.newPasswd
        }
      }
    } else {
      // Aenderung des Passworts nicht angefordert
      // Einfache Aenderung der User-Informationen Initialisieren
      data = {
        name: this.user.name,
        surname: this.user.surname
      }
    }

    // Request ausfuehren
    this.isLoading = true;
    this.userService.modifyUser(this.user, data).then( user => {
        this.isLoading = false;
        localStorage.setItem('user', JSON.stringify(user));
        this.userService.loadUser();
        this.messageService.add('Änderungen wurden gespeichert.');
        if (this.showChangePassword) {
          this.toggleChangePassword();
        }
    }, (err) => {
        this.isLoading = false;

        if (err instanceof HttpErrorResponse && err.status == 403) {
          this.messageService.add('Das Passwort ist nicht korrekt. Bitte versuche es erneut.');
        } else {
          this.messageService.add('Es ist ein Fehler aufgetreten: ' + err.message);
        }

        this.userService.loadUser().then((user) => {
          this.user = user;
        });
    });

    this.oldPasswd = '';
    this.newPasswd = '';
    this.newPasswdRepeat = '';
  }

  /*
   * Loescht einen Account auf dem Server und meldet den User anschließend ab.
   */
  removeAccount() {
    this.userService.loadUser().then(user => {
      this.userService.deleteUser(user).then( user => {
      }, (err) => {
        this.messageService.add("Fehler beim Löschen des Benutzeraccounts: "+ err);
      })
    });
  }
}
