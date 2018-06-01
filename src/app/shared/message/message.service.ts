import { Injectable } from '@angular/core';

class Message {
  content: string;
  time: number;
}
@Injectable({
  providedIn: 'root'
})
  /*
   * Klasse zur Verwaltung eines Message-Services
   */
export class MessageService {
  // Muss 5000 betragen, da Message durch CSS-Animation nach 5000ms ausgeblendet wird
  private static readonly DEFAULT_HIDE_TIME: number = 5000;

  messages: Message[] = [];

    /*
     * Fuegt eine Nachricht hinzu, die durch die Message-Komponente angezeigt wird
     */
  add(message: string) {
    // Nachricht hinzufuegen
    this.messages.push({
      content: message,
      time: new Date().getTime()
    });

    // Timer Initialisieren, der die Nachricht nach Ablauf der DEFAULT_HIDE_TIME
    // ausblendet.
    setTimeout(() => {
      this.messages = this.messages.filter((message: Message) => {
        if (
          message.time +
            MessageService.DEFAULT_HIDE_TIME -
            new Date().getTime() <
          0
        ) {
          return false;
        }
        return true;
      });
    }, MessageService.DEFAULT_HIDE_TIME + 1);
  }

    /*
     * Entfernt eine bestimmte Nachricht
     */
  public remove(msg: Message): void {
    var i = this.messages.indexOf(msg);
    if (i > -1) {
      this.messages.splice(i,1);
    }
  }

    /*
     * Entfernt alle Nachrichten
     */
  clear() {
    this.messages = [];
  }
}
