import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OverviewComponent } from '../overview/overview.component';
import { AccountComponent } from '../account/account.component';
import { AuthGuard } from '../shared/authentication/auth-guard.service';
import { AdminComponent } from '../admin/admin.component';
import { AppComponent } from './app.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: AppComponent,
    children: [
      { path: 'overview', component: OverviewComponent },
      { path: 'account', component: AccountComponent },
      { path: 'admin', component: AdminComponent },
      { path: '', redirectTo: 'overview', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
