import { Injectable } from '@angular/core';
import { User } from './shared/user/user';

const USER: User = {
  id: '0',
  username: 'test',
  name: 'Max',
  surname: 'Mustermann',
  tasks: null
}

const ADMINS: User [] = [
  {id: '0', username: 'test', name: 'Max', surname: 'Mustermann', tasks: null },
  {id: '1', username: 'admin', name: 'Administrator', surname: '', tasks: null }
]

const USERS: User [] = [
  {id: '2', username: 'lskywalker', name: 'Luke', surname: 'Skywalker', tasks: null },
  {id: '3', username: 'hsolo', name: 'Han', surname: 'Solo', tasks: null },
  {id: '4', username: 'owkenobi', name: 'Obi Wan', surname: 'Kenobi', tasks: null },
  {id: '5', username: 'jerso', name: 'Jyn', surname: 'Erso', tasks: null },
  {id: '6', username: 'pdameron', name: 'Poe', surname: 'Dameron', tasks: null },
  {id: '7', username: 'lorgana', name: 'Leia', surname: 'Organa', tasks: null },
  {id: '8', username: 'askywalker', name: 'Anakin', surname: 'Skywalker', tasks: null },
  {id: '9', username: 'jjbinks', name: 'Jar Jar', surname: 'Binks', tasks: null }
]

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  public loadUser(): User {
    return USER;
  }

  public loadUsers(): User [] {
    return USERS;
  }

  public loadAdmins(): User [] {
    return ADMINS;
  }

}
