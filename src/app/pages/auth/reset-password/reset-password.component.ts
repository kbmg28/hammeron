import { MustMatch } from 'src/app/_helpers/MustMatch';
import { AuthService } from './../../../_services/auth.service';
import { UserService } from './../../../_services/user.service';
import { SnackBarService } from './../../../_services/snack-bar.service';
import { Router } from '@angular/router';
import { LocalizationService } from './../../../internationalization/localization.service';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BackPageService } from './../../../_services/back-page.service';
import { Component, OnInit } from '@angular/core';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class ResetPasswordComponent implements OnInit {
  isLoading: boolean = false;
  isEmailSent: boolean = false;
  hide: boolean = true;

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;

  constructor(private titleService: Title,
    private backPageService: BackPageService,
    private localizationService: LocalizationService,
    private router: Router,
    private snackBarService: SnackBarService,
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,) {
    this.firstFormGroup = this.fb.group({
      email: [null, [Validators.required, Validators.email]]
    });

    this.secondFormGroup = this.fb.group({
      temporaryPassword: [null, [Validators.required, Validators.minLength(6)]],
    });

    this.thirdFormGroup = this.fb.group({
      password: [null, [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: MustMatch('password', 'confirmPassword')
  });
  }

  get email() {   return this.firstFormGroup.get('email'); }
  get temporaryPassword() { return this.secondFormGroup.get('temporaryPassword'); }
  get password() { return this.thirdFormGroup.get('password'); }
  get confirmPassword() { return this.thirdFormGroup.get('confirmPassword'); }

  ngOnInit(): void {
    const titlePage = this.localizationService.translate('register.resetPassword.title');
    this.backPageService.setBackPageValue('/login', titlePage);
  }

  getErrorInvalidEmailMessage() {
    if (this.email?.hasError('required')) {
      return this.localizationService.translate('validations.requiredField');
    }

    return this.email?.hasError('email') ? this.localizationService.translate('validations.user.invalidEmail') : '';
  }

  getErrorInvalidPasswordMessage() {
    if (this.password?.hasError('required')) {
      return this.localizationService.translate('validations.requiredField');
    }

    return this.password?.hasError('minlength') ? this.localizationService.translate('validations.user.passwordMinLenght') : '';
  }

  getErrorInvalidConfirmPasswordMessage() {
    return this.confirmPassword?.hasError('required') ? this.localizationService.translate('validations.requiredField') : this.localizationService.translate('validations.user.passwordMustBeEquals');
  }

  sendTemporaryPassword() {
    this.authService.recoveryPassword(this.email?.value).subscribe(() => {

      const message = this.localizationService.translate('register.resetPassword.step.email.temporaryPasswordSent');
      this.snackBarService.success(message);
    }, err => {
      this.snackBarService.error(err);
    });
  }

  changePassword() {
    const emailValue = this.email?.value;
    const temporaryPasswordValue = this.temporaryPassword?.value;
    const newPasswordValue = this.password?.value;

    this.authService.changePassword(emailValue, temporaryPasswordValue, newPasswordValue)
                      .subscribe(() => {
        const message = this.localizationService.translate('register.resetPassword.step.done.passwordChanged');
        this.snackBarService.success(message);
    }, err => {
      this.snackBarService.error(err);
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
