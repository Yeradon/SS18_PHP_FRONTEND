import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminPopupComponent } from '../admin-popup/admin-popup.component';
import { UserService } from '../shared/user/user.service';
import { User } from '../shared/user/user';
import { UserDisplayable } from '../shared/user/user.displayable';
import { AuthenticationService } from '../shared/authentication/authentication.service';

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
    private authService: AuthenticationService
  ) { }

  ngOnInit() {
    this.userService.loadUsers().then((users) => {
      this.users = this.generateDisplayableUsers(users);
    });

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

  private generateDisplayableUsers(users: User[]): UserDisplayable[] {
    var result: UserDisplayable[] = [];

    for (let u of users) {
      result.push(new UserDisplayable(u.username, u.name, u.surname, u.role));
    }

    return result;
  }
}
