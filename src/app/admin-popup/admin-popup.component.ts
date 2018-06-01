import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../shared/user/user.service';
import { User } from '../shared/user/user';

@Component({
  selector: 'app-admin-popup',
  templateUrl: './admin-popup.component.html',
  styleUrls: ['./admin-popup.component.css']
})
  /*
   * Klasse zur Verwaltung der Komponente "Admin-Popup"
   */
export class AdminPopupComponent implements OnInit {

  @Input() public user: User;

  noDisplay: boolean = true;

    /*
     * Initialisiert eine neue Komponente
     */
  constructor( private userService: UserService ) { }

  ngOnInit() {
  }

    /*
     * Zeigt das Popup
     */
  public show(): void {
    this.noDisplay = false;
  }

    /*
     * Verbirgt das Popup
     */
  public hide(): void {
    this.noDisplay = true;
  }

    /*
     * Loescht einen User auf dem Server
     */
  public delete(): void {
    this.userService.deleteUser(this.user);
    this.hide();
  }

}
