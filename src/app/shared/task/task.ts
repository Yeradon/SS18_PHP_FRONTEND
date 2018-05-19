import { TaskTransferable } from './task.transferable';
import { User } from '../user/user';

export class Task extends TaskTransferable {

  /**
   * Compares primary key of a tasks with primary key of this instance.
   * @param {Task} task
   * @returns {boolean}
   */
  public static sameTarget(_task: Task, task: Task): boolean {
    return _task.id == task.id;
  }
}
