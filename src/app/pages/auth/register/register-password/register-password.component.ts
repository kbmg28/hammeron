import { Router } from '@angular/router';
import { TokenStorageService } from './../../../../_services/token-storage.service';
import { AuthService } from './../../../../_services/auth.service';
import { LocalizationService } from './../../../../internationalization/localization.service';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register-password',
  templateUrl: './register-password.component.html',
  styleUrls: ['./register-password.component.scss']
})
export class RegisterPasswordComponent implements OnInit {
  requiredFieldMessage = this.localizationService.translate('validations.requiredField');

  hide = true;
  passwordMinLenght = 6;
  registerPasswordForm: FormGroup;

  isLoading = false;
  isSuccessful = false;
  errorMessage = '';

  constructor(private titleService: Title, private localizationService: LocalizationService,
              private fb: FormBuilder, private authService: AuthService,
              private storageService: TokenStorageService,
              private router: Router) {
      this.titleService.setTitle(localizationService.translate('titleRoutesBrowser.register.password'));

      this.registerPasswordForm = this.fb.group({
        password: [null, [Validators.required, Validators.minLength(this.passwordMinLenght)]],
      });
   }

  ngOnInit(): void {
    const isLoggedIn = !!this.storageService.getToken();

    if(isLoggedIn) {
      this.router.navigate(['/home']).then( () => window.location.reload());
    }
  }

  get password() {    return this.registerPasswordForm.get('password'); }

  getErrorInvalidPasswordMessage() {
    if (this.password?.hasError('required')) {
      return this.requiredFieldMessage;
    }

    return this.password?.hasError('minlength') ? this.localizationService.translate('validations.user.passwordMinLenght') : '';
  }

  onSubmit(): void {
    const password = this.password?.value;

    this.isLoading = true;

    const email = this.storageService.getNewUserEmail();
/*
    this.authService.createPassword(email, password).subscribe(
      data => {
        this.isLoading = false;

        this.storageService.removeNewUserEmail();
        this.router.navigate(['/login'])
      },
      err => {
        this.errorMessage = err.message;
        this.storageService.removeNewUserEmail();
        this.isLoading = false;
      }
    );
    */
  }
}
