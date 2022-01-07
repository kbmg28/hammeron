import { SpaceApproveDto } from './swagger-auto-generated/model/spaceApproveDto';
import { SpaceDto } from './swagger-auto-generated/model/spaceDto';
import { ResponseDataListSpaceDto } from './swagger-auto-generated/model/responseDataListSpaceDto';
import { SpaceOverviewDto } from './swagger-auto-generated/model/spaceOverviewDto';
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
import { ResponseDataSpaceOverviewDto } from './swagger-auto-generated';
import { handleError } from './../constants/HandlerErrorHttp'
@Injectable({
  providedIn: 'root'
})
export class SpaceService {

  constructor(private spaceApi: SpaceControllerService, private spaceStorage: SpaceStorageService) { }


  findAllSpacesOfUserLogged(): Observable<Array<MySpace>> {

    return this.spaceApi.findAllSpacesByUserAppUsingGET()
    .pipe(
      catchError(handleError),
      map((resData: ResponseDataListMySpace) => {
        return resData.content || [];
      })
    );
  }

  findCurrentSpaceOfUserLogged(): Observable<MySpace> {
    return this.spaceApi.findLastAccessedSpaceUsingGET()
    .pipe(
      catchError(handleError),
      map((resData: ResponseDataMySpace) => {
        return resData.content || {};
      })
    );
  }

  changeSpaceViewOfUserLogged(spaceId: string): Observable<string> {
    return this.spaceApi.changeViewSpaceUserUsingPUT(spaceId)
    .pipe(
      catchError(handleError),
      map((resData: ResponseDatastring) => {
        return resData.content || '';
      })
    );
  }

  requestNewSpace(body: SpaceRequestDto): Observable<ResponseDataVoid> {
    return this.spaceApi.requestNewSpaceForUserUsingPOST(body)
    .pipe(
      catchError(handleError)
    );
  }

  overview(): Observable<SpaceOverviewDto> {
    return this.spaceApi.findSpaceOverviewUsingGET()
    .pipe(
      catchError(handleError),
      map((resData: ResponseDataSpaceOverviewDto) => {
        return resData.content || {};
      })
    );
  }

  findAllSpaceByStatus(status: SpaceApproveDto.SpaceStatusEnumEnum): Observable<Array<SpaceDto>> {
    return this.spaceApi.findAllSpaceToApproveUsingGET(status)
      .pipe(
        catchError(handleError),
        map((resData: ResponseDataListSpaceDto) => {
          return resData?.content || [];
      })
    );
  }

  approveSpace(spaceId: string, status: SpaceApproveDto.SpaceStatusEnumEnum): Observable<ResponseDataVoid> {
    return this.spaceApi.approveNewSpaceForUserUsingPOST(spaceId, { spaceStatusEnum: status })
    .pipe(
      catchError(handleError)
    );
  }
}
