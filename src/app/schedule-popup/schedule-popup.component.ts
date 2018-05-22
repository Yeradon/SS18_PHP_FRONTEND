import { Component, Input } from '@angular/core';
import { TaskDisplayable } from '../shared/task/task.displayable';
import { TaskService } from '../shared/task/task.service';

@Component({
  selector: 'app-schedule-popup',
  templateUrl: './schedule-popup.component.html',
  styleUrls: ['./schedule-popup.component.css']
})
export class SchedulePopupComponent {
  date: string = new Date().toISOString();
  time: string = new Date().toISOString();

  noDisplay: boolean = true;

  private _task: TaskDisplayable;

  constructor(private taskService: TaskService) {}

  @Input()
  public get task(): TaskDisplayable {
    return this._task;
  }

  public set task(task: TaskDisplayable) {
    if (task == null) {
      return;
    }

    this._task = task;

    if (this.task.deadline == null) {
      this.date = this.toDatefieldString(new Date());
      this.time = this.toTimefieldString(new Date());
    } else {
      this.date = this.toDatefieldString(this.task.deadline);
      this.time = this.toTimefieldString(this.task.deadline);
    }
  }

  public show(): void {
    this.noDisplay = false;
  }

  public submit(): void {
    var isoString = this.date + 'T' + this.time;
    this.task.deadline = new Date(isoString);
    this.taskService.modifyTask(this.task);

    this.cancel();
  }

  public cancel(): void {
    this.noDisplay = true;
  }

  private toDatefieldString(date: Date): string {
    return (
      this.pad(date.getFullYear()) +
      '-' +
      this.pad(date.getMonth() + 1) +
      '-' +
      this.pad(date.getDate())
    );
  }

  private toTimefieldString(date: Date): string {
    return (
      this.pad(date.getHours()) +
      ':' +
      this.pad(date.getMinutes()) +
      ':' +
      this.pad(date.getSeconds())
    );
  }

  private pad(number): string {
    if (number < 10) {
      return '0' + number;
    }
    return number;
  }
}
