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

  findAllBySpace(): Observable<ResponseDataSetUserWithPermissionDto> {

    const spaceId = this.spaceStorage.getSpace().spaceId;

    return this.userApi.findAllBySpaceUsingGET(spaceId)
    .pipe(
      catchError(this.handleError),
      map((resData: any) => {
        return resData?.content || [];
      })
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
