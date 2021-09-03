import { UserTokenHashDto } from './swagger-auto-generated/model/userTokenHashDto';
import { ActivateUserAccountRefreshDto } from './swagger-auto-generated/model/activateUserAccountRefreshDto';
import { TokenStorageService } from './token-storage.service';
import { UserDto } from './swagger-auto-generated/model/userDto';
import { ResponseDataJwtTokenDto } from './swagger-auto-generated/model/responseDataJwtTokenDto';
import { LoginDto } from './swagger-auto-generated/model/loginDto';
import { SecurityControllerService } from './swagger-auto-generated/api/securityController.service';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject, fromEventPattern } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

const AUTH_API = 'http://localhost:8080/security';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private securityApi: SecurityControllerService, private tokenStorageService: TokenStorageService) { }

  login(email: string, password: string) {
    let body: LoginDto = {
      email: email,
      password: password
    };

    return this.securityApi.loginAndGetTokenUsingPOST(body)
    .pipe(
      catchError(this.handleError),
      tap((resData: ResponseDataJwtTokenDto) => {
        const jwtToken = resData.content?.jwtToken || '';
        this.tokenStorageService.saveToken(jwtToken);
      })
    );
  }

  register(name: string, email: string, password: string, cellPhone: string) {

    let body: UserDto = {
      name: name,
      email: email,
      password: password,
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

  private handleError(errorRes: HttpErrorResponse) {

    let errorMessage = 'An unknown error occurred!';

    if (!errorRes.error || !errorRes.error.error.message) {
      return throwError(errorMessage);
    }

    errorMessage = errorRes.error.error.message

    return throwError(errorMessage);
  }
}
