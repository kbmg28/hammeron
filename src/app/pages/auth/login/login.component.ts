import { TokenStorageService } from './../../../_services/token-storage.service';
import { AuthService } from './../../../_services/auth.service';
import { LocalizationService } from './../../../internationalization/localization.service';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  requiredFieldMessage = this.localizationService.translate('validations.requiredField');
  registerForm: FormGroup;
  isLoading = false;
  hidePassword = true;
  isCheckedRememberMe: boolean;

  constructor(private titleService: Title, private localizationService: LocalizationService,
              private fb: FormBuilder, private authService: AuthService,
              private tokenStorageService: TokenStorageService,
              private router: Router, private _cookieService: CookieService) {
    this.titleService.setTitle(localizationService.translate('titleRoutesBrowser.login'));

    this.isCheckedRememberMe = _cookieService.check('rememberMe') ? 
            _cookieService.get('rememberMe') === "Yes" : false;
    
    var initialName = null;
    var initialPassword = null;

    if (this.isCheckedRememberMe) {
      initialName = _cookieService.get('email');
      initialPassword = _cookieService.get('password');
    }

    this.registerForm = this.fb.group({
      email: [initialName, [Validators.required, Validators.email]],
      password: [initialPassword, [Validators.required]]
    });
   }

  ngOnInit(): void {
    const isLoggedIn = !!this.tokenStorageService.getToken();

    if(isLoggedIn) {
      this.router.navigate(['/home']).then( () => window.location.reload());
    }
  }

  get email() {   return this.registerForm.get('email'); }
  get password() {    return this.registerForm.get('password'); }

  getErrorInvalidEmailMessage() {
     return this.getMessageToRequiredField(this.email);
  }

  getErrorInvalidPasswordMessage() {
     return this.getMessageToRequiredField(this.password);
  }

  private getMessageToRequiredField(abstractControl: AbstractControl | null) {
     return abstractControl?.hasError('required') ? this.requiredFieldMessage : '';
  }

  onSubmit(): void {
     const email = this.email?.value;
     const password = this.password?.value;

     this.isLoading = true;

     this.authService.login(email, password).subscribe(
       () => {
         this.isLoading = false;

         if (this.isCheckedRememberMe) {
           this._cookieService.set('rememberMe', "Yes");
           this._cookieService.set('email', email);
           this._cookieService.set('password', password);
         } else {
           this._cookieService.set('rememberMe', "No");
           this._cookieService.set('email', "");
           this._cookieService.set('password', "");
         }

         this.router.navigate(['/home']).then( () => window.location.reload())
       },
       err => {
         this.isLoading = false;
       }
     );
  }
}
