import { MatTabsModule } from '@angular/material/tabs';
import { AuthGuardService } from './../../guards/auth-guard.service';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { ShareModule } from './../share/share.module';
import { NgxMaskModule } from 'ngx-mask';
import { TranslateModule } from '@ngx-translate/core';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpaceManagementComponent } from './space-management.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';

const routes: Routes = [
  { path: 'space', component: SpaceManagementComponent, canActivate: [AuthGuardService] },
];


@NgModule({
  declarations: [
    SpaceManagementComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild(),
    NgxMaskModule.forChild(),
    ShareModule,
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
    MatTabsModule,
    MatTableModule,
    MatSortModule
  ]
})
export class SpaceManagementModule { }
