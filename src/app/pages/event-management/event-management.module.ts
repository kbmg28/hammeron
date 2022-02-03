import { ShareModule } from './../share/share.module';
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule
} from '@angular-material-components/datetime-picker';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { TranslateModule } from '@ngx-translate/core';
import { AuthGuardService } from './../../guards/auth-guard.service';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventManagementComponent } from './event-management.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatRippleModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { CreateOrEditEventComponent } from './create-or-edit-event/create-or-edit-event.component';
import { ViewEventDialogComponent } from './view-event-dialog/view-event-dialog.component';
import { DeleteEventDialogComponent } from './delete-event-dialog/delete-event-dialog.component';


const routes: Routes = [
  { path: 'event', component: EventManagementComponent, canActivate: [AuthGuardService] },
  { path: 'event/create-or-edit', component: CreateOrEditEventComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  declarations: [
    EventManagementComponent,
    CreateOrEditEventComponent,
    ViewEventDialogComponent,
    DeleteEventDialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild(),
    NgxMaskModule.forChild(),
    ReactiveFormsModule,
    CdkAccordionModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatCardModule,
    MatListModule,
    MatDialogModule,
    MatMenuModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    MatChipsModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatGridListModule,
    MatRippleModule,
    MatExpansionModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    NgxMaterialTimepickerModule.setLocale('pt-BR'),
    ShareModule
  ]
})
export class EventManagementModule { }
