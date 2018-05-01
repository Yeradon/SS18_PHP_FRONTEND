import { Injectable } from '@angular/core';
import { Task } from './shared/task/task';

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

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor() { }

  loadTasks(): Task[] {
    return TASKS;
  }

}
