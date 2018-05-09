import { Task } from './task';

/*
 * KLasse repraesentiert eine darstellbare Aufgabe
 */
export class TaskDisplayable extends Task {

  isTranslated: boolean;
  deadlineDisplayable: string;

  /*
   * Initialisiert eine neue darstellbare Aufgabe
   */
  constructor (id: string, text: string, done:boolean, deadline: Date) {
    super();
    this.id = id;
    this.text = text;
    this.done = done;
    this.deadline = deadline;
    this.isTranslated = false;
  }

  /*
   * Wechselt die Anzeige der Aufgaben-Optionen in der mobilen Ansicht
   */
  public toggleTranslation() {
    this.isTranslated = !this.isTranslated;
  }

  /*
   * Generiert einen lesbaren String aus der Deadline der Aufgabe
   */
  public generateDisplayableDeadline():string {

    if (!this.deadline) {
      return '';
    }

    let millis = Date.now() - this.deadline.getTime();

    if (millis < 0) {
      this.deadlineDisplayable = 'IN ';
      millis *= -1;
    } else {
      this.deadlineDisplayable = 'VOR ';
    }

    let years = Math.floor(millis/31540000000);
    let months = Math.floor(millis/2628000000);
    let weeks = Math.floor(millis/604800000);
    let days = Math.floor(millis/86400000);
    let hours = Math.floor(millis/3600000);

    if (years > 1) {
      this.deadlineDisplayable += years + ' JAHREN';
    } else if (months > 1) {
      this.deadlineDisplayable += months + ' MONATEN';
    } else if (weeks > 1) {
      this.deadlineDisplayable += weeks + ' WOCHEN';
    } else if (days > 1) {
      this.deadlineDisplayable += days + ' TAGEN';
    } else if (hours > 1) {
      this.deadlineDisplayable += hours + ' STUNDEN';
    } else {
      this.deadlineDisplayable = 'JETZT';
    }

    return this.deadlineDisplayable;

  }

  /**
   * Indicates whether network operations happening regarding this task
   * @type {boolean}
   */
  public isLoading: boolean = false;

}
