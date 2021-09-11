import { MyProfileComponent } from './pages/my-profile/my-profile.component';
import { AdminBoardComponent } from './pages/admin-board/admin-board.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { HomeComponent } from './pages/home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'admin', component: AdminBoardComponent },
  { path: 'my-profile', component: MyProfileComponent },
  { path: 'page-not-found', component: PageNotFoundComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
