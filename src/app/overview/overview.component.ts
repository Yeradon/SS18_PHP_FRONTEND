import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

  isTranslated = false;
  isChecked = false;

  onTranslate(): void {
    this.isTranslated = !this.isTranslated;
  }

  toggleCheckbox(): void {
    this.isChecked = !this.isChecked;
  }

  getCheckboxImg(): string {
    if (this.isChecked) {
      return 'assets/img/ic_check_box_white_24px.svg';
    } else {
      return 'assets/img/ic_check_box_outline_blank_white_24px.svg';
    }
  }

  constructor() { }

  ngOnInit() {
  }

}
