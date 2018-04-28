import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { AccountComponent } from './account/account.component';
import { LoginComponent } from './login/login.component';
import {AuthGuard} from "./shared/authentication/auth-guard.service";
import { AdminComponent } from './admin/admin.component';

const routes: Routes = [
  { path: '',
    canActivate: [AuthGuard],
    children: [
      { path: 'overview', component: OverviewComponent },
      { path: 'account', component: AccountComponent },
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'admin', component: AdminComponent }
    ]
  },
  { path: 'login', component: LoginComponent},

]

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule,
  ],
  providers: [
    AuthGuard
  ]
})
export class AppRoutingModule { }
