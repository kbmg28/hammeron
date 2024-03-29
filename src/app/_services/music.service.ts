import { ResponseDataMusicDto } from './swagger-auto-generated/model/responseDataMusicDto';
import { MusicTopUsedDto } from './swagger-auto-generated/model/musicTopUsedDto';
import { ResponseDataListMusicTopUsedDto } from './swagger-auto-generated/model/responseDataListMusicTopUsedDto';
import { SpaceStorageService } from './space-storage.service';
import { ResponseDataSetSingerDto } from './swagger-auto-generated/model/responseDataSetSingerDto';
import { SingerDto } from './swagger-auto-generated/model/singerDto';
import { MusicWithSingerAndLinksDto } from './swagger-auto-generated/model/musicWithSingerAndLinksDto';
import { map, catchError } from 'rxjs/operators';
import { ResponseDataSetMusicWithSingerAndLinksDto } from './swagger-auto-generated/model/responseDataSetMusicWithSingerAndLinksDto';
import { Observable } from 'rxjs';
import { MusicControllerService } from './swagger-auto-generated/api/musicController.service';
import { Injectable } from '@angular/core';
import { handleError } from './../constants/HandlerErrorHttp'
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
      catchError(handleError),
      map((resData: ResponseDataSetMusicWithSingerAndLinksDto) => {
        return resData?.content || [];
      })
    );
  }

  findAllAssociationForEvents(): Observable<Array<MusicTopUsedDto>> {
    return this.musicApi.findMusicsAssociationForEventsBySpaceUsingGET()
    .pipe(
      catchError(handleError),
      map((resData: ResponseDataListMusicTopUsedDto) => {
        return resData?.content || [];
      })
    );
  }

  findTop10MusicMoreUsedInEvents(spaceIdParam?: string): Observable<Array<MusicTopUsedDto>> {
    return this.musicApi.findTop10MusicMoreUsedInEventsUsingGET()
    .pipe(
      catchError(handleError),
      map((resData: ResponseDataListMusicTopUsedDto) => {
        return resData?.content || [];
      })
    );
  }

  findAllSingerBySpace(): Observable<Array<SingerDto>> {
    return this.musicApi.findAllSingerUsingGET()
    .pipe(
      catchError(handleError),
      map((resData: ResponseDataSetSingerDto) => {
        return resData?.content || [];
      })
    );
  }

  findAllEventsOfMusic(musicId: string): Observable<MusicDto> {
    return this.musicApi.findByIdUsingGET1(musicId, false)
    .pipe(
      catchError(handleError),
      map((resData: ResponseDataMusicDto) => {
        return resData?.content || {};
      })
    );
  }

  findOldEventsFromRange3Months(musicId: string): Observable<MusicDto> {
    return this.musicApi.findByIdUsingGET1(musicId, true)
    .pipe(
      catchError(handleError),
      map((resData: ResponseDataMusicDto) => {
        return resData?.content || {};
      })
    );
  }

  create(body: MusicWithSingerAndLinksDto): Observable<MusicWithSingerAndLinksDto> {
    return this.musicApi.createMusicUsingPOST(body)
    .pipe(
      catchError(handleError),
      map((resData: any) => {
        return resData?.content;
      })
    );
  }

  edit(idMusic: string, body: MusicWithSingerAndLinksDto): Observable<MusicWithSingerAndLinksDto> {
    return this.musicApi.updateMusicUsingPUT(idMusic, body)
    .pipe(
      catchError(handleError),
      map((resData: any) => {
        return resData?.content;
      })
    );
  }

  delete(idMusic: string): Observable<any> {
    return this.musicApi.deleteMusicUsingDELETE(idMusic)
    .pipe(
      catchError(handleError),
      map((resData: any) => {
        return resData?.content;
      })
    );
  }

}
