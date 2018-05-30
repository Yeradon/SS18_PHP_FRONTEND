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
export class MenuComponent implements OnInit {

  public showNav = false;
  public user: User;

  constructor(
    private authService: AuthenticationService,
    private userService: UserService,
    private router: Router
  ) {
    this.userService.loadUser().then((user) => {
      this.user = user;
    });
  }

  ngOnInit(
  ) {
    this.userService.loadUsers();
    this.userService.changeObservable.subscribe(
      (event: ChangeEvent<User>) => {
        let u = event.oldVal;
        switch (event.mode) {
        case CHANGE_MODE.ADDED:
            // nothing do here *flies away*
            break;
          case CHANGE_MODE.DELETED:
            // do nothing
            break;
          case CHANGE_MODE.CHANGED:
              if (u.username == this.user.username) {
                this.user = u;
              }
            break;
        }
      }
    );
  }

  logout() {
    this.authService.logout();
    this.showNav = false;
  }

  public navigateTo(x: string): void {
    this.router.navigate([x]);
    this.showNav = false;
  }
}
