import { Injectable } from '@angular/core';
import { User } from './shared/user/user';

const USER: User = {
  id: '0',
  username: 'test',
  name: 'Max',
  surname: 'Mustermann',
  tasks: null
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  public loadUser(): User {
    return USER;
  }

}
