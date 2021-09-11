import { TokenStorageService } from './../../../../_services/token-storage.service';
import { LocalizationService } from './../../../../internationalization/localization.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-register-confirmation',
  templateUrl: './register-confirmation.component.html',
  styleUrls: ['./register-confirmation.component.scss']
})
export class RegisterConfirmationComponent implements OnInit {

  isLoading = false;
  isLoadingNewToken = false;
  registerConfirmationForm: FormGroup;

  constructor(private localizationService: LocalizationService, private fb: FormBuilder, private authService: AuthService,
    private storageService: TokenStorageService, private router: Router) {
    this.registerConfirmationForm = this.fb.group({
      dig1: [null, [Validators.required]],
      dig2: [null, [Validators.required]],
      dig3: [null, [Validators.required]],
      dig4: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    const isLoggedIn = !!this.storageService.getToken();

    if(isLoggedIn) {
      this.router.navigate(['/home']).then( () => window.location.reload());
    }
  }

  get dig1() {  return this.registerConfirmationForm.get('dig1'); }
  get dig2() {  return this.registerConfirmationForm.get('dig2'); }
  get dig3() {  return this.registerConfirmationForm.get('dig3'); }
  get dig4() {  return this.registerConfirmationForm.get('dig4'); }

  sendNewToken() {
    const { email } = this.storageService.getUser();

    this.isLoadingNewToken = true;

    this.authService.resendMailToken(email).subscribe(
      data => {
        this.isLoadingNewToken = false;
      },
      err => {
        this.isLoadingNewToken = false;
      }
    );
  }

  onDigitInput(event: any){

    let element;
    if (event.code !== 'Backspace')
         element = event.srcElement.nextElementSibling;

     if (event.code === 'Backspace')
         element = event.srcElement.previousElementSibling;

     if(element == null)
         return;
     else
         element.focus();
 }

  onInputNumber(event: any, dig: string): any {
    event.target.value = event.target.value.replace("/[^0-9]/g", '');

    if(parseInt(event.target.value)>9) {
      event.target.value = parseInt(event.target.value.charAt(event.target.value. length-1));
      this.setDig(event.target.value, dig);
    }

    let element;
    if (event.code !== 'Backspace')
         element = event.srcElement.nextElementSibling;

     if (event.code === 'Backspace')
         element = event.srcElement.previousElementSibling;

     if(element == null)
         return;
     else
         element.focus();
  }

  private setDig(value: any, dig: string) {
    this.registerConfirmationForm.get(dig)?.setValue(value);
  }

  onSubmit(): void {
    const token =`${this.dig1?.value}${this.dig2?.value}${this.dig3?.value}${this.dig4?.value}`
    this.isLoading = true;

    const { email } = this.storageService.getUser();

    this.authService.activateUserAccount(email, token).subscribe(
      data => {
        this.isLoading = false;
        this.router.navigate(['/login'])
      },
      err => {
        this.isLoading = false;
      }
    );

  }
}
