import { UserTransferable } from './user.transferable';
import { Task } from '../task/task';

export class User extends UserTransferable {
  get tasks(): Task {
    throw Error("Not implemented!");
  }
}
