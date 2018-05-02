import { Injectable } from '@angular/core';
import { User } from './user/user';

const USER: User = {
  id: '0',
  username: 'test',
  name: 'Max',
  surname: 'Mustermann'
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
