import { UserChangePasswordDto } from './swagger-auto-generated/model/userChangePasswordDto';
import { UserLogged } from './../pages/auth/login/userLogged';
import { RegisterPasswordDto } from './swagger-auto-generated/model/registerPasswordDto';
import { RegisterDto } from './swagger-auto-generated/model/registerDto';
import { UserTokenHashDto } from './swagger-auto-generated/model/userTokenHashDto';
import { ActivateUserAccountRefreshDto } from './swagger-auto-generated/model/activateUserAccountRefreshDto';
import { TokenStorageService } from './token-storage.service';
import { ResponseDataJwtTokenDto } from './swagger-auto-generated/model/responseDataJwtTokenDto';
import { LoginDto } from './swagger-auto-generated/model/loginDto';
import { SecurityControllerService } from './swagger-auto-generated/api/securityController.service';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject: BehaviorSubject<any> = new BehaviorSubject(null);
  public currentUser: Observable<UserLogged>;

  constructor(private http: HttpClient, private securityApi: SecurityControllerService,
    private tokenStorageService: TokenStorageService) {
      const token = this.tokenStorageService.getToken();

      if (token !== null) {
        this.currentUserSubject = new BehaviorSubject<UserLogged>(this.tokenStorageService.getUserLogged());
      }

      this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): UserLogged {
    return this.currentUserSubject.value;
  }

  public get isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  signOut(): void {
    localStorage.clear();
    window.sessionStorage.clear();
    this.currentUserSubject.next(null);
  }

  login(email: string, password: string, tokenRecaptcha: string) : Observable<ResponseDataJwtTokenDto> {
    let body: LoginDto = {
      email: email,
      password: password
    };

    return this.securityApi.loginAndGetTokenUsingPOST(tokenRecaptcha, body)
    .pipe(
      catchError(this.handleError),
      tap((resData: ResponseDataJwtTokenDto) => {
        const jwtToken = resData.content?.jwtToken || '';
        this.tokenStorageService.saveToken(jwtToken);

        this.currentUserSubject.next(this.tokenStorageService.getUserLogged());
      })
    );
  }

  register(name: string, email: string, cellPhone: string) {

    let body: RegisterDto = {
      name: name,
      email: email,
      cellPhone: cellPhone
    };

    return this.securityApi.registerUserAccountUsingPOST(body)
    .pipe(
      catchError(this.handleError)
    );
  }

  resendMailToken(email: string) {
    let body: ActivateUserAccountRefreshDto = {
      email: email
    };

    return this.securityApi.resendMailTokenUsingPOST(body)
    .pipe(
      catchError(this.handleError)
    );
  }

  activateUserAccount(email: string, token: string) {
    let body: UserTokenHashDto = {
      email: email,
      tokenHash: token
    };

    return this.securityApi.activateUserAccountUsingPOST(body)
    .pipe(
      catchError(this.handleError)
    );
  }

  createPassword(email: string, password: string) {

    let body: RegisterPasswordDto = {
      email: email,
      password: password
    };

    return this.securityApi.registerUserPasswordUsingPOST(body)
    .pipe(
      catchError(this.handleError)
    );

  }

  recoveryPassword(email: string) {

    let body: ActivateUserAccountRefreshDto = {
      email: email
    };

    return this.securityApi.passwordRecoveryUsingPOST(body)
    .pipe(
      catchError(this.handleError)
    );

  }

  changePassword(email: string, temporaryPassword: string, newPassword: string) {

    let body: UserChangePasswordDto = {
      email: email,
      temporaryPassword: temporaryPassword,
      newPassword: newPassword
    };

    return this.securityApi.passwordRecoveryChangeUsingPOST(body)
    .pipe(
      catchError(this.handleError)
    );

  }

  private handleError(errorRes: HttpErrorResponse) {

    let errorMessage = 'An unknown error occurred!';

    if (!errorRes.error || !errorRes.error.error.message) {
      return throwError(errorMessage);
    }
    errorMessage = errorRes.error.error.message

    return throwError(errorMessage);
  }
}
