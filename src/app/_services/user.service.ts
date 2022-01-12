import { ResponseDataVoid } from './swagger-auto-generated/model/responseDataVoid';
import { UserDto } from './swagger-auto-generated/model/userDto';
import { ResponseDataUserWithPermissionDto } from './swagger-auto-generated/model/responseDataUserWithPermissionDto';
import { UserOnlyIdNameAndEmailDto } from './swagger-auto-generated/model/userOnlyIdNameAndEmailDto';
import { ResponseDataListUserOnlyIdNameAndEmailDto } from './swagger-auto-generated/model/responseDataListUserOnlyIdNameAndEmailDto';
import { UserWithPermissionDto } from './swagger-auto-generated/model/userWithPermissionDto';
import { SpaceStorageService } from './space-storage.service';
import { ResponseDataSetUserWithPermissionDto } from './swagger-auto-generated/model/responseDataSetUserWithPermissionDto';
import { UserControllerService } from './swagger-auto-generated/api/userController.service';
import { catchError, map } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { handleError } from './../constants/HandlerErrorHttp'
import { UserPermissionEnum } from './model/enums/userPermissionEnum';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient,
    private userApi: UserControllerService,
    private spaceStorage: SpaceStorageService) { }

  findUserLogged(): Observable<UserWithPermissionDto> {
    return this.userApi.findUserLoggedUsingGET()
      .pipe(
        catchError(handleError),
        map((resData: ResponseDataUserWithPermissionDto) => {
          return resData?.content || {};
      })
    );
  }

  updateUserLogged(body: UserDto): Observable<UserWithPermissionDto> {
    return this.userApi.updateUserLoggedUsingPUT(body)
      .pipe(
        catchError(handleError),
        map((resData: ResponseDataUserWithPermissionDto) => {
          return resData?.content || {};
      })
    );
  }

  findAllBySpace(): Observable<Array<UserWithPermissionDto>> {
    return this.userApi.findAllBySpaceUsingGET()
    .pipe(
      catchError(handleError),
      map((resData: ResponseDataSetUserWithPermissionDto) => {
        return resData?.content || [];
      })
    );
  }

  findAllAssociationForEvents(): Observable<Array<UserOnlyIdNameAndEmailDto>> {
    return this.userApi.findUsersAssociationForEventsBySpaceUsingGET()
    .pipe(
      catchError(handleError),
      map((resData: ResponseDataListUserOnlyIdNameAndEmailDto) => {
        return resData?.content || [];
      })
    );
  }

  changePermission(email: string, permission: UserPermissionEnum): Observable<void> {
    return this.userApi.updatePermissionUsingPUT(email, permission)
    .pipe(
      catchError(handleError),
      map((resData: ResponseDataVoid) => {
        return;
      })
    );
  }

}
