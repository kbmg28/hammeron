import { SpaceStorageService } from './space-storage.service';
import { ResponseDataSetSingerDto } from './swagger-auto-generated/model/responseDataSetSingerDto';
import { SingerDto } from './swagger-auto-generated/model/singerDto';
import { ResponseDataMusicWithSingerAndLinksDto } from './swagger-auto-generated/model/responseDataMusicWithSingerAndLinksDto';
import { MusicWithSingerAndLinksDto } from './swagger-auto-generated/model/musicWithSingerAndLinksDto';
import { map, catchError } from 'rxjs/operators';
import { ResponseDataSetMusicWithSingerAndLinksDto } from './swagger-auto-generated/model/responseDataSetMusicWithSingerAndLinksDto';
import { Observable, throwError } from 'rxjs';
import { MusicControllerService } from './swagger-auto-generated/api/musicController.service';
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MusicService {

  constructor(private musicApi: MusicControllerService,
              private spaceStorage: SpaceStorageService
    ) { }

  findAllBySpace(): Observable<Array<MusicWithSingerAndLinksDto>> {
    const spaceId = this.spaceStorage.getSpace().spaceId;

    return this.musicApi.findAllMusicUsingGET(spaceId)
    .pipe(
      catchError(this.handleError),
      map((resData: ResponseDataSetMusicWithSingerAndLinksDto) => {
        return resData?.content || [];
      })
    );
  }

  findAllSingerBySpace(): Observable<Array<SingerDto>> {
    const spaceId = this.spaceStorage.getSpace().spaceId;

    return this.musicApi.findAllSingerUsingGET(spaceId)
    .pipe(
      catchError(this.handleError),
      map((resData: ResponseDataSetSingerDto) => {
        return resData?.content || [];
      })
    );
  }

  create(body: MusicWithSingerAndLinksDto): Observable<MusicWithSingerAndLinksDto> {
    const spaceId = this.spaceStorage.getSpace().spaceId;

    return this.musicApi.createMusicUsingPOST(spaceId, body)
    .pipe(
      catchError(this.handleError),
      map((resData: any) => {
        return resData?.content;
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
