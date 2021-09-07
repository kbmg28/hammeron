import { TokenStorageService } from './../../../_services/token-storage.service';
import { LocalizationService } from './../../../internationalization/localization.service';
import { TitleRoutesConstants } from './../../../constants/TitleRoutesConstants';
import { AuthService } from './../../../_services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  requiredFieldMessage = this.localizationService.translate('validations.requiredField');

  hide = true;
  passwordMinLenght = 6;
  registerForm: FormGroup;

  isLoading = false;
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(private titleService: Title, private localizationService: LocalizationService,
              private fb: FormBuilder, private authService: AuthService,
              private storageService: TokenStorageService,
              private router: Router) {
      this.titleService.setTitle(localizationService.translate('titleRoutesBrowser.register'));

      this.registerForm = this.fb.group({
        name: [null, [Validators.required]],
        email: [null, [Validators.required, Validators.email]],
        password: [null, [Validators.required, Validators.minLength(this.passwordMinLenght)]],
        cellPhone: [null, [Validators.required]]
      });
   }

  ngOnInit(): void {
  }

  get name() {  return this.registerForm.get('name'); }
  get email() {   return this.registerForm.get('email'); }
  get password() {    return this.registerForm.get('password'); }
  get cellPhone() {    return this.registerForm.get('cellPhone'); }

  getErrorInvalidNameMessage() {
    return (this.name?.hasError('required')) ? this.requiredFieldMessage : ''
  }

  getErrorInvalidEmailMessage() {
    if (this.email?.hasError('required')) {
      return this.requiredFieldMessage;
    }

    return this.email?.hasError('email') ? this.localizationService.translate('validations.user.invalidEmail') : '';
  }

  getErrorInvalidPasswordMessage() {
    if (this.password?.hasError('required')) {
      return this.requiredFieldMessage;
    }

    return this.password?.hasError('minlength') ? this.localizationService.translate('validations.user.passwordMinLenght') : '';
  }

  getErrorInvalidCellPhoneMessage() {
    if (this.cellPhone?.hasError('required')) {
      return this.requiredFieldMessage;
    }
    return this.cellPhone?.value?.length < 11 ? this.localizationService.translate('validations.user.invalidCellPhone') : '';
  }

  onSubmit(): void {
    const name = this.name?.value;
    const email = this.email?.value;
    const password = this.password?.value;
    const cellPhone = this.cellPhone?.value;

    this.isLoading = true;

    this.authService.register(name, email, password, cellPhone).subscribe(
      data => {
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        this.isLoading = false;

        let user = {
          name: name,
          email: email,
          roles: []
        }

        this.storageService.saveUser(user);
        this.router.navigate(['/register/confirmation'])
      },
      err => {
        this.errorMessage = err.message;
        this.isSignUpFailed = true;
        this.isLoading = false;
      }
    );
  }

}
