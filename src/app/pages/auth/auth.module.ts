import { SpaceManagementModule } from './../space-management/space-management.module';
import { LoggedGuardService } from './../../guards/logged-guard.service';
import { RegisterGuardService } from './../../guards/register-guard.service';
import { ButtonLoadingComponent } from './../share/button-loading/button-loading.component';
import { MusicManagementModule } from './../music-management/music-management.module';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatStepperModule } from '@angular/material/stepper';

import { TranslateModule } from '@ngx-translate/core';
import { NgxMaskModule } from 'ngx-mask';

import { RegisterConfirmationComponent } from './register/register-confirmation/register-confirmation.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { RegisterPasswordComponent } from './register/register-password/register-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ReCaptchaModule } from 'angular-recaptcha3';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { EventManagementModule } from '../event-management/event-management.module';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [LoggedGuardService]  },
  { path: 'reset-password', component: ResetPasswordComponent, canActivate: [LoggedGuardService] },
  { path: 'register', component: RegisterComponent, canActivate: [LoggedGuardService]  },
  { path: 'register/confirmation', component: RegisterConfirmationComponent, canActivate: [RegisterGuardService] },
  { path: 'register/password', component: RegisterPasswordComponent, canActivate: [RegisterGuardService] },
  { path: '**', redirectTo: 'page-not-found', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    RegisterConfirmationComponent,
    RegisterPasswordComponent,
    ResetPasswordComponent,
    ButtonLoadingComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild(),
    NgxMaskModule.forChild(),
    ReCaptchaModule.forRoot({
      invisible: {
          sitekey: '6Ldh-6ccAAAAAGF8GguR3bAG-eB8eokeAkAoBpqM',
      },
      normal: {
          sitekey: '6Ldh-6ccAAAAAGF8GguR3bAG-eB8eokeAkAoBpqM',
      },
      language: 'pt-br'
    }),
    EventManagementModule,
    MusicManagementModule,
    SpaceManagementModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSelectModule,
    MatIconModule,
    MatButtonToggleModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatSnackBarModule,
    MatStepperModule
  ],
  providers: [
    RegisterGuardService,
    LoggedGuardService
  ]
})
export class AuthModule { }
