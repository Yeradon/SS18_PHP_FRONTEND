import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
    <app-messages></app-messages>
  `,
})
export class RootComponent {
}
