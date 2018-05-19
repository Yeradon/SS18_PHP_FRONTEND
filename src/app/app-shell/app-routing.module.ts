import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OverviewComponent } from '../overview/overview.component';
import { AccountComponent } from '../account/account.component';
import { AuthGuard } from '../shared/authentication/auth-guard.service';
import { AdminComponent } from '../admin/admin.component';
import { AppComponent } from './app.component';
import { AdminGuard } from '../shared/authentication/authoritzation.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: AppComponent,
    children: [
      { path: 'overview', component: OverviewComponent },
      { path: 'account', component: AccountComponent },
      { path: 'admin',
        canActivate: [AdminGuard],
        component: AdminComponent },
      { path: '', redirectTo: 'overview', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, AdminGuard]
})
export class AppRoutingModule {}
