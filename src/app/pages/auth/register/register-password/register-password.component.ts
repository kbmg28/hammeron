import { Subscription } from 'rxjs';
import { SnackBarService } from './../../../../_services/snack-bar.service';
import { BackPageService } from './../../../../_services/back-page.service';
import { Router } from '@angular/router';
import { TokenStorageService } from './../../../../_services/token-storage.service';
import { AuthService } from './../../../../_services/auth.service';
import { LocalizationService } from './../../../../internationalization/localization.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MustMatch } from 'src/app/_helpers/MustMatch';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent?.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return (invalidCtrl || invalidParent);
  }
}

@Component({
  selector: 'app-register-password',
  templateUrl: './register-password.component.html',
  styleUrls: ['./register-password.component.scss']
})
export class RegisterPasswordComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  requiredFieldMessage = this.localizationService.translate('validations.requiredField');
  matcher = new MyErrorStateMatcher();
  hide = true;
  passwordMinLenght = 6;
  registerPasswordForm: FormGroup;

  isLoading = false;
  isSuccessful = false;
  errorMessage = '';

  constructor(private titleService: Title, private localizationService: LocalizationService,
              private fb: FormBuilder, private authService: AuthService,
              private storageService: TokenStorageService,
              private router: Router,
              private backPageService: BackPageService,
              private snackBarService: SnackBarService) {
      this.titleService.setTitle(localizationService.translate('titleRoutesBrowser.register.password'));

      this.registerPasswordForm = this.fb.group({
        password: [null, [Validators.required, Validators.minLength(this.passwordMinLenght)]],
        confirmPassword: ['', Validators.required]
      }, {
        validator: MustMatch('password', 'confirmPassword')
    });
   }

  ngOnInit(): void {
    const sectionTitle = this.localizationService.translate('section.registerPassword');
    this.backPageService.setBackPageValue('/register/confirmation', sectionTitle);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  get password() {    return this.registerPasswordForm.get('password'); }
  get confirmPassword() {    return this.registerPasswordForm.get('confirmPassword'); }

  checkPasswords(group: FormGroup) {
    let pass = group.controls.password.value;
    let confirmPass = group.controls.confirmPassword.value;

    return pass === confirmPass ? null : { notSame: true }
  }

  getErrorInvalidPasswordMessage() {
    if (this.password?.hasError('required')) {
      return this.requiredFieldMessage;
    }

    return this.password?.hasError('minlength') ? this.localizationService.translate('validations.user.passwordMinLenght') : '';
  }

  getErrorInvalidConfirmPasswordMessage() {
    return this.confirmPassword?.hasError('required') ? this.requiredFieldMessage : this.localizationService.translate('validations.user.passwordMustBeEquals');
  }

  isInvalidFormOrLoadingRequest(): boolean {
    return !this.registerPasswordForm.valid || this.isLoading;
  }

  onSubmit(): void {
    const password = this.password?.value;

    this.isLoading = true;

    const { email } = this.storageService.getNewUser();

    const createPassSub = this.authService.createPassword(email, password).subscribe(
      data => {
        this.isLoading = false;

        this.storageService.removeNewUserEmail();
        //this.snackBarService.success(err);
        this.router.navigate(['/login'])
      },
      err => {
        this.storageService.removeNewUserEmail();
        this.isLoading = false;
        this.snackBarService.error(err);
      }
    );
    this.subscriptions.add(createPassSub);
  }
}
