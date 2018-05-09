import { User } from './user';

export class UserDisplayable extends User {

  isTranslated: boolean;
  isHidden: boolean;

  /*
   * Initialisiert eine neue darstellbare Aufgabe
   */
  constructor (id: string, username: string, name: string, surname: string) {
    super();
    this.id = id;
    this.username = username;
    this.name = name;
    this.surname = surname;
    this.isTranslated = false;
    this.isHidden = false;
  }

  /*
   * Wechselt die Anzeige der Aufgaben-Optionen in der mobilen Ansicht
   */
  public toggleTranslation() {
    this.isTranslated = !this.isTranslated;
  }

  public setHidden(a: boolean): void {
    this.isHidden = a;
  }

}
