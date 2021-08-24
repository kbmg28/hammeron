import { AuthService } from './../_services/auth.service';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

const YOU_MUST_ENTER_A_VALUE = 'You must enter a value';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  hide = true;
  registerForm: FormGroup;

  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private authService: AuthService) {
      this.registerForm = this.fb.group({
        name: [null, [Validators.required]],
        email: [null, [Validators.required, Validators.email]],
        password: [null, Validators.required]
      })
   }

  ngOnInit(): void {
  }

  onSubmit(): void {
    const name = this.registerForm.get("name")?.value;
    const email = this.registerForm.get("email")?.value;
    const password = this.registerForm.get("password")?.value;

    this.authService.register(name, email, password).subscribe(
      data => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
      },
      err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    );
  }

  getErrorInvalidNameMessage() {
    if (this.registerForm.controls.name.hasError('required')) {
      return YOU_MUST_ENTER_A_VALUE;
    }

    return ''
  }

  getErrorInvalidEmailMessage() {
    if (this.registerForm.controls.email.hasError('required')) {
      return YOU_MUST_ENTER_A_VALUE;
    }

    return this.registerForm.controls.email.hasError('email') ? 'Not a valid email' : '';
  }

  getErrorInvalidPasswordMessage() {
    if (this.registerForm.controls.password.hasError('required')) {
      return YOU_MUST_ENTER_A_VALUE;
    }

    return ''
  }

  submit() {
    if (!this.registerForm.valid) {
      return;
    }
    this.onSubmit();
  }
}
