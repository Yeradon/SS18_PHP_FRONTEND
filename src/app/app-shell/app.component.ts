import { Component, ViewChild } from '@angular/core';
import { TaskService } from '../shared/task/task.service';
import { Task } from '../shared/task/task';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  showNav = false;

  @ViewChild(MenuComponent)
  private menu: MenuComponent;

  constructor(public taskService: TaskService) {}

  toggleMenu(): void {
    this.menu.showNav = !this.menu.showNav;
  }

  addEmptyTask(): void {
    let task = new Task();
    task.text = '';
    this.taskService.createTask(task);
  }
}
