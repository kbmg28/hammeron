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
    const spaceId = this.spaceStorage.getSpace().spaceId;

    return this.musicApi.findAllMusicUsingGET(spaceId)
    .pipe(
      catchError(this.handleError),
      map((resData: ResponseDataSetMusicWithSingerAndLinksDto) => {
        return resData?.content || [];
      })
    );
  }

  findTop10MusicMoreUsedInEvents(): Observable<Array<MusicTopUsedDto>> {
    const spaceId = this.spaceStorage.getSpace().spaceId;

    return this.musicApi.findTop10MusicMoreUsedInEventsUsingGET(spaceId)
    .pipe(
      catchError(this.handleError),
      map((resData: ResponseDataListMusicTopUsedDto) => {
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

  findAllEventsOfMusic(musicId: string): Observable<MusicDto> {
    const spaceId = this.spaceStorage.getSpace().spaceId;

    return this.musicApi.findByIdUsingGET1(spaceId, musicId, false)
    .pipe(
      catchError(this.handleError),
      map((resData: ResponseDataMusicDto) => {
        return resData?.content || {};
      })
    );
  }

  findOldEventsFromRange3Months(musicId: string): Observable<MusicDto> {
    const spaceId = this.spaceStorage.getSpace().spaceId;

    return this.musicApi.findByIdUsingGET1(spaceId, musicId, true)
    .pipe(
      catchError(this.handleError),
      map((resData: ResponseDataMusicDto) => {
        return resData?.content || {};
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

  edit(idMusic: string, body: MusicWithSingerAndLinksDto): Observable<MusicWithSingerAndLinksDto> {
    const spaceId = this.spaceStorage.getSpace().spaceId;

    return this.musicApi.updateMusicUsingPUT(spaceId, idMusic, body)
    .pipe(
      catchError(this.handleError),
      map((resData: any) => {
        return resData?.content;
      })
    );
  }

  delete(idMusic: string): Observable<any> {
    const spaceId = this.spaceStorage.getSpace().spaceId;

    return this.musicApi.deleteMusicUsingDELETE(spaceId, idMusic)
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
