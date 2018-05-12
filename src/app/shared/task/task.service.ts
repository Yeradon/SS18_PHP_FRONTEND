import { Injectable } from '@angular/core';
import { Task } from './task';
import { isNullOrUndefined } from 'util';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { TaskTransferable } from './task.transferable';
import { map } from 'rxjs/internal/operators';
import { Observable, Subject } from 'rxjs';

const TASKS: Task[] = [
  {
    id: '0',
    text: 'Blumen giessen',
    done: false,
    deadline: new Date('2018-04-29T18:00:00'),
    userID: null,
    user: null
  },
  {
    id: '1',
    text: 'Auto waschen',
    done: false,
    deadline: new Date('2018-04-30T14:00:00'),
    userID: null,
    user: null
  },
  {
    id: '2',
    text: 'TypeScript lernen',
    done: false,
    deadline: new Date('2018-05-01T18:00:00'),
    userID: null,
    user: null
  },
  {
    id: '3',
    text: 'Küche putzen',
    done: false,
    deadline: null,
    userID: null,
    user: null
  },
  {
    id: '4',
    text: 'Weltherrrschaft übernehmen',
    done: false,
    deadline: new Date('2020-05-02T10:00:00'),
    userID: null,
    user: null
  },
  {
    id: '5',
    text: 'Kaffee kochen',
    done: false,
    deadline: new Date('2018-05-05T20:00:00'),
    userID: null,
    user: null
  },
  {
    id: '6',
    text: 'Mais ernten',
    done: false,
    deadline: new Date('2018-05-10T09:00:00'),
    userID: null,
    user: null
  },
  {
    id: '7',
    text: 'Buch lesen',
    done: false,
    deadline: null,
    userID: null,
    user: null
  },
  {
    id: '8',
    text: 'ToDo-Liste programmieren',
    done: false,
    deadline: new Date('2018-05-27T18:00:00'),
    userID: null,
    user: null
  },
  {
    id: '9',
    text: 'Schuhe putzen',
    done: false,
    deadline: new Date('2018-05-29T10:00:00'),
    userID: null,
    user: null
  },
  {
    id: '10',
    text: 'Zeitmaschine erfinden',
    done: false,
    deadline: new Date('2000-04-29T18:00:00'),
    userID: null,
    user: null
  }
];

export enum CHANGE_MODE {
  CHANGED,
  ADDED,
  DELETED
}
export class ChangeEvent<T> {
  public readonly mode: CHANGE_MODE;
  public readonly oldVal: T | null;
  public readonly newVal: T | null;

  constructor(mode: CHANGE_MODE, old: T, newTask: T) {
    this.mode = mode;
    this.oldVal = !isNullOrUndefined(old) ? old : null;
    this.newVal = !isNullOrUndefined(newTask) ? newTask : null;
  }
}
export enum LOADING_MODE {
  STARTED,
  FINISHED
}
export class LoadingEvent<T> {
  public mode: LOADING_MODE;
  public target: T;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private _taskStorage: Task[];

  public set tasks(tasks: Task[]) {
    this._taskStorage = tasks;
  }
  public get tasks(): Task[] {
    return this._taskStorage;
  }

  /**
   * Observable that publishes LoadingEvents of the managed tasks.
   * @type {Subject<LoadingEvent<Task>>}
   */
  public readonly tasksLoading: Subject<LoadingEvent<Task>> = new Subject<
    LoadingEvent<Task>
  >();
  public readonly changeObservable: Subject<ChangeEvent<Task>> = new Subject();

  constructor(private http: HttpClient) {
    this.tasks = [];
  }

  /**
   * Syncs the current task set with the server.
   * Server is single source of truth.
   * Removes all tasks, that don't exist on server,
   * adds tasks, that only exist on server,
   * and modifies tasks, that differ from the version on the server.
   */
  public async syncTasks(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.http
        .get<Task[]>(environment.BACKEND_URL + 'task')
        .pipe(map(this.parseResult))
        .subscribe(
          tasks => {
            this.tasks = tasks;
            resolve();
          },
          err => {
            console.log(err);
            reject(err);
          }
        );
    });
  }

  public async createTask(task: Task): Promise<Task> {
    if (!isNullOrUndefined(task.id)) {
      return null;
    } else {
      return new Promise<Task>((resolve, reject) => {
        this.http.put<Task>(environment.BACKEND_URL + '/tasks', task).subscribe(
          (_task: Task) => {
            this.tasks.push(_task);
            this.changeObservable.next(
              new ChangeEvent<Task>(CHANGE_MODE.ADDED, null, _task)
            );
            resolve(_task);
          },
          err => {
            reject(err);
          }
        );
      });
    }
  }

  /**
   * Adds the task to the collection.
   * If the collection already contains the task, it will be modified.
   * @param {Task} task
   */
  public addTask(task: Task) {
    let $serverCallObservable: Observable<Task>;
    if (isNullOrUndefined(task.id)) {
      $serverCallObservable = this.http.put<Task>(
        environment.BACKEND_URL + 'tasks',
        task
      );
    } else {
      $serverCallObservable = this.http.post<Task>(
        environment.BACKEND_URL + 'task/' + task.id,
        task
      );
    }
    let oldTask: Task;
    var newTasks = this.tasks.filter((_task: Task) => {
      if (task.id == _task.id) {
        oldTask = _task;
        return false;
      }
      return true;
    });
    let mode = !isNullOrUndefined(oldTask)
      ? CHANGE_MODE.CHANGED
      : CHANGE_MODE.ADDED;
    this.changeObservable.next(new ChangeEvent<Task>(mode, oldTask, task));
    newTasks.push(task);
    this.tasks = newTasks;
  }

  /**
   * Tries to delete a task.
   * Will return a promise, which:
   * - will resolve to true if the task is successfully deleted
   * - will reject if a serverside error occurs (eg. 404 - Task not found)
   * @param {Task} task
   * @returns {Promise<boolean>}
   */
  public async removeTask(task: Task): Promise<boolean> {
    this.tasksLoading.next({ mode: LOADING_MODE.STARTED, target: task });
    return new Promise<boolean>((resolve, reject) => {
      this.http
        .delete('https://php-testat.herokuapp.com/tasks/' + task.id)
        .subscribe(
          res => {
            var newTasks = this.tasks.filter((_task: Task) => {
              if (task.id == _task.id) return false;
              return true;
            });
            if (this.tasks.length != newTasks.length) {
              this.changeObservable.next(
                new ChangeEvent<Task>(CHANGE_MODE.DELETED, task, null)
              );
              this.tasks = newTasks;
            }
            this.tasksLoading.next({
              mode: LOADING_MODE.FINISHED,
              target: task
            });
            resolve(true);
          },
          err => {
            this.tasksLoading.next({
              mode: LOADING_MODE.FINISHED,
              target: task
            });
            reject(err);
          }
        );
    });
  }

  private parseResult(tasks: Task[]): Task[] {
    tasks.forEach(task => {
      if (!(task.deadline instanceof Date)) {
        task.deadline = new Date(task.deadline);
      }
    });
    return tasks;
  }
}
