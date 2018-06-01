import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../shared/authentication/authentication.service';
import { UserService } from '../shared/user/user.service';
import { User} from '../shared/user/user';
import { CHANGE_MODE, ChangeEvent } from '../shared/task/task.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
  /*
   * Klasse zur Verwaltung der Komponente "Menu"
   */
export class MenuComponent implements OnInit {

  public showNav = false;
  public user: User;

    /*
     * Initialisiert eine neue Komponente
     */
  constructor(
    private authService: AuthenticationService,
    private userService: UserService,
    private router: Router
  ) {
    this.userService.loadUser().then((user) => {
      this.user = user;
    });
  }

    /*
     * Beginnt mit der Ueberwachung des eigenen User-Objekts, um auf
     * Aenderungen zu reagieren
     */
  ngOnInit(
  ) {
    this.userService.changeObservable.subscribe(
      (event: ChangeEvent<User>) => {
        const u = event.oldVal;
        switch (event.mode) {
          case CHANGE_MODE.CHANGED:
              if (u.username === this.user.username) {
                this.user = event.newVal;
              }
              break;
        }
      }
    );
  }

    /*
     * Beende die Sitzung und meldet den User ab.
     */
  logout() {
    this.authService.logout();
    this.showNav = false;
  }

    /*
     * Navigiert auf eine bestimmte Seite und schliesst das Menu
     */
  public navigateTo(x: string): void {
    this.router.navigate([x]);
    this.showNav = false;
  }
}
