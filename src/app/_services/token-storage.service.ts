import { SpaceStorageService } from './space-storage.service';
import { UserLogged } from '../pages/auth/login/userLogged';
import { Injectable } from '@angular/core';
import { StorageKeyConstants } from '../constants/StorageKeyConstants'
import jwt_decode from "jwt-decode";

export interface RegisterSessionInterface {
  email: string;
  registrationTokenStartDate: Date;
  registrationTokenEndDate: Date;
}

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor(private spaceStorage: SpaceStorageService) { }

  public get isNewUserFilledInForm(): boolean {
    const { email } = this.getNewUser();
    return !!email;
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(StorageKeyConstants.TOKEN_KEY);
    window.sessionStorage.setItem(StorageKeyConstants.TOKEN_KEY, token);

    const decode = jwt_decode<any>(token);
    this.spaceStorage.saveSpace({ spaceId: decode.spaceId, spaceName: decode.spaceName});
    let user: UserLogged = {
      name: decode.name,
      email: decode.email,
      permissions: decode.permissions,
      spaceId: decode.spaceId,
      spaceName: decode.spaceName
    }

    this.saveUser(user);
  }

  public getToken(): string | null {
    return window.sessionStorage.getItem(StorageKeyConstants.TOKEN_KEY);
  }

  public saveUser(user: UserLogged): void {
    window.sessionStorage.removeItem(StorageKeyConstants.USER_KEY);
    window.sessionStorage.setItem(StorageKeyConstants.USER_KEY, JSON.stringify(user));
  }

  public getUserLogged(): UserLogged {
    const userSessionStorage = window.sessionStorage.getItem(StorageKeyConstants.USER_KEY);
    let user: UserLogged;

    if (userSessionStorage) {
      user = JSON.parse(userSessionStorage);
    } else  {
      user = {
        name: '',
        email: '',
        permissions: new Set<string>(),
        spaceId: '',
        spaceName: '',
      };
    }

    return user;
  }

  public getFirstName(): string {
    const user = this.getUserLogged();

    let fullName = user?.name;
    let indexSpace = fullName?.indexOf(' ');

    return fullName?.substring(0, indexSpace) || fullName || '';
  }

  public saveNewUser(newUserEmail: string, registrationTokenStartDate: Date): void {

    const expiration = new Date();
    expiration.setMinutes(expiration.getMinutes() + 10)

    const registerSession = {
      email: newUserEmail,
      registrationTokenStartDate: registrationTokenStartDate,
      registrationTokenEndDate: expiration
    }

    window.sessionStorage.removeItem(StorageKeyConstants.NEW_USER_KEY);
    window.sessionStorage.setItem(StorageKeyConstants.NEW_USER_KEY, JSON.stringify(registerSession));
  }

  public getNewUser(): RegisterSessionInterface {
    const newUserString = window.sessionStorage.getItem(StorageKeyConstants.NEW_USER_KEY);

    return JSON.parse(newUserString || '{}');
  }

  public removeNewUserEmail(): void {
    window.sessionStorage.removeItem(StorageKeyConstants.NEW_USER_KEY);
  }

}
