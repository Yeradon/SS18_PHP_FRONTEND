import { Component, OnInit } from '@angular/core';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  isTranslated = false;

  constructor(
    private messageService: MessageService
  ) { }

  onTranslate(): void {
    this.isTranslated = !this.isTranslated;
  }

  ngOnInit() {
  }

}
