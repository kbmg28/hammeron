import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalizationService } from './../../internationalization/localization.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-register-confirmation',
  templateUrl: './register-confirmation.component.html',
  styleUrls: ['./register-confirmation.component.scss']
})
export class RegisterConfirmationComponent implements OnInit {

  isLoading = false;
  registerConfirmationForm: FormGroup;

  constructor(private localizationService: LocalizationService, private fb: FormBuilder, private authService: AuthService) {
    this.registerConfirmationForm = this.fb.group({
      dig1: [null, [Validators.required]],
      dig2: [null, [Validators.required]],
      dig3: [null, [Validators.required]],
      dig4: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
  }

  get dig1() {  return this.registerConfirmationForm.get('dig1'); }
  get dig2() {  return this.registerConfirmationForm.get('dig2'); }
  get dig3() {  return this.registerConfirmationForm.get('dig3'); }
  get dig4() {  return this.registerConfirmationForm.get('dig4'); }

  sendNewToken() {
    console.log('send new token...')
  }

  onSubmit(): void {
    const digits = {
      dig1: this.dig1?.value,
      dig2: this.dig2?.value,
      dig3: this.dig3?.value,
      dig4: this.dig4?.value
    }

    this.isLoading = true;
/*
    this.authService.register(digits).subscribe(
      data => {
        this.isLoading = false;
      },
      err => {
        this.isLoading = false;
      }
    );
  */
  }
}
