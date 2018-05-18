import { Injectable } from '@angular/core';

class Message {
  content: string;
  time: number;
}
@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private static readonly DEFAULT_HIDE_TIME: number = 5000;

  messages: Message[] = [];

  add(message: string) {
    this.messages.push({
      content: message,
      time: new Date().getTime()
    });

    // schedule a timer to hide message after DEFAULT_HIDE_TIME milliseconds
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

  public remove(msg: Message): void {
    var i = this.messages.indexOf(msg);
    if (i > -1) {
      this.messages.splice(i,1);
    }
  }

  clear() {
    this.messages = [];
  }
}
