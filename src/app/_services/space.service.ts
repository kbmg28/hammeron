import { ResponseDatastring } from './swagger-auto-generated/model/responseDatastring';
import { ResponseDataVoid } from './swagger-auto-generated/model/responseDataVoid';
import { SpaceRequestDto } from './swagger-auto-generated/model/spaceRequestDto';
import { HttpErrorResponse } from '@angular/common/http';
import { CurrentSpaceStorage } from './model/currentSpaceStorage';
import { SpaceStorageService } from './space-storage.service';
import { ResponseDataMySpace } from './swagger-auto-generated/model/responseDataMySpace';
import { MySpace } from './swagger-auto-generated/model/mySpace';
import { ResponseDataListMySpace } from './swagger-auto-generated/model/responseDataListMySpace';
import { map, catchError } from 'rxjs/operators';
import { SpaceControllerService } from './swagger-auto-generated/api/spaceController.service';
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpaceService {

  constructor(private spaceApi: SpaceControllerService, private spaceStorage: SpaceStorageService) { }


  findAllSpacesOfUserLogged(): Observable<Array<MySpace>> {

    return this.spaceApi.findAllSpacesByUserAppUsingGET()
    .pipe(
      catchError(this.handleError),
      map((resData: ResponseDataListMySpace) => {
        return resData.content || [];
      })
    );
  }

  findCurrentSpaceOfUserLogged(): Observable<MySpace> {
    return this.spaceApi.findLastAccessedSpaceUsingGET()
    .pipe(
      catchError(this.handleError),
      map((resData: ResponseDataMySpace) => {
        return resData.content || {};
      })
    );
  }

  changeSpaceViewOfUserLogged(spaceId: string): Observable<string> {
    return this.spaceApi.changeViewSpaceUserUsingPUT(spaceId)
    .pipe(
      catchError(this.handleError),
      map((resData: ResponseDatastring) => {
        return resData.content || '';
      })
    );
  }

  requestNewSpace(body: SpaceRequestDto): Observable<ResponseDataVoid> {
    return this.spaceApi.requestNewSpaceForUserUsingPOST(body)
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
