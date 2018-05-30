import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminPopupComponent } from '../admin-popup/admin-popup.component';
import { UserService } from '../shared/user/user.service';
import { CHANGE_MODE, ChangeEvent } from '../shared/task/task.service';
import { User } from '../shared/user/user';
import { UserDisplayable } from '../shared/user/user.displayable';
import { AuthenticationService } from '../shared/authentication/authentication.service';
import { MessageService } from '../shared/message/message.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  public hiddenUsers: number;
  public hiddenAdmins: number;
  public users: UserDisplayable[] = [];
  public user: User;
  public filter: string;

  public user2BeDeleted: User;

  @ViewChild(AdminPopupComponent)
  private adminPopup: AdminPopupComponent;

  constructor(
    private userService: UserService,
    private authService: AuthenticationService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.userService.loadUsers();
    this.userService.changeObservable.subscribe(
      (event: ChangeEvent<User>) => {
        let u, index;
        switch (event.mode) {
        case CHANGE_MODE.ADDED:
            u = event.newVal;
            this.users.push(new UserDisplayable(u.username, u.name, u.surname, u.role));
            break;
          case CHANGE_MODE.DELETED:
              u = event.oldVal;
              this.users.splice(this.findUserInList(u, this.users), 1);
            break;
          case CHANGE_MODE.CHANGED:
              u = event.oldVal;
              index = this.findUserInList(u, this.users);
              this.users[index] = this.generateDisplayableUser(event.newVal);
            break;
        }
      }
    );
    this.user = this.authService.getUser();
  }

  public filter_onInput(): void {
    this.hiddenUsers = this.filterList(this.users, this.filter);
  }

  public filter_onReset(): void {
    this.filter = '';
    this.hiddenUsers = this.filterList(this.users, this.filter);
  }

  public deleteUser(user: UserDisplayable) {
    if (user.username != this.user.username) {
      this.user2BeDeleted = user;
      this.adminPopup.show();
    }
  }

  public setUserRole(user: UserDisplayable, roleID: string) {
    if (user.username != this.user.username) {
      let data = { role: roleID };
      this.userService.modifyUser(user, data).then( user => {

      }, (err) => {
        this.messageService.add('Beim Setzten der Rolle ist ein Fehler aufgetreten: '+err.message);
      });
    }
  }

  private filterList(list: UserDisplayable[], filter: string): number {
    var hidden = 0;

    for (let u of list) {
      if (u.username.indexOf(filter) < 0) {
        u.setHidden(true);
        hidden++;
      } else {
        u.setHidden(false);
      }
    }

    return hidden;
  }

  private findUserInList(u: User, list: UserDisplayable[]): number {
    list.forEach((user, index) => {
      if (user.username == u.username) {
        return index;
      }
    });
    return null;
  }

  private generateDisplayableUsers(users: User[]): UserDisplayable[] {
    var result: UserDisplayable[] = [];

    for (let u of users) {
      result.push(this.generateDisplayableUser(u));
    }

    return result;
  }

  private generateDisplayableUser(u: User): UserDisplayable {
    return new UserDisplayable(u.username, u.name, u.surname, u.role);
  }
}
