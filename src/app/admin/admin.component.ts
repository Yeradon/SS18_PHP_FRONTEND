import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../shared/user/user';
import { UserDisplayable } from '../shared/user/user.displayable';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  public hiddenUsers: number;
  public hiddenAdmins: number;
  public users: UserDisplayable[];
  public admins: UserDisplayable[];
  public filter: string;

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {

    var usersLoaded: User[] = this.userService.loadUsers();
    var adminsLoaded: User[] = this.userService.loadAdmins();

    this.users = this.generateDisplayableUsers(usersLoaded);
    this.admins = this.generateDisplayableUsers(adminsLoaded);

  }

  public filter_onInput(): void {
    this.hiddenUsers = this.filterList(this.users, this.filter);
    this.hiddenAdmins = this.filterList(this.admins, this.filter);
  }

  public filter_onReset(): void {
    this.filter = "";
    this.hiddenUsers = this.filterList(this.users, this.filter);
    this.hiddenAdmins = this.filterList(this.admins, this.filter);
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
      result.push(new UserDisplayable(
        u.id,
        u.username,
        u.name,
        u.surname
      ));
    }

    return result;

  }

}
