import { SnackBarService } from './../../../_services/snack-bar.service';
import { RecaptchaConstants } from './../../../constants/RecaptchaConstants';
import { StorageKeyConstants } from './../../../constants/StorageKeyConstants';
import { BackPageService } from './../../../_services/back-page.service';
import { TokenStorageService } from './../../../_services/token-storage.service';
import { AuthService } from './../../../_services/auth.service';
import { LocalizationService } from './../../../internationalization/localization.service';
import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, ChangeDetectorRef, AfterViewInit, AfterViewChecked } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ReCaptchaService } from 'angular-recaptcha3';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewChecked {
  requiredFieldMessage = this.localizationService.translate('validations.requiredField');
  registerForm: FormGroup;
  isLoading = false;
  hidePassword = true;
  isAuthenticated = false;

  constructor(private titleService: Title, private localizationService: LocalizationService,
              private fb: FormBuilder, private authService: AuthService,
              private tokenStorageService: TokenStorageService,
              private router: Router, private _cookieService: CookieService,
              private backPageService: BackPageService,
              private recaptchaService: ReCaptchaService,
              private cdr: ChangeDetectorRef,
              private snackBarService: SnackBarService) {
    this.titleService.setTitle(localizationService.translate('titleRoutesBrowser.login'));

    const isCheckedRememberMeFromCookie = this.getCookieRememberMe();

    this.registerForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
      isCheckedRememberMe: [isCheckedRememberMeFromCookie]
    });

    this.fillFormIfRememberMeChecked();
   }

  ngOnInit(): void {
    this.backPageService.setBackPageValue();
    this.isAuthenticated = this.authService.isLoggedIn;

    if(this.isAuthenticated) {
      this.router.navigate(['/home']);
    }

    this.fillFormIfRememberMeChecked();
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  get email() {   return this.registerForm.get('email'); }
  get password() {    return this.registerForm.get('password'); }
  get isCheckedRememberMe() {    return this.registerForm.get('isCheckedRememberMe'); }

  getCookieRememberMe(): boolean {
    return this._cookieService.check('rememberMe') ?
            this._cookieService.get('rememberMe') === "Yes" : false;
  }

  fillFormIfRememberMeChecked(): boolean {
    const rememberMeCookie = this.getCookieRememberMe();

    if (this.isCheckedRememberMe) {
      this.email?.setValue(this._cookieService.get('email'))
      this.password?.setValue(this._cookieService.get('password'))
    }

    return rememberMeCookie;
  }

  getErrorInvalidEmailMessage() {
     return this.getMessageToRequiredField(this.email);
  }

  getErrorInvalidPasswordMessage() {
     return this.getMessageToRequiredField(this.password);
  }

  isInvalidFormOrNoChanges(): boolean {
    return !this.registerForm.valid || this.isLoading;
  }

  onCheckRememberMe(event: any): void {
    this.isCheckedRememberMe?.setValue(!this.isCheckedRememberMe.value)
  }

  onSubmit(): void {
     const email = this.email?.value;
     const password = this.password?.value;

     this.isLoading = true;

     this.recaptchaService.execute({action: RecaptchaConstants.LOGIN_ACTION }).then(tokenRecaptcha => {

      this.authService.login(email, password, tokenRecaptcha).subscribe(
        data => {

          if (this.isCheckedRememberMe?.value) {
            this._cookieService.set('rememberMe', "Yes");
            this._cookieService.set('email', email);
            this._cookieService.set('password', password);
          } else {
            this._cookieService.set('rememberMe', "No");
            this._cookieService.set('email', "");
            this._cookieService.set('password', "");
          }

          this.isLoading = false;

          //this.snackBarService.success(err);
          this.router.navigate(['/home']);
        },
        err => {
          this.isLoading = false;
          this.snackBarService.error(err);
        }
      );
     });
  }

  userIsAuthenticated() {
    return this.isAuthenticated;
  }

  private getMessageToRequiredField(abstractControl: AbstractControl | null) {
    return abstractControl?.hasError('required') ? this.requiredFieldMessage : '';
 }

}
