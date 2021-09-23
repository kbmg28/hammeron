import { AuthGuardService } from './guards/auth-guard.service';
import { MyProfileComponent } from './pages/my-profile/my-profile.component';
import { AdminBoardComponent } from './pages/admin-board/admin-board.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { HomeComponent } from './pages/home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthGuardService] },
  { path: 'admin', component: AdminBoardComponent, canActivate: [AuthGuardService]  },
  { path: 'my-profile', component: MyProfileComponent, canActivate: [AuthGuardService]  },
  { path: 'page-not-found', component: PageNotFoundComponent, canActivate: [AuthGuardService]  },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
