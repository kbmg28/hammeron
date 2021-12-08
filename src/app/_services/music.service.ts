import { MusicOnlyIdAndMusicNameAndSingerNameDto } from './swagger-auto-generated/model/musicOnlyIdAndMusicNameAndSingerNameDto';
import { ResponseDataListMusicOnlyIdAndMusicNameAndSingerNameDto } from './swagger-auto-generated/model/responseDataListMusicOnlyIdAndMusicNameAndSingerNameDto';
import { ResponseDataMusicDto } from './swagger-auto-generated/model/responseDataMusicDto';
import { ResponseDataVoid } from './swagger-auto-generated/model/responseDataVoid';
import { MusicTopUsedDto } from './swagger-auto-generated/model/musicTopUsedDto';
import { ResponseDataListMusicTopUsedDto } from './swagger-auto-generated/model/responseDataListMusicTopUsedDto';
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
import { MusicDto } from './swagger-auto-generated';

@Injectable({
  providedIn: 'root'
})
export class MusicService {

  constructor(private musicApi: MusicControllerService,
              private spaceStorage: SpaceStorageService
    ) { }

  findAllBySpace(): Observable<Array<MusicWithSingerAndLinksDto>> {
    return this.musicApi.findAllMusicUsingGET()
    .pipe(
      catchError(this.handleError),
      map((resData: ResponseDataSetMusicWithSingerAndLinksDto) => {
        return resData?.content || [];
      })
    );
  }

  findAllAssociationForEvents(): Observable<Array<MusicOnlyIdAndMusicNameAndSingerNameDto>> {
    return this.musicApi.findMusicsAssociationForEventsBySpaceUsingGET()
    .pipe(
      catchError(this.handleError),
      map((resData: ResponseDataListMusicOnlyIdAndMusicNameAndSingerNameDto) => {
        return resData?.content || [];
      })
    );
  }

  findTop10MusicMoreUsedInEvents(spaceIdParam?: string): Observable<Array<MusicTopUsedDto>> {
    return this.musicApi.findTop10MusicMoreUsedInEventsUsingGET()
    .pipe(
      catchError(this.handleError),
      map((resData: ResponseDataListMusicTopUsedDto) => {
        return resData?.content || [];
      })
    );
  }

  findAllSingerBySpace(): Observable<Array<SingerDto>> {
    return this.musicApi.findAllSingerUsingGET()
    .pipe(
      catchError(this.handleError),
      map((resData: ResponseDataSetSingerDto) => {
        return resData?.content || [];
      })
    );
  }

  findAllEventsOfMusic(musicId: string): Observable<MusicDto> {
    return this.musicApi.findByIdUsingGET1(musicId, false)
    .pipe(
      catchError(this.handleError),
      map((resData: ResponseDataMusicDto) => {
        return resData?.content || {};
      })
    );
  }

  findOldEventsFromRange3Months(musicId: string): Observable<MusicDto> {
    return this.musicApi.findByIdUsingGET1(musicId, true)
    .pipe(
      catchError(this.handleError),
      map((resData: ResponseDataMusicDto) => {
        return resData?.content || {};
      })
    );
  }

  create(body: MusicWithSingerAndLinksDto): Observable<MusicWithSingerAndLinksDto> {
    return this.musicApi.createMusicUsingPOST(body)
    .pipe(
      catchError(this.handleError),
      map((resData: any) => {
        return resData?.content;
      })
    );
  }

  edit(idMusic: string, body: MusicWithSingerAndLinksDto): Observable<MusicWithSingerAndLinksDto> {
    return this.musicApi.updateMusicUsingPUT(idMusic, body)
    .pipe(
      catchError(this.handleError),
      map((resData: any) => {
        return resData?.content;
      })
    );
  }

  delete(idMusic: string): Observable<any> {
    return this.musicApi.deleteMusicUsingDELETE(idMusic)
    .pipe(
      catchError(this.handleError),
      map((resData: any) => {
        return resData?.content;
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
