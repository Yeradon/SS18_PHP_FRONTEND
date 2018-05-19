import { User } from './user';

export class UserDisplayable extends User {
  isTranslated: boolean;
  isHidden: boolean;

  constructor(username: string, name: string, surname: string, role: string) {
    super();
    this.username = username;
    this.name = name;
    this.surname = surname;
    this.isTranslated = false;
    this.isHidden = false;
    this.role = role;
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
