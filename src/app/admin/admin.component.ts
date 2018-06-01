import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminPopupComponent } from '../admin-popup/admin-popup.component';
import { UserService } from '../shared/user/user.service';
import { CHANGE_MODE, ChangeEvent } from '../shared/task/task.service';
import { User } from '../shared/user/user';
import { UserDisplayable } from '../shared/user/user.displayable';
import { AuthenticationService } from '../shared/authentication/authentication.service';
import { MessageService } from '../shared/message/message.service';
import {isNullOrUndefined} from "util";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})

  /*
   * Klasse zur Verwaltung der Komponente "Admin"
   */
export class AdminComponent implements OnInit {
  public hiddenUsers: number;
  public hiddenAdmins: number;
  public users: UserDisplayable[] = [];
  public user: User;
  public filter: string;

  public user2BeDeleted: User;

  @ViewChild(AdminPopupComponent)
  private adminPopup: AdminPopupComponent;

    /*
     * Initialisiert eine neue Komponente
     */
  constructor(
    private userService: UserService,
    private authService: AuthenticationService,
    private messageService: MessageService
  ) { }

    /*
     * Laedt alle User-Objekte und beginnt mit der Ueberwachung, um auf
     * Aenderungen zu reagieren
     */
  ngOnInit() {
    if (isNullOrUndefined(this.userService.users)) {
      this.userService.loadUsers();
    } else {
      this.userService.loadUsers().then((users) => {
         this.users = this.generateDisplayableUsers(users);
      });
    }

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

    /*
     * Filtert die Benutzerliste
     */
  public filter_onInput(): void {
    this.hiddenUsers = this.filterList(this.users, this.filter);
  }

    /*
     * Setzt die Filterung der Benutzerliste zurueck
     */
  public filter_onReset(): void {
    this.filter = '';
    this.hiddenUsers = this.filterList(this.users, this.filter);
  }

    /*
     * Loescht einen User auf dem Server.
     */
  public deleteUser(user: UserDisplayable) {
    if (user.username != this.user.username) {
      this.user2BeDeleted = user;
      this.adminPopup.show();
    }
  }

    /*
     * Aendert die Rolle eines Users auf dem Server
     */
  public setUserRole(user: UserDisplayable, roleID: string) {
    if (user.username != this.user.username) {
      let data = { role: roleID };
      this.userService.modifyUser(user, data).then( user => {

      }, (err) => {
        this.messageService.add('Beim Setzten der Rolle ist ein Fehler aufgetreten: '+err.message);
      });
    }
  }

    /*
     * Fuehrt die eigentliche Filterung der Liste aus
     */
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

    /*
     * Durchsucht eine Liste nach einen User
     */
  private findUserInList(u: User, list: UserDisplayable[]): number {
    let _index = null;
    list.forEach((user, index) => {
      if (user.username === u.username) {
        _index = index;
      }
    });
    return _index;
  }

    /*
     * Erschafft anzeigbare User
     */
  private generateDisplayableUsers(users: User[]): UserDisplayable[] {
    var result: UserDisplayable[] = [];

    for (let u of users) {
      result.push(this.generateDisplayableUser(u));
    }

    return result;
  }

    /*
     * Erschafft einen anzeigbaren User
     */
  private generateDisplayableUser(u: User): UserDisplayable {
    return new UserDisplayable(u.username, u.name, u.surname, u.role);
  }
}
