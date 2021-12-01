import { SnackBarService } from './../../../../_services/snack-bar.service';
import { BackPageService } from './../../../../_services/back-page.service';
import { TokenStorageService } from './../../../../_services/token-storage.service';
import { LocalizationService } from './../../../../internationalization/localization.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';
import { Title } from '@angular/platform-browser';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-register-confirmation',
  templateUrl: './register-confirmation.component.html',
  styleUrls: ['./register-confirmation.component.scss']
})
export class RegisterConfirmationComponent implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();

  isLoading = false;
  isLoadingNewToken = false;
  canRequestNewCode = false;

  registerConfirmationForm: FormGroup;

  minutesInAnHour = 60;
  secondsInAMinute  = 60;
  milliSecondsInASecond = 1000;

  expireDate: any;

  timeDifference: any;
  secondsToExpired: any;
  minutesToExpired: any;

  constructor(private titleService: Title, private localizationService: LocalizationService,
    private fb: FormBuilder, private authService: AuthService,
    private storageService: TokenStorageService, private router: Router,
    private backPageService: BackPageService,
    private snackBarService: SnackBarService) {

      this.titleService.setTitle(localizationService.translate('titleRoutesBrowser.register.confirmation'));

      this.registerConfirmationForm = this.fb.group({
        dig1: [null, [Validators.required]],
        dig2: [null, [Validators.required]],
        dig3: [null, [Validators.required]],
        dig4: [null, [Validators.required]]
      });

      this.updateExpireDate();
      const timeDiffSub = interval(1000)
        .subscribe(x => { this.getTimeDifference(); });

      this.subscription.add(timeDiffSub)
  }

  ngOnInit(): void {
    const message = this.localizationService.translate('section.registerConfirmation');
    this.backPageService.setBackPageValue('/register', message);
  }

  ngOnDestroy() {
     this.subscription.unsubscribe();
  }

  get dig1() {  return this.registerConfirmationForm.get('dig1'); }
  get dig2() {  return this.registerConfirmationForm.get('dig2'); }
  get dig3() {  return this.registerConfirmationForm.get('dig3'); }
  get dig4() {  return this.registerConfirmationForm.get('dig4'); }

  updateExpireDate() {
    const { registrationTokenEndDate } = this.storageService.getNewUser();
    this.expireDate = new Date(registrationTokenEndDate);
  }

  sendNewToken() {
    const { email } = this.storageService.getNewUser();

    this.isLoadingNewToken = true;

    const newMailTokenSub = this.authService.resendMailToken(email).subscribe(
      data => {
        this.isLoadingNewToken = false;

        this.storageService.saveNewUser(email, new Date());
        this.updateExpireDate();
        this.canRequestNewCode = false;
        //this.snackBarService.success(err);
      },
      err => {
        this.isLoadingNewToken = false;
        this.snackBarService.error(err);
      }
    );

    this.subscription.add(newMailTokenSub)
  }

  isInvalidFormOrLoadingRequest(): boolean {
    return !this.registerConfirmationForm.valid || this.isLoading;
  }

  onInputNumber(event: any, dig: string, previousDig?: string): any {
    event.target.value = event.target.value.replace("/[^1-9]/g", '');

    if(parseInt(event.target.value) > 9 || event.target.value.length > 1) {
      event.target.value = parseInt(event.target.value.charAt(event.target.value.length-1));
      this.setDig(event.target.value, dig);
    }

    let element;

    if (event.keyCode !== 8){
      element = event.srcElement.nextElementSibling;
    } else {
      element = event.srcElement.previousElementSibling;
      if (!!previousDig) {
        this.setDig(null, previousDig);
      }
    }

    if(element != null) {
      element.focus();
    } else {
      event.srcElement.blur()
    }
  }

  private setDig(value: any, dig: string) {
    this.registerConfirmationForm.get(dig)?.setValue(value);
  }

  onSubmit(): void {
    const tokenToActivateAccount =`${this.dig1?.value}${this.dig2?.value}${this.dig3?.value}${this.dig4?.value}`
    this.isLoading = true;

    const { email } = this.storageService.getNewUser();

    const activateUserSub = this.authService.activateUserAccount(email, tokenToActivateAccount).subscribe(
      data => {
        this.isLoading = false;
        //this.snackBarService.success(err);
        this.router.navigate(['/register/password'])
      },
      err => {
        this.isLoading = false;
        this.snackBarService.error(err);
      }
    );

    this.subscription.add(activateUserSub)
  }

  private getTimeDifference () {
    this.timeDifference = this.expireDate.getTime() - new Date().getTime();
    this.allocateTimeUnits(this.timeDifference);
  }

  private allocateTimeUnits (timeDifference: any) {
      this.secondsToExpired = Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.secondsInAMinute);
      this.minutesToExpired = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.secondsInAMinute);

      if (this.secondsToExpired <= 0 && this.minutesToExpired <= 0) {
        this.secondsToExpired = this.minutesToExpired = '00';
        this.canRequestNewCode = true;
      }
      else {

        if (this.secondsToExpired < 10) {
          this.secondsToExpired = '0' + this.secondsToExpired;
        }

        if (this.minutesToExpired < 10) {
          this.minutesToExpired = '0' + this.minutesToExpired;
        }

      }
  }
}
