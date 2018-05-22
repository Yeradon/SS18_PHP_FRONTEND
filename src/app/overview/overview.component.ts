import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Task } from '../shared/task/task';
import {
  CHANGE_MODE,
  ChangeEvent,
  LOADING_MODE,
  LoadingEvent,
  TaskService
} from '../shared/task/task.service';
import { TaskDisplayable } from '../shared/task/task.displayable';
import { MessageService } from '../shared/message/message.service';
import { SchedulePopupComponent } from '../schedule-popup/schedule-popup.component';
import { isNullOrUndefined } from 'util';
import { SCHEDULE_STATUS } from '../shared/task/task-schedule.pipe';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css'],
})
export class OverviewComponent implements AfterViewInit {
  isLoading = false;
  tasks: TaskDisplayable[] = [];

  task2BeScheduled: TaskDisplayable;

  @ViewChild(SchedulePopupComponent)
  private schedulePopup: SchedulePopupComponent;

  constructor(
    private taskService: TaskService,
    private messageService: MessageService
  ) {}

  private insertNewTask = (task: Task) => {
    var task_d: TaskDisplayable = new TaskDisplayable(
      task.id,
      task.text,
      task.done,
      task.deadline
    );

    this.tasks.push(task_d);
  };

  /*
    * Lädt Aufgaben und teilt sie auf drei Listen auf:
    * - tasks_urgent: dringende Aufgaben
    * - tasks_scheduled: eingeplante Aufgaben
    * - tasks_unscheduled: nicht eingeplante und bereits erledigte Aufgaben
    */
  ngAfterViewInit() {
    this.isLoading = true;
    const _prom = this.taskService.syncTasks();
    _prom.then(() => {
        this.tasks = [];
        this.taskService.tasks.forEach(this.insertNewTask);
        this.isLoading = false;
      }, err => {
        console.log(err);
        this.isLoading = false;
      });

    this.taskService.changeObservable.subscribe(
      (event: ChangeEvent<Task>) => {
        switch (event.mode)       {
        case CHANGE_MODE.ADDED:
            this.insertNewTask(event.newVal);
            break;
          case CHANGE_MODE.DELETED:
            let task = this.findDisplayableByTask(event.oldVal);
            if     (!isNullOrUndefined(task)) {
              this.removeOldTask(task);
            }
            break;
          case CHANGE_MODE.CHANGED:
            console.log(event.newVal);
            console.log(event.oldVal);
            let _task = event.newVal;
            let task_d = this.findDisplayableByTask(event.oldVal)
            task_d.text = _task.text;
            task_d.deadline = _task.deadline;
            task_d.done = _task.done;
            break;
        }
      }
    );

    this.taskService.tasksLoading.subscribe((event: LoadingEvent<Task>) => {
      const task = this.findDisplayableByTask(event.target);
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
    this.tasks.forEach(cmpFunction);
    return buffer;
  }

  /*
   * Zeigt eine Bildschirmmaske an, um die Terminierung einer Aufgabe zu ändern
   */
  public scheduleTask(task: TaskDisplayable): void {

    if (!task.isLoading) {
      this.task2BeScheduled = task;
      this.schedulePopup.show();
    }

  }

  /*
   * Entfernt die Terminierung einer Aufgabe und fügt sie anschließend der Liste
   * tasks_unscheduled hinzu
   */
  public async descheduleTask(task: TaskDisplayable) {
    if (!task.isLoading) {
      task.deadline = null;
      try {
        await this.taskService.modifyTask(task);
      } catch(err) {
        this.messageService.add('Fehler beim Verändern der Aufgabe \'' + task.text + '\' (' + err.message + ')');
      }
    }
  }

  /*
   * Entfernt eine Aufgabe.
   */
  public async removeTask(task: TaskDisplayable) {

    if (!task.isLoading) {
      try {
        await this.taskService.removeTask(task);
      } catch(err) {
        this.messageService.add('Fehler beim Löschen der Aufgabe \'' + task.text + '\' (' + err.message + ')');
      }
    }

  }

  public async updateTask(task: TaskDisplayable) {

    if (!task.isLoading) {
      try {
        await this.taskService.modifyTask(task);
      } catch(err) {
        this.messageService.add('Fehler beim Aktualisieren der Aufgabe \'' + task.text + '\' (' + err.message + ')');
      }
    }

  }

  private removeOldTask(task: TaskDisplayable) {
    this.removeElementFromArray(task, this.tasks);
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
