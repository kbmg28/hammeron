import { AuthService } from './../_services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

const YOU_MUST_ENTER_A_VALUE = 'Campo não pode estar em branco';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  hide = true;
  passwordMinLenght = 6;
  registerForm: FormGroup;

  isLoading = false;
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private authService: AuthService) {
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
    return (this.name?.hasError('required')) ? YOU_MUST_ENTER_A_VALUE : ''
  }

  getErrorInvalidEmailMessage() {
    if (this.email?.hasError('required')) {
      return YOU_MUST_ENTER_A_VALUE;
    }

    return this.email?.hasError('email') ? 'E-mail inválido' : '';
  }

  getErrorInvalidPasswordMessage() {
    if (this.password?.hasError('required')) {
      return YOU_MUST_ENTER_A_VALUE;
    }

    return this.password?.hasError('minlength') ? `Sua senha deve possuir no mínimo ${this.passwordMinLenght} caracteres` : '';
  }

  getErrorInvalidCellPhoneMessage() {
    if (this.cellPhone?.hasError('required')) {
      return YOU_MUST_ENTER_A_VALUE;
    }
    return this.cellPhone?.value?.length < 11 ? 'Celular inválido' : '';
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
      },
      err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
        this.isLoading = false;
      }
    );
  }

}
