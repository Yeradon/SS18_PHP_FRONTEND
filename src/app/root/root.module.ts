import { LoginComponent } from '../login/login.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { AuthenticationService } from '../shared/authentication/authentication.service';
import { RootComponent } from './root.component';
import { NgModule } from '@angular/core';
import { RootRoutingModule } from './root-routing.module';
import { MessagesComponent } from '../messages/messages.component';
import {AuthenticationInterceptor} from "../shared/authentication/auth.interceptor";

@NgModule({
  declarations: [RootComponent, MessagesComponent, LoginComponent],
  imports: [BrowserModule, RootRoutingModule, FormsModule, HttpClientModule],
  providers: [AuthenticationService, { provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true }],
  bootstrap: [RootComponent]
})
export class RootModule {}
