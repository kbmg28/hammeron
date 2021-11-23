import { UserDto } from './swagger-auto-generated/model/userDto';
import { ResponseDataUserWithPermissionDto } from './swagger-auto-generated/model/responseDataUserWithPermissionDto';
import { UserOnlyIdNameAndEmailDto } from './swagger-auto-generated/model/userOnlyIdNameAndEmailDto';
import { ResponseDataListUserOnlyIdNameAndEmailDto } from './swagger-auto-generated/model/responseDataListUserOnlyIdNameAndEmailDto';
import { UserWithPermissionDto } from './swagger-auto-generated/model/userWithPermissionDto';
import { SpaceStorageService } from './space-storage.service';
import { ResponseDataSetUserWithPermissionDto } from './swagger-auto-generated/model/responseDataSetUserWithPermissionDto';
import { ResponseDataSetMusicWithSingerAndLinksDto } from './swagger-auto-generated/model/responseDataSetMusicWithSingerAndLinksDto';
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

  constructor(private http: HttpClient,
    private userApi: UserControllerService,
    private spaceStorage: SpaceStorageService) { }

  findUserLogged(): Observable<UserWithPermissionDto> {
    const spaceId = this.spaceStorage.getSpace().spaceId;

    return this.userApi.findUserLoggedUsingGET(spaceId)
      .pipe(
        catchError(this.handleError),
        map((resData: ResponseDataUserWithPermissionDto) => {
          return resData?.content || {};
      })
    );
  }

  updateUserLogged(body: UserDto): Observable<UserWithPermissionDto> {
    const spaceId = this.spaceStorage.getSpace().spaceId;

    return this.userApi.updateUserLoggedUsingPUT(spaceId, body)
      .pipe(
        catchError(this.handleError),
        map((resData: ResponseDataUserWithPermissionDto) => {
          return resData?.content || {};
      })
    );
  }

  findAllBySpace(): Observable<Array<UserWithPermissionDto>> {

    const spaceId = this.spaceStorage.getSpace().spaceId;

    return this.userApi.findAllBySpaceUsingGET(spaceId)
    .pipe(
      catchError(this.handleError),
      map((resData: ResponseDataSetUserWithPermissionDto) => {
        return resData?.content || [];
      })
    );
  }

  findAllAssociationForEvents(): Observable<Array<UserOnlyIdNameAndEmailDto>> {

    const spaceId = this.spaceStorage.getSpace().spaceId;

    return this.userApi.findUsersAssociationForEventsBySpaceUsingGET(spaceId)
    .pipe(
      catchError(this.handleError),
      map((resData: ResponseDataListUserOnlyIdNameAndEmailDto) => {
        return resData?.content || [];
      })
    );
  }

  private handleError(errorRes: HttpErrorResponse) {

    let errorMessage = 'An unknown error occurred!';

    if (!errorRes.error || !errorRes.error.message) {
      return throwError(errorMessage);
    }
    errorMessage = errorRes.error.message

    return throwError(errorMessage);
  }
}
