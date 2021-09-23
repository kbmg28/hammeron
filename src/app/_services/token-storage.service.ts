import { UserLogged } from '../pages/auth/login/userLogged';
import { Injectable } from '@angular/core';
import jwt_decode from "jwt-decode";

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
const NEW_USER_KEY = 'new-user';

export interface RegisterSessionInterface {
  email: string;
  registrationTokenStartDate: Date;
  registrationTokenEndDate: Date;
}

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor() { }

  public get isNewUserFilledInForm(): boolean {
    const { email } = this.getNewUser();
    return !!email;
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);

    const decode = jwt_decode<any>(token);

    let user: UserLogged = {
      name: decode.name,
      email: decode.email,
      roles: new Set<string>()
    }

    this.saveUser(user);
  }

  public getToken(): string | null {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user: UserLogged): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUserLogged(): UserLogged {
    const userSessionStorage = window.sessionStorage.getItem(USER_KEY);
    let user: UserLogged;

    if (userSessionStorage) {
      user = JSON.parse(userSessionStorage);
    } else  {
      user = {
        name: '',
        email: '',
        roles: new Set<string>()
      };
    }

    return user;
  }

  public getFirstName(): string {
    const user = this.getUserLogged();

    let fullName = user?.name;
    let indexSpace = fullName?.indexOf(' ');

    return fullName?.substring(0, indexSpace) || '';
  }

  public saveNewUser(newUserEmail: string, registrationTokenStartDate: Date): void {

    const expiration = new Date();
    expiration.setMinutes(expiration.getMinutes() + 10)

    const registerSession = {
      email: newUserEmail,
      registrationTokenStartDate: registrationTokenStartDate,
      registrationTokenEndDate: expiration
    }

    window.sessionStorage.removeItem(NEW_USER_KEY);
    window.sessionStorage.setItem(NEW_USER_KEY, JSON.stringify(registerSession));
  }

  public getNewUser(): RegisterSessionInterface {
    const newUserString = window.sessionStorage.getItem(NEW_USER_KEY);

    return JSON.parse(newUserString || '{}');
  }

  public removeNewUserEmail(): void {
    window.sessionStorage.removeItem(NEW_USER_KEY);
  }

}
