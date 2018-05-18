import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../shared/user/user.service';
import { User } from '../shared/user/user';

@Component({
  selector: 'app-admin-popup',
  templateUrl: './admin-popup.component.html',
  styleUrls: ['./admin-popup.component.css']
})
export class AdminPopupComponent implements OnInit {

  @Input() public user: User;

  noDisplay: boolean = true;

  constructor( private userService: UserService ) { }

  ngOnInit() {
  }

  public show(): void {
    this.noDisplay = false;
  }

  public hide(): void {
    this.noDisplay = true;
  }

  public delete(): void {
    this.userService.deleteUser(this.user);
    this.hide();
  }

}
