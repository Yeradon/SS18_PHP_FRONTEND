import { Component, OnInit } from '@angular/core';
import { Task } from '../shared/task/task';
import { TaskService } from '../task.service';
import { TaskDisplayable } from '../shared/task/task.displayable';
import { MessageService } from '../message.service';
import { SchedulePopupComponent } from '../schedule-popup/schedule-popup.component';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})

export class OverviewComponent implements OnInit {

  tasks_urgent: TaskDisplayable[] = [];
  tasks_scheduled: TaskDisplayable[] = [];
  tasks_unscheduled: TaskDisplayable[] = [];

  constructor(
    private taskService: TaskService,
    private messageService: MessageService
   ) { }

   /*
    * Lädt Aufgaben und teilt sie auf drei Listen auf:
    * - tasks_urgent: dringende Aufgaben
    * - tasks_scheduled: eingeplante Aufgaben
    * - tasks_unscheduled: nicht eingeplante und bereits erledigte Aufgaben
    */
  ngOnInit() {

    var t: Task[] = this.taskService.loadTasks();

    for (let task of t) {

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

    }

  }

  /*
   * Erstellt eine neue Aufgabe und fügt sie zunächst der Liste
   * tasks_unscheduled hinzu.
   */
  public createTask(): void {

    // TODO Iplementieren
    this.messageService.add('Funktion noch nicht verfügbar.');

  }

  /*
   * Zeigt eine Bildschirmmaske an, um die Terminierung einer Aufgabe zu ändern
   */
  public scheduleTask(task: TaskDisplayable): void {

    // TODO Iplementieren
    this.messageService.add('Funktion noch nicht verfügbar.');
    // new SchedulePopupComponent().scheduleTask(task);

  }

  /*
   * Entfernt die Terminierung einer Aufgabe und fügt sie anschließend der Liste
   * tasks_unscheduled hinzu
   */
  public descheduleTask(task: TaskDisplayable): void {

    if (this.removeTask(task)) {
      task.deadline = null;
      task.isTranslated = false;
      this.tasks_unscheduled.push(task);
    }

  }

  /*
   * Entfernt eine Aufgabe.
   */
  public removeTask(task: TaskDisplayable): boolean {

    if (!this.removeElementFromArray(task, this.tasks_urgent)) {
      if (!this.removeElementFromArray(task, this.tasks_scheduled)) {
        if (!this.removeElementFromArray(task, this.tasks_unscheduled)) {
          this.messageService.add('FEHLER: Aufgabe nicht gefunden.');
          return false;
        }
      }
    }

    return true;

  }

  /*
   * Entfernt ein Element aus einem Array. Gibt true zurück, wenn das Element
   * im Array vorhanden war und entfern wurde.
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
