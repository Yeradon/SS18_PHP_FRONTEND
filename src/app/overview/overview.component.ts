import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Task } from '../shared/task/task';
import {
  LOADING_MODE,
  LoadingEvent,
  TaskService
} from '../shared/task/task.service';
import { TaskDisplayable } from '../shared/task/task.displayable';
import { MessageService } from '../shared/message/message.service';
import { SchedulePopupComponent } from '../schedule-popup/schedule-popup.component';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements AfterViewInit {
  tasks_urgent: TaskDisplayable[] = [];
  tasks_scheduled: TaskDisplayable[] = [];
  tasks_unscheduled: TaskDisplayable[] = [];

  task2BeScheduled: TaskDisplayable;

  @ViewChild(SchedulePopupComponent)
  private schedulePopup: SchedulePopupComponent;

  constructor(
    private taskService: TaskService,
    private messageService: MessageService
  ) {}

  /*
    * Lädt Aufgaben und teilt sie auf drei Listen auf:
    * - tasks_urgent: dringende Aufgaben
    * - tasks_scheduled: eingeplante Aufgaben
    * - tasks_unscheduled: nicht eingeplante und bereits erledigte Aufgaben
    */
  ngAfterViewInit() {
    this.taskService.syncTasks().then(
      () => {
        this.tasks_unscheduled = [];
        this.tasks_scheduled = [];
        this.tasks_urgent = [];
        this.taskService.tasks.forEach((task: Task) => {
          var task_d: TaskDisplayable = new TaskDisplayable(
            task.id,
            task.text,
            task.done,
            task.deadline
          );

          if (!task.deadline || task.done) {
            this.tasks_unscheduled.push(task_d);
          } else if (task.deadline < new Date()) {
            this.tasks_urgent.push(task_d);
          } else {
            this.tasks_scheduled.push(task_d);
          }
        });
      },
      err => {
        console.log(err);
      }
    );

    this.taskService.tasksLoading.subscribe((event: LoadingEvent<Task>) => {
      let task = this.findDisplayableByTask(event.target);
      console.log(task);
      if (!isNullOrUndefined(task)) {
        task.isTranslated = false;
        task.isLoading = event.mode == LOADING_MODE.STARTED ? true : false;
      }
    });
  }

  private findDisplayableByTask(task: Task): TaskDisplayable {
    let buffer: TaskDisplayable = null;
    const cmpFunction = (_task: TaskDisplayable) => {
      if (Task.sameTarget(_task, task)) {
        buffer = _task;
      }
    };
    this.tasks_urgent.forEach(cmpFunction);
    this.tasks_scheduled.forEach(cmpFunction);
    this.tasks_unscheduled.forEach(cmpFunction);
    return buffer;
  }

  /*
   * Zeigt eine Bildschirmmaske an, um die Terminierung einer Aufgabe zu ändern
   */
  public scheduleTask(task: TaskDisplayable): void {
    this.task2BeScheduled = task;
    this.schedulePopup.show();
  }

  /*
   * Entfernt die Terminierung einer Aufgabe und fügt sie anschließend der Liste
   * tasks_unscheduled hinzu
   */
  public descheduleTask(task: TaskDisplayable): void {
    task.deadline = null;
    this.taskService.addTask(task);
  }

  /*
   * Entfernt eine Aufgabe.
   */
  public async removeTask(task: TaskDisplayable) {
    try {
      await this.taskService.removeTask(task);
    } catch (err) {
      this.messageService.add(
        "Fehler beim Löschen der Aufgabe '" +
          task.text +
          "' (" +
          err.message +
          ')'
      );
    }
  }

  /*
   * Entfernt ein Element aus einem Array. Gibt true zurück, wenn das Element
   * im Array vorhanden war und entfernt wurde.
   */
  private removeElementFromArray(element: Object, array: Object[]): boolean {
    var index = array.indexOf(element);
    if (index > -1) {
      array.splice(index, 1);
      return true;
    } else {
      return false;
    }
  }
}
