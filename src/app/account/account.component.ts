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

  removeAccount() {
    this.userService.loadUser().then(user => {
      this.userService.deleteUser(user).then( user => {
          this.authService.logout();
      }, (err) => {
        this.messageService.add("Fehler beim Löschen des Benutzeraccounts: "+ err);
      })
    });
  }
}
