import { Component, OnInit } from '@angular/core';
import { MessageService } from '../shared/message/message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
  /*
   * Klasse zur Verwaltung der Komponente "Message"
   */
export class MessagesComponent implements OnInit {

    /*
     * Initialisiert eine neue Komponente
     */
  constructor(public messageService: MessageService) {}

  ngOnInit() {}
}
