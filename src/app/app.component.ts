import { Component } from '@angular/core';
import { TaskService } from './task.service';
import { Task } from './shared/task/task';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  showNav = false;

  constructor(public taskService: TaskService) {}

  toggleMenu(): void {
    this.showNav = !this.showNav;
  }

  addEmptyTask(): void {
    let $task = new Task();
    $task.id = new Date().getTime().toString();
    $task.userID = '1';
    this.taskService.addTask($task);
  }
}
