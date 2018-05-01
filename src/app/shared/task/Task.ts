import { TaskTransferable } from './task.transferable';
import { User } from '../user/user';

export class Task extends TaskTransferable {
  get user(): User {
    throw new Error('Not implemented!');
  }
  set user(user: User) {
    this.userID = user.id;
  }
}
