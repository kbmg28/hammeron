import { SnackBarService } from './../../../_services/snack-bar.service';
import { BackPageService } from './../../../_services/back-page.service';
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

  registerForm: FormGroup;

  isLoading = false;
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(private titleService: Title, private localizationService: LocalizationService,
              private fb: FormBuilder, private authService: AuthService,
              private storageService: TokenStorageService,
              private router: Router,
              private backPageService: BackPageService,
              private snackBarService: SnackBarService) {
      this.titleService.setTitle(localizationService.translate('titleRoutesBrowser.register.dataForm'));

      this.registerForm = this.fb.group({
        name: [null, [Validators.required]],
        email: [null, [Validators.required, Validators.email]],
        cellPhone: [null, [Validators.required]]
      });
   }

  ngOnInit(): void {
    this.backPageService.setBackPageValue('/home', 'Register');
  }

  get name() {  return this.registerForm.get('name'); }
  get email() {   return this.registerForm.get('email'); }
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

  getErrorInvalidCellPhoneMessage() {
    if (this.cellPhone?.hasError('required')) {
      return this.requiredFieldMessage;
    }
    return this.cellPhone?.value?.length < 11 ? this.localizationService.translate('validations.user.invalidCellPhone') : '';
  }

  onSubmit(): void {
    const name = this.name?.value;
    const email = this.email?.value;
    const cellPhone = this.cellPhone?.value;

    this.isLoading = true;
    const now = new Date();

    this.authService.register(name, email, cellPhone).subscribe(
      data => {
        this.isLoading = false;

        this.storageService.saveNewUser(email, now);
        //this.snackBarService.success(err);
        this.router.navigate(['/register/confirmation'])
      },
      err => {
        this.isLoading = false;
        this.snackBarService.error(err);
      }
    );
  }

}
