import { TokenStorageService } from './../_services/token-storage.service';
import { LocalizationService } from './../internationalization/localization.service';
import { TitleRoutesConstants } from './../constants/TitleRoutesConstants';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../_services/auth.service';

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

  constructor(private titleService: Title, private localizationService: LocalizationService,
              private fb: FormBuilder, private authService: AuthService, private tokenStorageService: TokenStorageService) {
    this.titleService.setTitle(localizationService.translate('titleRoutesBrowser.login'));

    this.registerForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]]
    });
   }

  ngOnInit(): void {
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
       data => {
         this.isLoading = false;
         this.tokenStorageService.saveToken(data.content.jwtToken);
       },
       err => {
         this.isLoading = false;
       }
     );
  }
}
