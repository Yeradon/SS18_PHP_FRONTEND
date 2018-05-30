import { Injectable } from '@angular/core';
import { MessageService } from '../message/message.service';
import { User } from './user';
import { AuthenticationService } from '../authentication/authentication.service';
import { HttpClient } from '@angular/common/http';
import { isNullOrUndefined } from 'util';
import { environment } from '../../../environments/environment';
import { CHANGE_MODE, ChangeEvent } from '../task/task.service';
import { Subject } from 'rxjs/Rx';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  users: User[] = [];

  changeObservable: Subject<ChangeEvent<User>> = new Subject<ChangeEvent<User>>();
  constructor( private messageService: MessageService, private authService: AuthenticationService, private http: HttpClient) {

  }

  public async loadUser(): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      let user = localStorage.getItem('user');
      if(isNullOrUndefined(user)) {
        this.http.get<User>(environment.BACKEND_URL + "me").subscribe((user) => {
          localStorage.setItem('user', JSON.stringify(user))
          resolve(user);
        }), (err) => {
          reject(err);
        }
      } else {
        resolve(JSON.parse(user));
      }
    });
  }

  public async loadUsers(): Promise<User[]> {
    return new Promise<User[]>((resolve, reject) => {
        this.http.get<User[]>(environment.BACKEND_URL + "user").subscribe((users) => {
          this.users.forEach((user) => {
            this.changeObservable.next(new ChangeEvent<User>(CHANGE_MODE.DELETED, user, null));
          });
          this.users = users;
          this.users.forEach((user) => {
            this.changeObservable.next(new ChangeEvent<User>(CHANGE_MODE.ADDED, null, user));
          });
          resolve(users);
        }), (err) => {
          reject(err);
        }
    });
  }

  public async deleteUser(user: User) {
    return new Promise<void>((resolve, reject) => {
      this.http.delete(environment.BACKEND_URL + "user/" + user.username).subscribe(() => {
        this.users.splice(this.users.indexOf(user), 1);
        this.changeObservable.next(new ChangeEvent<User>(CHANGE_MODE.DELETED, user, null));
        resolve();
      }, (err) => {
        this.messageService.add("Fehler beim Löschen von " + user.username + ": " + err.message ? err.message : err);
        reject(err);
      })
    });
  }

  /**
   * Attempts to modify a user ressource. The primary
   * @param {User} user The user to be modified
   * @param data Object with changed Data. Primary Key (username can't be changed). If the password should be changed the old and the new password have t
   * @returns {Promise<User>}
   */
  public async modifyUser(user: User, data: any): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      this.http.post<User>(environment.BACKEND_URL + "user/" + user.username, data).subscribe((newUser) => {
        this.changeObservable.next(new ChangeEvent<User>(CHANGE_MODE.CHANGED, user, new User));
        resolve(newUser);
      }, (err) => {
        reject(err);
      });
    })
  }
}
