import { SpaceToApproveListComponent } from './pages/my-profile/space-to-approve-list/space-to-approve-list.component';
import { SysAdminGuardService } from './guards/sys-admin-guard.service';
import { SpaceRequestComponent } from './pages/my-profile/space-request/space-request.component';
import { EditMyUserComponent } from './pages/my-profile/edit-my-user/edit-my-user.component';
import { AuthGuardService } from './guards/auth-guard.service';
import { MyProfileComponent } from './pages/my-profile/my-profile.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { HomeComponent } from './pages/home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthGuardService] },
  { path: 'my-profile', component: MyProfileComponent, canActivate: [AuthGuardService]  },
  { path: 'my-profile/edit', component: EditMyUserComponent, canActivate: [AuthGuardService]  },
  { path: 'space-request', component: SpaceRequestComponent, canActivate: [AuthGuardService]  },
  { path: 'space-to-approve', component: SpaceToApproveListComponent, canActivate: [SysAdminGuardService]  },
  { path: 'page-not-found', component: PageNotFoundComponent, canActivate: [AuthGuardService]  },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
