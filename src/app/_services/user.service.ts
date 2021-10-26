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

  constructor(private http: HttpClient, private userApi: UserControllerService) { }

  findAllBySpace(spaceId: string): Observable<ResponseDataSetUserWithPermissionDto> {

    return this.userApi.findAllBySpaceUsingGET(spaceId)
    .pipe(
      // catchError(this.handleError),
      map((resData: any) => {
        return resData?.content || [];
      })
    );
  }

}
