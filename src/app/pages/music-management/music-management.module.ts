import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { ViewMusicDialogComponent } from './view-music-dialog/view-music-dialog.component';
import { CreateOrEditMusicComponent } from './create-or-edit-music/create-or-edit-music.component';
import { ShareModule } from '../share/share.module';
import { SingersFilterDialogComponent } from './singers-filter-dialog/singers-filter-dialog.component';
import { DeleteMusicDialogComponent } from './delete-music-dialog/delete-music-dialog.component';


const routes: Routes = [
  { path: 'music', component: MusicManagementComponent, canActivate: [AuthGuardService] },
  { path: 'music/create-or-edit', component: CreateOrEditMusicComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  declarations: [
    MusicManagementComponent,
    ViewMusicDialogComponent,
    CreateOrEditMusicComponent,
    SingersFilterDialogComponent,
    DeleteMusicDialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild(),
    NgxMaskModule.forChild(),
    ShareModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatListModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatMenuModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    MatChipsModule,
    ClipboardModule,
    MatBadgeModule
  ]
})
export class MusicManagementModule { }
