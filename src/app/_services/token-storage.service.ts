import { Injectable } from '@angular/core';
import jwt_decode from "jwt-decode";

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
const NEW_USER_EMAIL_KEY = 'new-user-email';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor() { }

  signOut(): void {
    window.sessionStorage.clear();
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);

    const decode = jwt_decode<any>(token);
    let user = {
      name: decode.name,
      email: decode.email,
      roles: []
    }

    this.saveUser(user);
  }

  public getToken(): string | null {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return {};
  }

  public getFirstName(): string {
    const user = this.getUser();

    let fullName = user?.name;
    let indexSpace = fullName?.indexOf(' ');

    return fullName?.substring(0, indexSpace) || '';
  }

  public saveNewUserEmail(newUserEmail: string): void {
    window.sessionStorage.removeItem(NEW_USER_EMAIL_KEY);
    window.sessionStorage.setItem(NEW_USER_EMAIL_KEY, newUserEmail);
  }

  public getNewUserEmail(): string {
    const newUserEmail = window.sessionStorage.getItem(NEW_USER_EMAIL_KEY);

    return newUserEmail ? newUserEmail : '';
  }

  public removeNewUserEmail(): void {
    window.sessionStorage.removeItem(NEW_USER_EMAIL_KEY);
  }

}
