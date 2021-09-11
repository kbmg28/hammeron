import { ResponseDataListstring } from './swagger-auto-generated/model/responseDataListstring';
import { UserControllerService } from './swagger-auto-generated/api/userController.service';
import { catchError, tap, map } from 'rxjs/operators';
import { throwError, BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private userApi: UserControllerService) { }

  findAll(): Observable<Array<string>> {

    return this.userApi.findAllUsingGET()
    .pipe(
      // catchError(this.handleError),
      map((resData: ResponseDataListstring) => {
        return resData?.content || [];
      })
    );
  }

}
