import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { OverviewComponent } from '../overview/overview.component';
import { MenuComponent } from '../menu/menu.component';
import { AccountComponent } from '../account/account.component';
import { AdminComponent } from '../admin/admin.component';
import { AdminPopupComponent } from '../admin-popup/admin-popup.component';
import { SchedulePopupComponent } from '../schedule-popup/schedule-popup.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { TaskSchedulePipe } from '../shared/task/task-schedule.pipe';
import { UserRolePipe } from '../shared/user/user-role.pipe';

@NgModule({
  declarations: [
    AppComponent,
    OverviewComponent,
    MenuComponent,
    AccountComponent,
    AdminComponent,
    SchedulePopupComponent,
    AdminPopupComponent,
    TaskSchedulePipe,
    UserRolePipe
  ],
  imports: [CommonModule, AppRoutingModule, FormsModule, HttpClientModule]
})
export class AppModule {}
