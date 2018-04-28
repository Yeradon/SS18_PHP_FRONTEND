import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  isTranslated = false;

  onTranslate(): void {
    this.isTranslated = !this.isTranslated;
  }

  constructor() { }

  ngOnInit() {
  }

}
