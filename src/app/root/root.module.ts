import { LoginComponent } from '../login/login.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthenticationService } from '../shared/authentication/authentication.service';
import { RootComponent } from './root.component';
import { NgModule } from '@angular/core';
import { RootRoutingModule } from './root-routing.module';
import { MessagesComponent } from '../messages/messages.component';

@NgModule({
  declarations: [RootComponent, MessagesComponent, LoginComponent],
  imports: [BrowserModule, RootRoutingModule, FormsModule, HttpClientModule],
  providers: [AuthenticationService],
  bootstrap: [RootComponent]
})
export class RootModule {}
