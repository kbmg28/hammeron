import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule, Routes } from '@angular/router';
import { MusicManagementComponent } from './music-management.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxMaskModule } from 'ngx-mask';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { AuthGuardService } from 'src/app/guards/auth-guard.service';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { ViewMusicDialogComponent } from './view-music-dialog/view-music-dialog.component';


const routes: Routes = [
  { path: 'music', component: MusicManagementComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  declarations: [
    MusicManagementComponent,
    ViewMusicDialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild(),
    NgxMaskModule.forChild(),
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatListModule,
    MatDialogModule
  ]
})
export class MusicManagementModule { }
