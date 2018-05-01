import { Component, OnInit } from '@angular/core';
import { TaskDisplayable } from '../shared/task/task.displayable';

@Component({
  selector: 'app-schedule-popup',
  templateUrl: './schedule-popup.component.html',
  styleUrls: ['./schedule-popup.component.css']
})
export class SchedulePopupComponent implements OnInit {

  task: TaskDisplayable;
  noDisplay: boolean = true;

  public scheduleTask(task: TaskDisplayable): TaskDisplayable {

    this.noDisplay = false;
    this.task = task;

    return null;

  }

  constructor() { }

  ngOnInit() {
  }

}
