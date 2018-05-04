import { Injectable } from '@angular/core';
import { Task } from './shared/task/task';
import {BehaviorSubject, Observable, Subject} from "rxjs/Rx";
import {isNullOrUndefined} from "util";
import {HttpClient} from "@angular/common/http";
import {catchError} from "rxjs/internal/operators";

const TASKS: Task[] = [
  { id: '0', text: 'Blumen giessen', done: false, deadline: new Date('2018-04-29T18:00:00'), userID: null, user: null },
  { id: '1', text: 'Auto waschen', done: false, deadline: new Date('2018-04-30T14:00:00'), userID: null, user: null },
  { id: '2', text: 'TypeScript lernen', done: false, deadline: new Date('2018-05-01T18:00:00'), userID: null, user: null },
  { id: '3', text: 'Küche putzen', done: false, deadline: null, userID: null, user: null },
  { id: '4', text: 'Weltherrrschaft übernehmen', done: false, deadline: new Date('2020-05-02T10:00:00'), userID: null, user: null },
  { id: '5', text: 'Kaffee kochen', done: false, deadline: new Date('2018-05-05T20:00:00'), userID: null, user: null },
  { id: '6', text: 'Mais ernten', done: false, deadline: new Date('2018-05-10T09:00:00'), userID: null, user: null },
  { id: '7', text: 'Buch lesen', done: false, deadline: null, userID: null, user: null },
  { id: '8', text: 'ToDo-Liste programmieren', done: false, deadline: new Date('2018-05-27T18:00:00'), userID: null, user: null },
  { id: '9', text: 'Schuhe putzen', done: false, deadline: new Date('2018-05-29T10:00:00'), userID: null, user: null },
  { id: '10', text: 'Zeitmaschine erfinden', done: false, deadline: new Date('2000-04-29T18:00:00'), userID: null, user: null }
];

enum CHANGE_MODE {
  CHANGED,
  ADDED,
  DELETED
}
class ChangeEvent<T> {
  public readonly mode: CHANGE_MODE;
  public readonly oldTask: T | null;
  public readonly newTask: T | null;

  constructor(mode: CHANGE_MODE, old: T, newTask: T) {
    this.mode = mode;
    this.oldTask = !isNullOrUndefined(old) ? old : null;
    this.newTask = !isNullOrUndefined(newTask) ? newTask : null;
  }
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private _taskStorage: Task[];

  public set tasks(tasks: Task[]) {
    this._taskStorage = tasks;
    this.tasksObservable.next(tasks);
  }
  public get tasks(): Task[] {
    return this._taskStorage;
  }

  public readonly tasksObservable: BehaviorSubject<Task[]> = new BehaviorSubject([]);


  public readonly changeObservable: Subject<ChangeEvent<Task>> = new Subject();

  constructor(private http: HttpClient) {
    this.tasks = TASKS;
  }

  public createTask(task: Task) {
    if(!isNullOrUndefined(task.id)) {
      return false;
    } else {

    }
  }

  /**
   * Adds the task to the collection.
   * If the collection already contains the task, it will be modified.
   * @param {Task} task
   */
  public addTask(task: Task) {
    let oldTask: Task;
    var newTasks = this.tasks.filter((_task: Task) => {
      if(task.id == _task.id) {
        oldTask = _task;
        return false;
      }
      return true;
    });
    let mode = !isNullOrUndefined(oldTask) ? CHANGE_MODE.CHANGED : CHANGE_MODE.ADDED;
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
    return new Promise<boolean>((resolve, reject) => {
      this.http.delete('https://php-testa.herokuapp.com/tasks/' + task.id).subscribe(res => {
        var newTasks = this.tasks.filter((_task: Task) => {
          if(task.id == _task.id) return false;
          return true;
        });
        if(this.tasks.length != newTasks.length) {
          this.changeObservable.next(new ChangeEvent<Task>(CHANGE_MODE.DELETED, task, null));
          this.tasks = newTasks;
        }
        resolve(true);
      }, err => {
        reject(err);
      });
    })
  }
}
