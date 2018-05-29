import { Component, OnInit } from '@angular/core';
import { User } from '../shared/user/user';
import { UserService } from '../shared/user/user.service';
import { AuthenticationService } from '../shared/authentication/authentication.service';
import { MessageService } from '../shared/message/message.service';

const TEXT_CHANGE_PASSWD: string = 'Passwort ändern';
const TEXT_DELETE_ACCOUNT: string = 'Konto löschen';
const TEXT_CANCEL: string = 'Abbrechen';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  public user: User;
  public showChangePassword: boolean = false;
  public showDeleteAccount: boolean = false;
  public textChangePassword: string = TEXT_CHANGE_PASSWD;
  public textDeleteAccount: string = TEXT_DELETE_ACCOUNT;
  public oldPasswd: string;
  public newPasswd: string;
  public newPasswdRepeat: string;
  public isLoading: boolean = false;

  constructor(private userService: UserService, private authService: AuthenticationService, private messageService: MessageService) {}

  ngOnInit() {
    this.userService.loadUser().then((user) => {
      this.user = user;
    });
  }

  toggleChangePassword(): void {
    this.showChangePassword = !this.showChangePassword;
    this.textChangePassword = this.showChangePassword
      ? TEXT_CANCEL
      : TEXT_CHANGE_PASSWD;
  }

  toggleDeleteAccount(): void {
    this.showDeleteAccount = !this.showDeleteAccount;
    this.textDeleteAccount = this.showDeleteAccount
      ? TEXT_CANCEL
      : TEXT_DELETE_ACCOUNT;
  }

  updateAccount() {

    console.log('updateAccount: START');
    let data = {};

    if (this.showChangePassword) {
      console.log('updateAccount: password change requested');
      if (this.newPasswd != this.newPasswdRepeat) {
        this.messageService.add('Das neue Passwort und die Wiederholung des neuen Passworts stimmen nicht überein.');
        console.log('updateAccount: invalid user input');
        console.log('updateAccount: END');
        return;
      } else {
        console.log('updateAccount: password change initialized');
        data = {
          name: this.user.name,
          surname: this.user.surname,
          oldPassword: this.oldPasswd,
          newPassword: this.newPasswd
        }
      }
    } else {
      console.log('updateAccount: user info change only');
      data = {
        name: this.user.name,
        surname: this.user.surname
      }
    }

    console.log('updateAccount: sending request to server');
    this.isLoading = true;
    this.userService.modifyUser(this.user, data).then( user => {
        console.log('updateAccount: request successfull');
        this.isLoading = false;
        this.messageService.add('Änderungen wurden gespeichert.');
    }, (err) => {
        console.log('updateAccount: request failed: '+err);
        this.isLoading = false;
        this.messageService.add("Fehler: "+ err);
        this.userService.loadUser().then((user) => {
          this.user = user;
        });
    });
    console.log('updateAccount: END');
  }

  removeAccount() {
    console.log('removeAccount: START');
    console.log('removeAccount: sending request to server');
    this.userService.loadUser().then(user => {
      this.userService.deleteUser(user).then( user => {
          console.log('removeAccount: request successfull! user will be logged out');
          this.authService.logout();
      }, (err) => {
        console.log('removeAccount: request failed: '+err);
        this.messageService.add("Fehler beim Löschen des Benutzeraccounts: "+ err);
      })
    });
    console.log('removeAccount: END');
  }
}
